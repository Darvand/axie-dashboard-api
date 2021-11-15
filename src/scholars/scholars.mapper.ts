import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { CreateScholarDTO } from './dtos/create-scholar.dto';
import { ScholarEntity } from './scholars.entity';

@Injectable()
export class ScholarsMapper {
  createScholarEntityFromDTO(
    createScholarDTO: CreateScholarDTO,
    account: AccountEntity,
  ) {
    const scholarEntity = new ScholarEntity();
    scholarEntity.paymentRoninAddress = createScholarDTO.paymentRoninAddress;
    scholarEntity.name = createScholarDTO.name;
    scholarEntity.account = account;
    return scholarEntity;
  }
}
