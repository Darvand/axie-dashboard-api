import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './controllers/accounts.controller';
import { AccountDailyEntity } from './entities/accounts-daily.entity';
import { AccountDailyMapper } from './mappers/accounts-daily.mapper';
import { AccountsDailyRepository } from './repositories/accounts-daily.repository';
import { AccountsDailyService } from './services/accounts-daily.service';
import { AxieApiService } from './services/axie-api.service';
import { AccountMapper } from './mappers/accounts.mapper';
import { AccountsRepository } from './repositories/accounts.repository';
import { AccountsService } from './services/accounts.service';
import { AccountEntity } from './entities/accounts.entity';
import { CriptocurrenciesMapper } from './mappers/criptocurrencies.mapper';
import { CriptocurrenciesService } from './services/criptocurrencies.service';
import { CriptocurrenciesRepository } from './repositories/criptocurrencies.repository';
import { CriptocurrenciesEntity } from './entities/criptocurrencies.entity';
import { AccountTask } from './accounts.task';
import { CoinMarketApiService } from './services/coin-market-api.service';
import { TrackerService } from './services/tracker.service';
import { CoinController } from './controllers/coin.controller';
import { DailyAccountsController } from './controllers/daily.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountDailyEntity,
      AccountEntity,
      CriptocurrenciesEntity,
    ]),
    HttpModule,
  ],
  controllers: [AccountsController, CoinController, DailyAccountsController],
  providers: [
    AccountDailyMapper,
    AccountsDailyRepository,
    AccountsDailyService,
    AxieApiService,
    AccountMapper,
    AccountsRepository,
    AccountsService,
    CriptocurrenciesMapper,
    CriptocurrenciesService,
    CriptocurrenciesRepository,
    AccountTask,
    CoinMarketApiService,
    TrackerService,
  ],
  exports: [AccountsService, AccountsDailyService],
})
export class AccountsModule {}
