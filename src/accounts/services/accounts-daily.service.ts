import { Injectable } from '@nestjs/common';
import { combineLatest, map } from 'rxjs';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountDailyMapper } from '../mappers/accounts-daily.mapper';
import { AccountsDailyRepository } from '../repositories/accounts-daily.repository';
import { AxieApiService } from './axie-api.service';
import { DateTime } from 'luxon';
import { AccountsService } from './accounts.service';
import { CriptocurrenciesService } from './criptocurrencies.service';

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
    private mapper: AccountDailyMapper,
    private axieApi: AxieApiService,
    private accountService: AccountsService,
    private criptocurrenciesService: CriptocurrenciesService,
  ) {}

  async getAllDaily(): Promise<AccountDailyDTO[]> {
    const allDaily: AccountDailyEntity[] =
      await this.repository.getAllDailies();
    return allDaily;
  }

  createDailyInformation(ronin: string) {
    return combineLatest([
      this.axieApi.getTodaySLP(ronin),
      this.axieApi.getLast20PVP(ronin),
      this.axieApi.getLast20PVE(ronin),
      this.axieApi.getMMR(ronin),
    ]).pipe(
      map(async ([slpResponse, [pvpFights], pveFights, [mmr]]) => {
        const account = await this.accountService.getAccountByAddress(ronin);
        const { slp } =
          await this.criptocurrenciesService.getLastCriptocurrencies();
        const yesterday = DateTime.utc().minus({ days: 1 }).day;
        const fixedRonin = ronin.replace('ronin:', '0x');
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
          slp,
        );
        accountDaily.account = account;
        return this.repository.saveDaily(accountDaily);
      }),
    );
  }
}
