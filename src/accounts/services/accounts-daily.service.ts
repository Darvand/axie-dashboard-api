import { Injectable } from '@nestjs/common';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountsDailyRepository } from '../repositories/accounts-daily.repository';
import { AxieApiService } from './axie-api.service';
import { DateTime } from 'luxon';
import { AccountsService } from './accounts.service';
import { AccountMapper } from '../mappers/accounts.mapper';
import { AccountDTO } from '../dtos/accounts.dto';

export interface BattleState {
  win: number;
  lose: number;
  draw: number;
}

const INITIAL_STATE: BattleState = {
  win: 0,
  lose: 0,
  draw: 0,
};

@Injectable()
export class AccountsDailyService {
  constructor(
    private repository: AccountsDailyRepository,
    private accountsService: AccountsService,
    private accountMapper: AccountMapper,
    private axieApi: AxieApiService,
  ) {}

  async getAllDailyFromRonin(ronin: string): Promise<AccountDailyDTO[]> {
    const account = await this.accountsService.getAccountByAddress(ronin);
    return this.repository.getAllDailyForAccount(account);
  }

  async createDailyInformation(accountDTO: AccountDTO, slpPrice: number) {
    const account = this.accountMapper.dtoToEntity(accountDTO);
    return Promise.all([
      this.axieApi.getTodaySLP(account.roninAddress),
      this.axieApi.getLast20PVP(account.roninAddress),
      this.axieApi.getLast20PVE(account.roninAddress),
      this.axieApi.getMMR(account.roninAddress),
    ]).then(([slpResponse, [pvpFights], pveFights, [mmr]]) => {
      const yesterday = DateTime.utc().minus({ days: 1 }).day;
      const fixedRonin = account.roninAddress.replace('ronin:', '0x');
      const yesterdayPVPFights = pvpFights.items
        .filter(
          (fight) =>
            DateTime.fromISO(fight.created_at.toString()).day === yesterday,
        )
        .reduce((accum, fight) => {
          const currentRoninIndex =
            fight.first_client_id === fixedRonin ? 0 : 1;
          const newAccum = { ...accum };
          if (fight.winner === 2) {
            newAccum.draw++;
          } else if (fight.winner === currentRoninIndex) {
            newAccum.win++;
          } else {
            newAccum.lose++;
          }
          return newAccum;
        }, INITIAL_STATE);
      const yesterdayPVEFights = pveFights.cache
        ? []
        : pveFights.battle_logs.pve.filter(
            (fight) =>
              DateTime.fromISO(fight.created_at.toString()).day === yesterday,
          );
      const currentMMR = mmr.items.find(
        (account) => account.client_id === fixedRonin,
      ).elo;
      const accountDaily = new AccountDailyEntity(
        slpResponse.total_slp,
        slpResponse.ronin_slp,
        slpResponse.in_game_slp,
        slpResponse.last_claim,
        slpResponse.next_claim,
        yesterdayPVPFights.win,
        yesterdayPVPFights.lose,
        yesterdayPVPFights.draw,
        yesterdayPVEFights.length,
        currentMMR,
        slpPrice,
      );
      accountDaily.account = account;
      return this.repository.saveDaily(accountDaily);
    });
  }
}
