import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCreateDTO } from '../dtos/account-create.dto';
import { AccountEntity } from '../entities/accounts.entity';
import { AccountMapper } from '../mappers/accounts.mapper';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private repository: Repository<AccountEntity>,
    private mapper: AccountMapper,
  ) {}

  getAllAccounts(): Promise<AccountEntity[]> {
    return this.repository.find({ relations: ['accountDaily', 'scholar'] });
  }

  getAccountByAddress(address: string) {
    return this.repository.findOne({ where: { roninAddress: address } });
  }

  updateAccount(account: AccountEntity) {
    return this.repository.update({ id: account.id }, account);
  }

  create(account: AccountCreateDTO) {
    return this.repository.save(account);
  }
}
