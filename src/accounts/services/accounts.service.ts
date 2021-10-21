import { Injectable } from '@nestjs/common';
import { AccountDTO } from '../dtos/accounts.dto';
import { AccountMapper } from '../mappers/accounts.mapper';
import { AccountsRepository } from '../repositories/accounts.repository';

@Injectable()
export class AccountsService {
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
}
