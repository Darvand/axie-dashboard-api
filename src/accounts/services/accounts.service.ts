import { Injectable, Logger } from '@nestjs/common';
import { AccountCreateDTO } from '../dtos/account-create.dto';
import { AccountDTO } from '../dtos/accounts.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountEntity } from '../entities/accounts.entity';
import { AccountMapper } from '../mappers/accounts.mapper';
import { AccountsRepository } from '../repositories/accounts.repository';
import { SLPResponse } from '../types/slp-response.type';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private repository: AccountsRepository,
    private mapper: AccountMapper,
  ) {}

  getAllAccounts(): Promise<AccountDTO[]> {
    return this.repository.getAllAccounts();
  }

  getAccountByAddress(address: string) {
    const fixedAddress = address.replace('0x', 'ronin:');
    return this.repository.getAccountByAddress(fixedAddress);
  }

  updateAccount(account: AccountEntity) {
    return this.repository.updateAccount(account);
  }

  async create(ronin: string, roninResponse: SLPResponse) {
    const account = new AccountCreateDTO(ronin, roninResponse);
    return this.repository.create(account);
  }

  async getSummaryAccounts(lastDaily: AccountDailyEntity[]) {
    const accounts = await this.repository.getAllAccounts();
    return accounts.map((account) => {
      const [daily] = lastDaily.filter(
        (day) => day.account.roninAddress === account.roninAddress,
      );
      return this.mapper.getYesterdaySummary(account, daily);
    });
  }
}
