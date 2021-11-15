import { ApiProperty } from '@nestjs/swagger';
import { AccountDailyDTO } from './accounts-daily.dto';

export class AccountDTO {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly roninAddress: string;

  @ApiProperty()
  readonly accountDaily: AccountDailyDTO[];

  @ApiProperty()
  roninSLP: number;

  @ApiProperty()
  inGameSLP: number;

  @ApiProperty()
  totalSLP: number;

  @ApiProperty()
  lifetimeSLP: number;

  @ApiProperty()
  mmr: number;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  lastClaim: number;

  @ApiProperty()
  nextClaim: number;

  constructor(
    id: string,
    roninAddress: string,
    roninSLP: number,
    inGameSLP: number,
    totalSLP: number,
    lifetimeSLP: number,
    mmr: number,
    rank: number,
    lastClaim: number,
    nextClaim: number,
  ) {
    this.id = id;
    this.roninAddress = roninAddress;
    this.roninSLP = roninSLP;
    this.roninSLP = roninSLP;
    this.inGameSLP = inGameSLP;
    this.totalSLP = totalSLP;
    this.lifetimeSLP = lifetimeSLP;
    this.mmr = mmr;
    this.rank = rank;
    this.lastClaim = lastClaim;
    this.nextClaim = nextClaim;
  }
}
