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

  @Column({ name: 'total_slp' })
  readonly totalSLP: number;

  @Column({ name: 'total_ronin_slp' })
  readonly totalRoninSLP: number;

  @Column({ name: 'in_game_slp' })
  readonly inGameSLP: number;

  @Column({ name: 'last_claim' })
  readonly lastClaim: number;

  @Column({ name: 'next_claim' })
  readonly nextClaim: number;

  @Column({ name: 'pvp_win' })
  readonly pvpWin: number;

  @Column({ name: 'pvp_lose' })
  readonly pvpLose: number;

  @Column({ name: 'pvp_draw' })
  readonly pvpDraw: number;

  @Column({ name: 'slp_price', type: 'float' })
  readonly slpPrice: number;

  @Column()
  readonly pve: number;

  @Column()
  readonly mmr: number;

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
