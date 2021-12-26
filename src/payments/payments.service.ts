import { Injectable, Logger } from '@nestjs/common';
import { DateTime, Interval } from 'luxon';
import { AccountDailyDTO } from 'src/accounts/dtos/accounts-daily.dto';
import { AccountDTO } from 'src/accounts/dtos/accounts.dto';
import { ScholarDTO } from 'src/scholars/dtos/scholar.dto';
import { CalculatePaymentDTO } from './dtos/calculate-payment.dto';
import { NextPaymentDTO } from './dtos/next-payments.dto';
import { PaymentSummaryDTO } from './dtos/payment-summary.dto';
import { PaymentDTO } from './dtos/payment.dto';
import { CreatePayment } from './interfaces/create-payment.interface';
import { PaymentsMapper } from './payments.mapper';
import { PaymentsRepository } from './payments.repository';

const INITIAL_SUMMARY: PaymentSummaryDTO = {
  totalSLP: 0,
  totalToPay: 0,
  totalSLPToOwn: 0,
  totalExpectedSLP: 0,
  totalExpectedSLPToPay: 0,
  totalExpectedSLPToOwn: 0,
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private repository: PaymentsRepository,
    private mapper: PaymentsMapper,
  ) {}

  private getNextFortnight() {
    const today = DateTime.now();
    return today.day > 15
      ? today.endOf('month')
      : today.plus({ days: 15 - today.day });
  }

  private getLastFortnight() {
    const today = DateTime.now();
    return today.day <= 15
      ? today.startOf('month')
      : today.minus({ days: today.day - 15 });
  }

  private getPaymentProportion(average: number, scholar?: ScholarDTO) {
    if (scholar) {
      const initial = DateTime.fromJSDate(scholar.entryDate);
      console.log(`Scholar ${scholar.name} enter ${scholar.entryDate}`);
      const now = DateTime.utc();
      const sinceBeginning = Interval.fromDateTimes(initial, now);
      console.log(`Days since beginning ${sinceBeginning.length('days')}`);
      if (sinceBeginning.length('days') <= 30) return 0.15;
    }
    console.log(`Average: ${average}`);
    if (average >= 200) return 0.5;
    if (average >= 167) return 0.4;
    if (average >= 143) return 0.3;
    return 0;
  }

  private isBetween(dailyDate: Date, lastDay: DateTime, firstDay: DateTime) {
    const date = DateTime.fromJSDate(dailyDate);
    const isAfterFirstDay = firstDay < date.set({ hour: 23, minute: 59 });
    const isBeforeLastDay = date < lastDay.set({ hour: 23, minute: 59 });
    return isAfterFirstDay && isBeforeLastDay;
  }

  getAll() {
    return this.repository.getAll();
  }

  getNextPayment(
    daily: AccountDailyDTO[],
    calculatePaymentDTO: CalculatePaymentDTO,
  ) {
    const { end_date, start_date, payment_proportion } = calculatePaymentDTO;
    const nextFortnight = end_date
      ? DateTime.fromJSDate(end_date)
      : this.getNextFortnight();
    const lastFortnight = start_date
      ? DateTime.fromJSDate(start_date)
      : this.getLastFortnight();
    this.logger.log(
      `Daily between ${lastFortnight.toISODate()} and ${nextFortnight.toISODate()}`,
    );
    const paymentDays = daily.filter((day) =>
      this.isBetween(day.date, nextFortnight, lastFortnight),
    );
    const totalSLP = paymentDays.reduce((accum, day) => {
      return accum + day.daySLP;
    }, 0);
    this.logger.log(`Total SLP: ${totalSLP}`);
    const average =
      paymentDays.length === 0 ? 0 : totalSLP / paymentDays.length;
    this.logger.log(`Average SLP: ${average}`);
    const proportion = payment_proportion || this.getPaymentProportion(average);
    return {
      ownSLP: totalSLP * proportion,
      scholarSLP: totalSLP * (1 - proportion),
    };
  }

  getNextPayments(accounts: AccountDTO[]): NextPaymentDTO {
    const nextFortnight = this.getNextFortnight();
    const lastFortnight = this.getLastFortnight();
    const summary = INITIAL_SUMMARY;
    const intervalDaysLeft = Interval.fromDateTimes(
      DateTime.now(),
      nextFortnight,
    );
    const daysLeft = Math.ceil(intervalDaysLeft.length('days'));
    this.logger.log(`Left ${daysLeft} days. Next payment: ${nextFortnight}`);
    const payments = accounts.map<PaymentDTO>((account) => {
      this.logger.log(`Calculating payment for ${account.roninAddress}`);
      const lastClaim = DateTime.fromMillis(account.lastClaim * 1000);
      const days = account.accountDaily.filter((daily) =>
        this.isBetween(daily.date, DateTime.now(), lastClaim),
      );
      this.logger.log(
        `${days.length} days since last payment on: ${lastClaim.toJSDate()}`,
      );
      const totalSLP = days.reduce((accum, day) => accum + day.daySLP, 0);
      console.log(`${account.scholar.name}: Days since ${days.length}`);
      const average = days.length === 0 ? 0 : totalSLP / days.length;
      const proportion = this.getPaymentProportion(average, account.scholar);
      const payment = {
        scholar: account.scholar,
        nextScholarPayment: totalSLP * proportion,
        average,
        proportion,
        totalSLP,
        expectedTotalSLPToPay: (daysLeft * average + totalSLP) * proportion,
        expectedTotalSLP: daysLeft * average + totalSLP,
      };
      summary.totalSLP += totalSLP;
      summary.totalToPay += totalSLP * proportion;
      summary.totalSLPToOwn += totalSLP * (1 - proportion);
      summary.totalExpectedSLP += payment.expectedTotalSLP;
      summary.totalExpectedSLPToPay += payment.expectedTotalSLPToPay;
      summary.totalExpectedSLPToOwn +=
        payment.expectedTotalSLP * (1 - proportion);
      return payment;
    });
    return {
      payments,
      summary,
      nextFortnight,
      lastFortnight,
    };
  }

  save(body: CreatePayment) {
    const payment = this.mapper.createPaymentToEntity(body);
    return this.repository.save(payment);
  }
}
