import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PutDailyDTO } from '../dtos/put-daily.dto';
import { AccountsDailyService } from '../services/accounts-daily.service';
import { AccountsService } from '../services/accounts.service';

@Controller('accounts/:ronin/daily')
export class DailyAccountsController {
  constructor(
    private service: AccountsDailyService,
    private accountService: AccountsService,
  ) {}

  @Put()
  updateDaily(@Param('ronin') ronin: string, @Body() body: PutDailyDTO) {
    return this.service.update(body);
  }

  @Get()
  getAccountDaily(@Param('ronin') ronin: string) {
    return this.service.getAllDailyFromRonin(ronin);
  }

  @Post()
  async saveDaily(@Param('ronin') ronin: string, @Body() body: PutDailyDTO) {
    const account = await this.accountService.getAccountByAddress(ronin);
    if (!account) {
      throw new NotFoundException(`Ronin ${ronin} not found`);
    }
    return this.service.save(body, account);
  }
}
