import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { inspect } from 'util';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { PutDailyDTO } from '../dtos/put-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountEntity } from '../entities/accounts.entity';
import { SLPResponse } from '../types/slp-response.type';
import { Daily } from '../types/tracker-response.type';

@Injectable()
export class AccountDailyMapper {
  private readonly logger = new Logger(AccountDailyMapper.name);

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
    let totalSLP = 0;
    return (beforeTracked: Daily, afterTracked: Daily) => {
      const { slp: nextSLP } = afterTracked;
      let slp = nextSLP.total - beforeTracked.slp.total;
      if (slp < 0) {
        slp += beforeTracked.slp.claimableTotal - nextSLP.claimableTotal;
      }
      if (slp < 0 || slp > 500) {
        this.logger.error(
          `Calculated ${slp} SLP between: 
          ${inspect(afterTracked.slp)}
          ${inspect(beforeTracked.slp)}
          ${inspect(afterTracked.slp)}`,
        );
        throw new BadRequestException(
          `Error calculating SLP on date ${beforeTracked.date}`,
        );
      }
      const date = DateTime.fromISO(beforeTracked.date).plus({ days: 1 });
      this.logger.debug(`[${date.toISODate()}]: SLP = ${slp}`);
      const dailyEntity = new AccountDailyEntity(0, slp, date.toJSDate());
      totalSLP += slp;
      dailyEntity.inGameSLP = totalSLP;
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
