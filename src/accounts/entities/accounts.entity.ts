import { ScholarEntity } from 'src/scholars/scholars.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountDailyEntity } from './accounts-daily.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'ronin_address' })
  roninAddress: string;

  @OneToMany(() => AccountDailyEntity, (accountDaily) => accountDaily.account, {
    nullable: false,
  })
  accountDaily: AccountDailyEntity[];

  @Column({ name: 'ronin_slp', default: 0 })
  roninSLP: number;

  @Column({ name: 'in_game_slp', default: 0 })
  inGameSLP: number;

  @Column({ name: 'total_slp', default: 0 })
  totalSLP: number;

  @Column({ name: 'lifetime_slp', default: 0 })
  lifetimeSLP: number;

  @Column({ default: 0 })
  mmr: number;

  @Column({ default: 0 })
  rank: number;

  @Column({ name: 'last_claim', default: 0 })
  lastClaim: number;

  @Column({ name: 'next_claim', default: 0 })
  nextClaim: number;

  @OneToOne(() => ScholarEntity, (scholar) => scholar.account)
  @JoinColumn()
  scholar: ScholarEntity;

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
    this.inGameSLP = inGameSLP;
    this.totalSLP = totalSLP;
    this.lifetimeSLP = lifetimeSLP;
    this.mmr = mmr;
    this.rank = rank;
    this.lastClaim = lastClaim;
    this.nextClaim = nextClaim;
  }
}
