import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { ScholarEntity } from 'src/scholars/scholars.entity';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { CreatePayment } from './interfaces/create-payment.interface';
import { PaymentEntity } from './payments.entity';

@Injectable()
export class PaymentsMapper {
  createPaymentToEntity(createPayment: CreatePayment) {
    const payment = new PaymentEntity();
    payment.startDate = createPayment.startDate;
    payment.endDate = createPayment.endDate;
    payment.managerAccount = createPayment.managerAccount;
    payment.scholarAccount = createPayment.scholarAccount;
    payment.paymentProportion = createPayment.paymentProportion;
    payment.transactionHash = createPayment.transactionHash;
    payment.slp = createPayment.slp;
    return payment;
  }
}
