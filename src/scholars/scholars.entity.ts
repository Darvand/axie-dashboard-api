import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { PaymentEntity } from 'src/payments/payments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => PaymentEntity, (payment) => payment.scholarAccount)
  payments: PaymentEntity[];

  @Column({ unique: true })
  name: string;

  @Column({ name: 'payment_ronin_address', nullable: true })
  paymentRoninAddress: string;

  @Column({ name: 'entry_date', nullable: true })
  entryDate: Date;

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
