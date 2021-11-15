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

  async getAllDailyFromRonin(ronin: string): Promise<AccountDailyDTO[]> {
    const account = await this.accountsService.getAccountByAddress(ronin);
    return this.repository.getAllDailyForAccount(account);
  }

  save(daily: AccountDailyEntity) {
    return this.repository.saveDaily(daily);
  }

  createByTracker(account: AccountEntity, { daily }: TrackerDailyResponse) {
    const createDailyEntity = this.mapper.createEntityByDailyInfo(account);
    const allDaily = daily.map((data, index) => {
      console.log(`index = ${index}; length = ${daily.length}`);
      const next =
        index + 1 >= daily.length ? data.slp.total : daily[index + 1].slp.total;
      let slp = next - data.slp.total;
      if (slp < 0) {
        slp += data.slp.claimableTotal;
      }
      if (slp < 0 || slp > 500) {
        this.logger.error(
          `Calculated ${slp} SLP on operation: ${next} - ${data.slp.total} + ${data.slp.claimableTotal}`,
        );
        throw new HttpException(
          `Error calculating SLP on date ${data.date}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const entity = createDailyEntity(slp, data.date);
      return this.repository.saveDaily(entity);
    });
    return Promise.all(allDaily);
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
      this.logger.log(
        `Today data for account ${account.roninAddress}: ${inspect(
          slpResponse,
        )}`,
      );
      const fixedRonin = account.roninAddress.replace('ronin:', '0x');
      const yesterdayPVPFights = pvpFights.items
        .filter(
          (fight) =>
            DateTime.fromISO(fight.created_at.toString()).day === yesterday.day,
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
      console.log('updated account', updatedAccount);
      return Promise.all([
        this.repository.saveDaily(accountDaily),
        this.accountsService.updateAccount(updatedAccount),
      ]);
    });
  }
}
