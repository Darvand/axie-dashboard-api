import { ApiProperty } from '@nestjs/swagger';

export class PaymentSummaryDTO {
  @ApiProperty({ nullable: false })
  totalSLP: number;
  @ApiProperty({ nullable: false })
  totalToPay: number;
  @ApiProperty({ nullable: false })
  totalSLPToOwn: number;
  @ApiProperty({ nullable: false })
  totalExpectedSLP: number;
  @ApiProperty({ nullable: false })
  totalExpectedSLPToPay: number;
  @ApiProperty({ nullable: false })
  totalExpectedSLPToOwn: number;
}
