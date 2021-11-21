import { ApiProperty } from '@nestjs/swagger';

export class CalculatePaymentDTO {
  @ApiProperty({ nullable: true })
  readonly start_date: Date;

  @ApiProperty({ nullable: true })
  readonly end_date: Date;

  @ApiProperty({ nullable: true })
  readonly payment_proportion: number;

  constructor(startDate: Date, endDate: Date, paymentProportion: number) {
    this.start_date = startDate;
    this.end_date = endDate;
    this.payment_proportion = paymentProportion;
  }
}
