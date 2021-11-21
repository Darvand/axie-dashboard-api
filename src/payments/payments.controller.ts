import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AccountsDailyService } from 'src/accounts/services/accounts-daily.service';
import { AccountsService } from 'src/accounts/services/accounts.service';
import { ScholarsService } from 'src/scholars/scholars.service';
import { CalculatePaymentDTO } from './dtos/calculate-payment.dto';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { CreatePayment } from './interfaces/create-payment.interface';
import { PaymentsService } from './payments.service';
import { ValidateCreatePayment } from './pipes/create-payment.pipe';

@Controller('payments')
export class PaymentsController {
  constructor(
    private dailyService: AccountsDailyService,
    private paymentsService: PaymentsService,
    private accountsService: AccountsService,
    private scholarsService: ScholarsService,
  ) {}

  @Get('next')
  async getNextPayments() {
    const accounts = await this.accountsService.getAllAccounts();
    return this.paymentsService.getNextPayments(accounts);
  }

  @Get(':ronin')
  async getPaymentByRonin(
    @Param('ronin') roninAddress: string,
    @Body() calculatePaymentDTO: CalculatePaymentDTO,
  ) {
    const daily = await this.dailyService.getAllDailyFromRonin(roninAddress);
    return this.paymentsService.getNextPayment(daily, calculatePaymentDTO);
  }

  @UsePipes(ValidateCreatePayment)
  @Post()
  async savePayment(@Body() body: CreatePayment) {
    return this.paymentsService.save(body);
  }
}
