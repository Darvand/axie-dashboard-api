import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDTO {
  @ApiProperty()
  readonly start_date: Date;

  @ApiProperty()
  readonly end_date: Date;

  @ApiProperty()
  readonly payment_proportion: number;

  @ApiProperty()
  readonly manager_account: string;

  @ApiProperty()
  readonly scholar_account: string;

  @ApiProperty()
  readonly transaction_hash: string;

  @ApiProperty()
  readonly slp: number;

  constructor(
    startDate: Date,
    endDate: Date,
    paymentProportion: number,
    managerAccount: string,
    scholarAccount: string,
    transactionHash: string,
    slp: number,
  ) {
    this.start_date = startDate;
    this.end_date = endDate;
    this.payment_proportion = paymentProportion;
    this.manager_account = managerAccount;
    this.scholar_account = scholarAccount;
    this.transaction_hash = transactionHash;
    this.slp = slp;
  }
}
