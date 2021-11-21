import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ScholarsModule } from 'src/scholars/scholars.module';
import { PaymentsController } from './payments.controller';
import { PaymentEntity } from './payments.entity';
import { PaymentsMapper } from './payments.mapper';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    AccountsModule,
    ScholarsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, PaymentsMapper],
})
export class PaymentsModule {}
