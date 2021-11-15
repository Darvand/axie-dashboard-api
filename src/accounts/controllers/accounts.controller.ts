import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccountTask } from '../accounts.task';
import { AccountsDailyService } from '../services/accounts-daily.service';
import { AccountsService } from '../services/accounts.service';
import { AxieApiService } from '../services/axie-api.service';
import { CoinMarketApiService } from '../services/coin-market-api.service';
import { TrackerService } from '../services/tracker.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private service: AccountsDailyService,
    private accountsService: AccountsService,
    private coinMarketAPI: CoinMarketApiService,
    private taskService: AccountTask,
    private trackerService: TrackerService,
    private axieService: AxieApiService,
    private dailyService: AccountsDailyService,
  ) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':roninAccount')
  getAllDailiesByRonin(@Param('roninAccount') ronin: string) {
    return this.service.getAllDailyFromRonin(ronin);
  }

  @Post(':roninAddress')
  async createAccount(@Param('roninAddress') ronin: string) {
    const roninResponse = await this.axieService.getTodaySLP(ronin);
    const previous = await this.accountsService.getAccountByAddress(ronin);
    if (previous) {
      return previous;
    }
    const account = await this.accountsService.create(ronin, roninResponse);
    const tracker = await this.trackerService.getDaily(ronin);
    await this.dailyService.createByTracker(account, tracker);
    return account;
  }

  @Post()
  createDailyInformationToAll() {
    return this.taskService.populateDailyAccount();
  }
}
