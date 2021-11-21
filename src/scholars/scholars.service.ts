import { Injectable, Logger } from '@nestjs/common';
import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { CreateScholarDTO } from './dtos/create-scholar.dto';
import { ScholarEntity } from './scholars.entity';
import { ScholarsRepository } from './scholars.repository';
import { ScholarsMapper } from './scholars.mapper';

@Injectable()
export class ScholarsService {
  // private readonly logger = new Logger(ScholarsService.name);

  constructor(
    private repository: ScholarsRepository,
    private mapper: ScholarsMapper,
  ) {}

  getAll() {
    return this.repository.getAll();
  }

  getById(id: ScholarEntity['id']) {
    return this.repository.getById(id);
  }

  getByRonin(ronin: ScholarEntity['paymentRoninAddress']) {
    const fixedAddress = ronin.replace('ronin:', '0x');
    return this.repository.getByRoninAddress(fixedAddress);
  }

  save(createScholarDTO: CreateScholarDTO, account: AccountEntity) {
    const scholar = this.mapper.createScholarEntityFromDTO(
      createScholarDTO,
      account,
    );
    return this.repository.save(scholar);
  }
}
