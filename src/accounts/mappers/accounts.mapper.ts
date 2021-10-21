import { Injectable } from '@nestjs/common';
import { AccountDTO } from '../dtos/accounts.dto';
import { AccountEntity } from '../entities/accounts.entity';

@Injectable()
export class AccountMapper {
  dtoToEntity(accountDTO: AccountDTO): AccountEntity {
    return new AccountEntity(accountDTO.id, accountDTO.roninAddress);
  }

  entityToDto(accountEntity: AccountEntity): AccountDTO {
    return new AccountDTO(accountEntity.id, accountEntity.roninAddress);
  }
}
