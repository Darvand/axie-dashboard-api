import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { PutDailyDTO } from '../dtos/put-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountEntity } from '../entities/accounts.entity';
import { SLPResponse } from '../types/slp-response.type';

@Injectable()
export class AccountDailyMapper {
  dtoToEntity(accountDailyDTO: AccountDailyDTO): AccountDailyEntity {
    return new AccountDailyEntity(
      accountDailyDTO.dayMMR,
      accountDailyDTO.daySLP,
      accountDailyDTO.date,
    );
  }

  entityToDto(accountDailyEntity: AccountDailyEntity): AccountDailyDTO {
    return new AccountDailyDTO(
      accountDailyEntity.id,
      accountDailyEntity.pvpWin,
      accountDailyEntity.pvpLose,
      accountDailyEntity.pvpDraw,
      accountDailyEntity.dayMMR,
      accountDailyEntity.daySLP,
      accountDailyEntity.date,
    );
  }

  createEntityByDailyInfo(account: AccountEntity) {
    return (slp: number, date: string) => {
      const dailyEntity = new AccountDailyEntity(
        0,
        slp,
        DateTime.fromFormat(date, 'yyyy-MM-dd').toJSDate(),
      );
      dailyEntity.account = account;
      return dailyEntity;
    };
  }

  createDaily(
    slp: number,
    date: Date,
    roninResponse: SLPResponse,
    account: AccountEntity,
  ) {
    const dayMMR = roninResponse.mmr - account.mmr;
    const entity = new AccountDailyEntity(dayMMR, slp, date);
    entity.account = account;
    entity.inGameSLP = roninResponse.in_game_slp;
    entity.lifetimeSLP = roninResponse.lifetime_slp;
    entity.roninSLP = roninResponse.ronin_slp;
    entity.rank = roninResponse.rank;
    entity.mmr = roninResponse.mmr;
    return entity;
  }

  saveDaily(daily: PutDailyDTO, account: AccountEntity) {
    const date = DateTime.fromISO(daily.date.toString()).plus({ hours: 12 });
    const entity = new AccountDailyEntity(
      daily.dayMMR,
      daily.daySLP,
      date.toJSDate(),
    );
    entity.account = account;
    entity.inGameSLP = daily.inGameSLP;
    entity.lifetimeSLP = daily.lifetimeSLP;
    entity.roninSLP = daily.roninSLP;
    entity.rank = daily.rank;
    entity.mmr = daily.mmr;
    return entity;
  }
}
