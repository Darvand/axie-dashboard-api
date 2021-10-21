import { Injectable } from '@nestjs/common';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';

@Injectable()
export class AccountDailyMapper {
  dtoToEntity(accountDailyDTO: AccountDailyDTO): AccountDailyEntity {
    return new AccountDailyEntity(
      accountDailyDTO.totalSLP,
      accountDailyDTO.totalRoninSLP,
      accountDailyDTO.inGameSLP,
      accountDailyDTO.lastClaim,
      accountDailyDTO.nextClaim,
      accountDailyDTO.pvpWin,
      accountDailyDTO.pvpLose,
      accountDailyDTO.pvpDraw,
      accountDailyDTO.pve,
      accountDailyDTO.mmr,
      accountDailyDTO.slpPrice,
    );
  }

  entityToDto(accountDailyEntity: AccountDailyEntity): AccountDailyDTO {
    return new AccountDailyDTO(
      accountDailyEntity.id,
      accountDailyEntity.totalSLP,
      accountDailyEntity.totalRoninSLP,
      accountDailyEntity.inGameSLP,
      accountDailyEntity.lastClaim,
      accountDailyEntity.nextClaim,
      accountDailyEntity.pvpWin,
      accountDailyEntity.pvpLose,
      accountDailyEntity.pvpDraw,
      accountDailyEntity.pve,
      accountDailyEntity.mmr,
      accountDailyEntity.slpPrice,
    );
  }
}
