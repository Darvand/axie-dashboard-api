import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('scholars')
export class ScholarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AccountEntity, (account) => account.id, {
    nullable: false,
  })
  account: AccountEntity;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'payment_ronin_address', nullable: true })
  paymentRoninAddress: string;

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
}
