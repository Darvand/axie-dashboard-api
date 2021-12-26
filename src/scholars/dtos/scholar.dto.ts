import { ApiProperty } from '@nestjs/swagger';

export class ScholarDTO {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly paymentRoninAddress: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly entryDate: Date;
}
