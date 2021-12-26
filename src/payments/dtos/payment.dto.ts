import { ApiProperty } from '@nestjs/swagger';
import { ScholarDTO } from 'src/scholars/dtos/scholar.dto';

export class PaymentDTO {
  @ApiProperty()
  scholar: ScholarDTO;

  @ApiProperty({ nullable: false })
  nextScholarPayment: number;

  @ApiProperty({ nullable: false })
  average: number;

  @ApiProperty({ nullable: false })
  proportion: number;

  @ApiProperty({ nullable: false })
  totalSLP: number;

  @ApiProperty({ nullable: false })
  expectedTotalSLP: number;

  @ApiProperty({ nullable: false })
  expectedTotalSLPToPay: number;
}
