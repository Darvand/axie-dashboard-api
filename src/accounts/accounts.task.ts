import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { catchError, map } from 'rxjs';
import { AccountsDailyService } from './services/accounts-daily.service';
import { AccountsService } from './services/accounts.service';
import { CoinMarketApiService } from './services/coin-market-api.service';
import { CriptocurrenciesService } from './services/criptocurrencies.service';

@Injectable()
export class AccountTask {
  private readonly logger = new Logger(AccountTask.name);

  constructor(
    private accountsService: AccountsService,
    private criptocurrenciesService: CriptocurrenciesService,
    private coinMarketApi: CoinMarketApiService,
    private accountsDailyService: AccountsDailyService,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
  //   utcOffset: 0,
  // })
  // @Cron('* 7 23 * * *', { utcOffset: 0 })
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 0 })
  async populateDailyAccount() {
    const now = DateTime.utc();
    this.logger.log(
      `Running populate daily account task at: ${now.toString()}`,
    );
    const accounts = await this.accountsService.getAllAccounts();
    this.logger.log(`Found ${accounts.length} accounts`);
    const response = await this.coinMarketApi.getCurrentSLPPrice();
    const slpPrice = response.data.quote.USD.price;
    this.logger.log(`Current SLP price is ${slpPrice}`);
    await this.criptocurrenciesService.insertCriptocurrencies(slpPrice);
    return Promise.all(
      accounts.map((account) =>
        this.accountsDailyService.createDailyInformation(account, slpPrice),
      ),
    );
  }
}
