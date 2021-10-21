import { ApiProperty } from '@nestjs/swagger';
import { AccountDailyDTO } from './accounts-daily.dto';

export class AccountDTO {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly roninAddress: string;

  @ApiProperty()
  readonly accountDaily: AccountDailyDTO[];

  constructor(id: string, roninAddress: string) {
    this.id = id;
    this.roninAddress = roninAddress;
  }
}
