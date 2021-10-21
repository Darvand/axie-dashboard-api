import { ApiProperty } from '@nestjs/swagger';

export class AccountDailyDTO {
  @ApiProperty()
  readonly id?: string;

  @ApiProperty()
  readonly totalSLP: number;

  @ApiProperty()
  readonly totalRoninSLP: number;

  @ApiProperty()
  readonly inGameSLP: number;

  @ApiProperty()
  readonly lastClaim: number;

  @ApiProperty()
  readonly nextClaim: number;

  @ApiProperty()
  readonly pvpWin: number;

  @ApiProperty()
  readonly pvpLose: number;

  @ApiProperty()
  readonly pvpDraw: number;

  @ApiProperty()
  readonly pve: number;

  @ApiProperty()
  readonly mmr: number;

  @ApiProperty()
  readonly slpPrice: number;

  constructor(
    id: string,
    totalSLP: number,
    totalRoninSLP: number,
    inGameSLP: number,
    lastClaim: number,
    nextClaim: number,
    pvpWin: number,
    pvpLose: number,
    pvpDraw: number,
    pve: number,
    mmr: number,
    slpPrice: number,
  ) {
    this.id = id;
    this.totalSLP = totalSLP;
    this.totalRoninSLP = totalRoninSLP;
    this.inGameSLP = inGameSLP;
    this.lastClaim = lastClaim;
    this.nextClaim = nextClaim;
    this.pvpWin = pvpWin;
    this.pvpLose = pvpLose;
    this.pvpDraw = pvpDraw;
    this.pve = pve;
    this.mmr = mmr;
    this.slpPrice = slpPrice;
    console.log(`Account daily created with ${totalSLP} SLP`);
  }
}
