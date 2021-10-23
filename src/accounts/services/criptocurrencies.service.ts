import { Injectable } from '@nestjs/common';
import { CriptocurrenciesEntity } from '../entities/criptocurrencies.entity';
import { CriptocurrenciesMapper } from '../mappers/criptocurrencies.mapper';
import { CriptocurrenciesRepository } from '../repositories/criptocurrencies.repository';

@Injectable()
export class CriptocurrenciesService {
  constructor(
    private repository: CriptocurrenciesRepository,
    private mapper: CriptocurrenciesMapper,
  ) {}

  getLastCriptocurrencies() {
    return this.repository.getLastCriptocurrencies();
  }

  insertCriptocurrencies(slpPrice: number) {
    const criptocurrencies = new CriptocurrenciesEntity(slpPrice);
    return this.repository.insertCriptocurrencies(criptocurrencies);
  }
}
