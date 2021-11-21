import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountDailyDTO } from '../dtos/accounts-daily.dto';
import { AccountDailyEntity } from '../entities/accounts-daily.entity';
import { AccountsDailyRepository } from '../repositories/accounts-daily.repository';
import { AxieApiService } from './axie-api.service';
import { DateTime } from 'luxon';
import { AccountsService } from './accounts.service';
import { AccountMapper } from '../mappers/accounts.mapper';
import { AccountDTO } from '../dtos/accounts.dto';
import { AccountEntity } from '../entities/accounts.entity';
import { inspect } from 'util';
import { TrackerDailyResponse } from '../types/tracker-response.type';
import { AccountDailyMapper } from '../mappers/accounts-daily.mapper';
import { PvpFightsResponse } from '../types/fights-response.type';

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
  private readonly logger = new Logger(AccountsDailyService.name);

  constructor(
    private repository: AccountsDailyRepository,
    private accountsService: AccountsService,
    private accountMapper: AccountMapper,
    private mapper: AccountDailyMapper,
    private axieApi: AxieApiService,
  ) {}

  private calculateFights = (
    pvpFights: PvpFightsResponse,
    yesterday: DateTime,
    ronin: string,
  ) =>
    pvpFights.items
      .filter(
        (fight) =>
          DateTime.fromISO(fight.created_at.toString()).day === yesterday.day,
      )
      .reduce((accum, fight) => {
        const currentRoninIndex = fight.first_client_id === ronin ? 0 : 1;
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

  async getAllDailyFromRonin(ronin: string): Promise<AccountDailyDTO[]> {
    const account = await this.accountsService.getAccountByAddress(ronin);
    return this.repository.getAllDailyForAccount(account);
  }

  save(daily: AccountDailyEntity) {
    return this.repository.saveDaily(daily);
  }

  createByTracker(account: AccountEntity, { daily }: TrackerDailyResponse) {
    const createDailyEntity = this.mapper.createEntityByDailyInfo(account);
    const withoutToday = daily.slice(0, daily.length - 1);
    const allDaily = withoutToday.map((data, index) => {
      const { slp: nextSLP } = daily[index + 1];
      let slp = nextSLP.total - data.slp.total;
      if (slp < 0) {
        slp += data.slp.claimableTotal - nextSLP.claimableTotal;
      }
      if (slp < 0 || slp > 500) {
        this.logger.error(
          `Calculated ${slp} SLP between: 
          ${inspect(daily[index - 1].slp)}
          ${inspect(data.slp)}
          ${inspect(daily[index + 1].slp)}`,
        );
        throw new HttpException(
          `Error calculating SLP on date ${data.date}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const date = DateTime.fromISO(data.date).plus({ days: 1 });
      this.logger.debug(`[${date.toISODate()}]: SLP = ${slp}`);
      return createDailyEntity(slp, date.toISODate());
    });
    return this.repository.saveMultipleDaily(allDaily);
  }

  async createDailyInformation(accountDTO: AccountDTO) {
    const account = this.accountMapper.dtoToEntity(accountDTO);
    const yesterday = DateTime.utc().minus({ days: 1 });
    const dailyCreated = await this.repository.getDailyByDate(
      yesterday,
      accountDTO.id,
    );
    if (dailyCreated) {
      this.logger.log(
        `Daily for account ${account.roninAddress}, was ran at ${dailyCreated.createAt}`,
      );
      return;
    }
    this.logger.log(
      `No daily for account ${
        account.roninAddress
      } on day ${yesterday.toISO()}`,
    );
    return Promise.all([
      this.axieApi.getTodaySLP(account.roninAddress),
      this.axieApi.getLast20PVP(account.roninAddress),
      this.axieApi.getMMR(account.roninAddress),
    ]).then(([slpResponse, [pvpFights], [mmr]]) => {
      this.logger.debug(`Today data for account: ${inspect(slpResponse)}`);
      this.logger.debug(`Current account data: ${inspect(account)}`);
      const fixedRonin = account.roninAddress.replace('ronin:', '0x');
      const yesterdayPVPFights = this.calculateFights(
        pvpFights,
        yesterday,
        fixedRonin,
      );
      const currentMMR = mmr.items.find(
        (account) => account.client_id === fixedRonin,
      ).elo;
      const accountDaily = new AccountDailyEntity(
        yesterdayPVPFights.win,
        yesterdayPVPFights.lose,
        yesterdayPVPFights.draw,
        account.mmr === 0 ? 0 : currentMMR - account.mmr,
        account.lifetimeSLP === 0
          ? 0
          : slpResponse.lifetime_slp - account.lifetimeSLP,
        yesterday.toJSDate(),
      );
      accountDaily.account = account;
      const updatedAccount = new AccountEntity(
        account.id,
        account.roninAddress,
        slpResponse.ronin_slp,
        slpResponse.in_game_slp,
        slpResponse.total_slp,
        slpResponse.lifetime_slp,
        currentMMR,
        slpResponse.rank,
        slpResponse.last_claim,
        slpResponse.next_claim,
      );
      updatedAccount.id = account.id;
      return Promise.all([
        this.repository.saveDaily(accountDaily),
        this.accountsService.updateAccount(updatedAccount),
      ]);
    });
  }
}
