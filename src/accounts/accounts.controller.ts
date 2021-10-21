import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsDailyService } from './services/accounts-daily.service';
import { AccountsService } from './services/accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private service: AccountsDailyService,
    private accountsService: AccountsService,
  ) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':roninAccount')
  getAllDailiesByRonin(@Param('roninAccount') ronin: string) {
    return this.service.getAllDaily();
  }

  @Post(':roninAddress')
  createDailyInformation(@Param('roninAddress') ronin: string) {
    return this.service.createDailyInformation(ronin);
  }
}
