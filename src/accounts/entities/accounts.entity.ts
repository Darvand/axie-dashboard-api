import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountDailyEntity } from './accounts-daily.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true, name: 'ronin_address' })
  readonly roninAddress: string;

  @OneToMany(() => AccountDailyEntity, (accountDaily) => accountDaily.account, {
    nullable: false,
  })
  readonly accountDaily: AccountDailyEntity[];

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

  constructor(id: string, roninAddress: string) {
    this.id = id;
    this.roninAddress = roninAddress;
    console.log(`Account ${roninAddress} created`);
  }
}
