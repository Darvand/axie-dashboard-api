import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriptocurrenciesEntity } from '../entities/criptocurrencies.entity';
import { CriptocurrenciesMapper } from '../mappers/criptocurrencies.mapper';

@Injectable()
export class CriptocurrenciesRepository {
  constructor(
    @InjectRepository(CriptocurrenciesEntity)
    private repository: Repository<CriptocurrenciesEntity>,
    private mapper: CriptocurrenciesMapper,
  ) {}

  getAllCriptocurrenciesHistory() {
    return this.repository.find();
  }

  getLastCriptocurrencies() {
    return this.repository.findOne();
  }
}
