import { ApiProperty } from '@nestjs/swagger';

export class AccountDailyDTO {
  @ApiProperty()
  readonly id?: string;

  @ApiProperty()
  readonly pvpWin: number;

  @ApiProperty()
  readonly pvpLose: number;

  @ApiProperty()
  readonly pvpDraw: number;

  @ApiProperty()
  readonly dayMMR: number;

  @ApiProperty()
  readonly daySLP: number;

  @ApiProperty()
  readonly date: Date;

  constructor(
    id: string,
    pvpWin: number,
    pvpLose: number,
    pvpDraw: number,
    dayMMR: number,
    daySLP: number,
    date: Date,
  ) {
    this.id = id;
    this.pvpWin = pvpWin;
    this.pvpLose = pvpLose;
    this.pvpDraw = pvpDraw;
    this.dayMMR = dayMMR;
    this.daySLP = daySLP;
    this.date = date;
  }
}
