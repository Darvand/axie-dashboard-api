import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Between, Repository } from 'typeorm';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountEntity } from '../entities/accounts.entity';
import { AccountDailyMapper } from '../mappers/accounts-daily.mapper';

@Injectable()
export class AccountsDailyRepository {
  constructor(
    @InjectRepository(AccountDailyEntity)
    private repository: Repository<AccountDailyEntity>,
    private mapper: AccountDailyMapper,
  ) {}

  getAllDailyForAccount(account: AccountEntity): Promise<AccountDailyEntity[]> {
    return this.repository.find({
      where: { account },
      order: { createAt: 'DESC' },
    });
  }

  saveDaily(accountDaily: AccountDailyEntity) {
    return this.repository.save(accountDaily);
  }

  getDailyByDate(date: DateTime, accountID: string) {
    const initialDate = date.set({ hour: 0, minute: 0, second: 0 });
    const finalDate = initialDate.plus({ days: 1, seconds: -1 });
    return this.repository.findOne({
      where: {
        date: Between(initialDate.toISODate(), finalDate.toISODate()),
        account: { id: accountID },
      },
    });
  }
}
