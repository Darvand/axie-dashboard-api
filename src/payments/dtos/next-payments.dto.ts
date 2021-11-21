import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { PaymentDTO } from './payment.dto';

export class NextPaymentDTO {
  @ApiProperty({ nullable: false })
  payments: PaymentDTO[];

  @ApiProperty({ nullable: false })
  nextFortnight: DateTime;

  @ApiProperty({ nullable: false })
  lastFortnight: DateTime;
}
