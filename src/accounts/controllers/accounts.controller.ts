import {
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AccountTask } from '../accounts.task';
import { AccountsDailyService } from '../services/accounts-daily.service';
import { AccountsService } from '../services/accounts.service';
import { AxieApiService } from '../services/axie-api.service';
import { TrackerService } from '../services/tracker.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private accountsService: AccountsService,
    private taskService: AccountTask,
    private trackerService: TrackerService,
    private axieService: AxieApiService,
    private dailyService: AccountsDailyService,
  ) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get('summary')
  async getSummaryAccounts() {
    const lastDaily = await this.dailyService.getLastDaily();
    return this.accountsService.getSummaryAccounts(lastDaily);
  }

  @Get(':roninAccount')
  getAllDailiesByRonin(@Param('roninAccount') ronin: string) {
    return this.accountsService.getAccountByAddress(ronin);
  }

  @Post(':roninAddress')
  async createAccount(@Param('roninAddress') ronin: string) {
    const roninResponse = await this.axieService.getTodaySLP(ronin);
    const previous = await this.accountsService.getAccountByAddress(ronin);
    if (previous) {
      throw new ConflictException(
        `Account whit address ${ronin} already exists`,
      );
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
