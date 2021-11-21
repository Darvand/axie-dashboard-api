import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { ScholarEntity } from 'src/scholars/scholars.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => AccountEntity, (account) => account.payments)
  managerAccount: AccountEntity;

  @ManyToOne(() => ScholarEntity, (scholar) => scholar.payments)
  scholarAccount: ScholarEntity;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'float', name: 'payment_proportion' })
  paymentProportion: number;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;

  @Column()
  slp: number;

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
