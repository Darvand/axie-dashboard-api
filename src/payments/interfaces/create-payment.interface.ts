import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { ScholarEntity } from 'src/scholars/scholars.entity';

export interface CreatePayment {
  startDate: Date;
  endDate: Date;
  paymentProportion: number;
  managerAccount: AccountEntity;
  scholarAccount: ScholarEntity;
  transactionHash: string;
  slp: number;
}
