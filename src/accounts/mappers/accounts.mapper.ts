import { Injectable } from '@nestjs/common';
import { AccountDTO } from '../dtos/accounts.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountEntity } from '../entities/accounts.entity';
import { SLPResponse } from '../types/slp-response.type';

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

  getYesterdaySummary(account: AccountEntity, daily: AccountDailyEntity) {
    return {
      yesterdaySLP: daily.daySLP,
      inGameSLP: account.inGameSLP,
      mmr: account.mmr,
      yesterdayMMR: account.mmr + daily.dayMMR,
      yesterdayMmrEffort: daily.dayMMR,
      scholarship: account.scholar.name,
    };
  }

  createAccount(account: AccountEntity, roninResponse: SLPResponse) {
    const updatedAccount = new AccountEntity(
      account.id,
      account.roninAddress,
      roninResponse.ronin_slp,
      roninResponse.in_game_slp,
      roninResponse.total_slp,
      roninResponse.lifetime_slp,
      roninResponse.mmr,
      roninResponse.rank,
      roninResponse.last_claim,
      roninResponse.next_claim,
    );
    updatedAccount.id = account.id;
    return updatedAccount;
  }
}
