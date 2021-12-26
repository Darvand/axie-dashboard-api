import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { PaymentSummaryDTO } from './payment-summary.dto';
import { PaymentDTO } from './payment.dto';

export class NextPaymentDTO {
  @ApiProperty({ nullable: false })
  payments: PaymentDTO[];

  @ApiProperty({ nullable: false })
  nextFortnight: DateTime;

  @ApiProperty({ nullable: false })
  lastFortnight: DateTime;

  @ApiProperty({ nullable: false })
  summary: PaymentSummaryDTO;
}
