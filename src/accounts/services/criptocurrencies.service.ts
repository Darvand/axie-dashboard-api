import { Injectable } from '@nestjs/common';
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
}
