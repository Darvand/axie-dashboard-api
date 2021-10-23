import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsDailyService } from './services/accounts-daily.service';
import { AccountsService } from './services/accounts.service';
import { CoinMarketApiService } from './services/coin-market-api.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private service: AccountsDailyService,
    private accountsService: AccountsService,
    private coinMarketAPI: CoinMarketApiService,
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
  createDailyInformation(@Param('roninAddress') ronin: string) {
    return this.coinMarketAPI.getCurrentSLPPrice();
  }
}
