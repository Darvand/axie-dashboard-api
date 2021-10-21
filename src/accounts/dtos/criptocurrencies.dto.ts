import { ApiProperty } from '@nestjs/swagger';

export class CriptocurrenciesDTO {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly slp: number;

  constructor(slp: number) {
    this.slp = slp;
  }
}
