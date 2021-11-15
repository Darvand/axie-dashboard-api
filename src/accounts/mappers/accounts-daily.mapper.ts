import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountEntity } from '../entities/accounts.entity';

@Injectable()
export class AccountDailyMapper {
  dtoToEntity(accountDailyDTO: AccountDailyDTO): AccountDailyEntity {
    return new AccountDailyEntity(
      accountDailyDTO.pvpWin,
      accountDailyDTO.pvpLose,
      accountDailyDTO.pvpDraw,
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
        0,
        0,
        0,
        slp,
        DateTime.fromFormat(date, 'yyyy-MM-dd').toJSDate(),
      );
      dailyEntity.account = account;
      return dailyEntity;
    };
  }
}
