import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { AccountDailyDTO } from 'src/accounts/dtos/accounts-daily.dto';
import { AccountDTO } from 'src/accounts/dtos/accounts.dto';
import { AccountDailyEntity } from 'src/accounts/entities/accounts-daily.entity';
import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { ScholarEntity } from 'src/scholars/scholars.entity';
import { CalculatePaymentDTO } from './dtos/calculate-payment.dto';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { NextPaymentDTO } from './dtos/next-payments.dto';
import { PaymentDTO } from './dtos/payment.dto';
import { CreatePayment } from './interfaces/create-payment.interface';
import { PaymentsMapper } from './payments.mapper';
import { PaymentsRepository } from './payments.repository';

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

  private getPaymentProportion(average: number) {
    if (average >= 214) return 0.5;
    if (average >= 178) return 0.4;
    if (average >= 153) return 0.3;
    return 0;
  }

  private isBetween(
    dailyDate: Date,
    nextFortnight: DateTime,
    lastFortNight: DateTime,
  ) {
    const date = DateTime.fromJSDate(dailyDate);
    if (date <= nextFortnight && date >= lastFortNight) {
      return true;
    }
    return false;
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
    this.logger.log(
      `Calculating payments between ${lastFortnight.toISODate()} and ${nextFortnight.toISODate()}`,
    );
    const payments = accounts.map<PaymentDTO>((account) => {
      const days = account.accountDaily.filter((daily) =>
        this.isBetween(daily.date, nextFortnight, lastFortnight),
      );
      const totalSLP = days.reduce((accum, day) => accum + day.daySLP, 0);
      const average = days.length === 0 ? 0 : totalSLP / days.length;
      const daysLeft = 15 - days.length;
      const proportion = this.getPaymentProportion(average);
      return {
        scholar: account.scholar,
        nextScholarPayment: totalSLP * proportion,
        average,
        proportion,
        totalSLP,
        expectedTotalSLP: daysLeft * average * proportion,
      };
    });
    return {
      payments,
      nextFortnight,
      lastFortnight,
    };
  }

  save(body: CreatePayment) {
    const payment = this.mapper.createPaymentToEntity(body);
    return this.repository.save(payment);
  }
}
