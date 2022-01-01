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
import { PutDailyDTO } from '../dtos/put-daily.dto';

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

  createByTracker(account: AccountEntity, { daily }: TrackerDailyResponse) {
    const createDailyEntity = this.mapper.createEntityByDailyInfo(account);
    const withoutToday = daily.slice(0, daily.length - 1);
    const allDaily = withoutToday.map((data, index) => {
      return createDailyEntity(data, daily[index + 1]);
    });
    return this.repository.saveMultipleDaily(allDaily);
  }

  async createDailyInformation(accountDTO: AccountDTO) {
    const account = this.accountMapper.dtoToEntity(accountDTO);
    const yesterday = DateTime.utc();
    const dailyCreated = await this.repository.getDailyByDateAndAccount(
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
    return this.axieApi
      .getTodaySLP(account.roninAddress)
      .then((slpResponse) => {
        this.logger.debug(`Today data for account: ${inspect(slpResponse)}`);
        this.logger.debug(`Current account data: ${inspect(account)}`);
        let daySLP = slpResponse.in_game_slp - account.inGameSLP;
        if (daySLP <= 0) {
          this.logger.log(
            `DaySLP = ${daySLP}. Re-calculating with lifetime SLP`,
          );
          daySLP = slpResponse.lifetime_slp - account.lifetimeSLP;
        }
        const accountDaily = this.mapper.createDaily(
          daySLP,
          yesterday.toJSDate(),
          slpResponse,
          account,
        );
        const updatedAccount = this.accountMapper.createAccount(
          account,
          slpResponse,
        );
        return Promise.all([
          this.repository.saveDaily(accountDaily),
          this.accountsService.updateAccount(updatedAccount),
        ]);
      });
  }

  getLastDaily() {
    const yesterday = DateTime.utc().minus({ days: 1 });
    return this.repository.getDailyByDate(yesterday);
  }

  getById(id: AccountDailyEntity['id']) {
    return this.repository.getById(id);
  }

  async update(daily: PutDailyDTO) {
    const data = await this.repository.getById(daily.id);
    console.log('daily', daily);
    const date = DateTime.fromISO(daily.date.toString()).plus({ hours: 12 });
    const updateDaily: AccountDailyEntity = {
      ...data,
      ...daily,
      date: date.toJSDate(),
      inGameSLP:
        daily.daySLP !== data.daySLP
          ? data.inGameSLP + +daily.daySLP
          : daily.inGameSLP,
    };
    return this.repository.update(updateDaily);
  }

  save(daily: PutDailyDTO, account: AccountEntity) {
    const entity = this.mapper.saveDaily(daily, account);
    return this.repository.saveDaily(entity);
  }
}
