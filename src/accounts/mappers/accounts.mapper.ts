import { Injectable } from '@nestjs/common';
import { AccountDTO } from '../dtos/accounts.dto';
import { AccountEntity } from '../entities/accounts.entity';

@Injectable()
export class AccountMapper {
  dtoToEntity(accountDTO: AccountDTO): AccountEntity {
    return new AccountEntity(
      accountDTO.id,
      accountDTO.roninAddress,
      accountDTO.roninSLP,
      accountDTO.inGameSLP,
      accountDTO.totalSLP,
      accountDTO.lifetimeSLP,
      accountDTO.mmr,
      accountDTO.rank,
      accountDTO.lastClaim,
      accountDTO.nextClaim,
    );
  }

  entityToDto(accountEntity: AccountEntity): AccountDTO {
    return new AccountDTO(
      accountEntity.id,
      accountEntity.roninAddress,
      accountEntity.roninSLP,
      accountEntity.inGameSLP,
      accountEntity.totalSLP,
      accountEntity.lifetimeSLP,
      accountEntity.mmr,
      accountEntity.rank,
      accountEntity.lastClaim,
      accountEntity.nextClaim,
    );
  }
}
