import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from './accounts.entity';

@Entity('accounts_daily')
export class AccountDailyEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'pvp_win' })
  readonly pvpWin: number;

  @Column({ name: 'pvp_lose' })
  readonly pvpLose: number;

  @Column({ name: 'pvp_draw' })
  readonly pvpDraw: number;

  @Column({ name: 'day_mmr', default: 0 })
  dayMMR: number;

  @Column({ name: 'day_slp', default: 0 })
  daySLP: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  date: Date;

  @ManyToOne(() => AccountEntity, (account) => account.accountDaily, {
    nullable: false,
  })
  @JoinColumn({ name: 'account_uuid' })
  account: AccountEntity;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  constructor(
    pvpWin: number,
    pvpLose: number,
    pvpDraw: number,
    dayMMR: number,
    daySLP: number,
    date: Date,
  ) {
    this.pvpWin = pvpWin;
    this.pvpLose = pvpLose;
    this.pvpDraw = pvpDraw;
    this.dayMMR = dayMMR;
    this.daySLP = daySLP;
    this.date = date;
  }
}
