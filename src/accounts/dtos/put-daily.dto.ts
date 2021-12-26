import { ApiProperty } from '@nestjs/swagger';

export class PutDailyDTO {
  @ApiProperty()
  pvpWin: number;

  @ApiProperty()
  pvpLose: number;

  @ApiProperty()
  pvpDraw: number;

  @ApiProperty()
  dayMMR: number;

  @ApiProperty()
  daySLP: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  mmr: number;

  @ApiProperty()
  roninSLP: number;

  @ApiProperty()
  inGameSLP: number;

  @ApiProperty()
  lifetimeSLP: number;
}
