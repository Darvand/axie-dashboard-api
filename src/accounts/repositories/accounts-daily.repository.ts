import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountDailyMapper } from '../mappers/accounts-daily.mapper';

@Injectable()
export class AccountsDailyRepository {
  constructor(
    @InjectRepository(AccountDailyEntity)
    private repository: Repository<AccountDailyEntity>,
    private mapper: AccountDailyMapper,
  ) {}

  getAllDailies(): Promise<AccountDailyEntity[]> {
    return this.repository.find();
  }

  saveDaily(accountDaily: AccountDailyEntity) {
    return this.repository.save(accountDaily);
  }
}
