import { SLPResponse } from '../types/slp-response.type';

export class AccountCreateDTO {
  readonly roninAddress: string;
  readonly roninSLP: number;
  readonly inGameSLP: number;
  readonly totalSLP: number;
  readonly lifetimeSLP: number;
  readonly mmr: number;
  readonly rank: number;
  readonly lastClaim: number;
  readonly nextClaim: number;

  constructor(roninAddress: string, roninResponse: SLPResponse) {
    this.roninAddress = roninAddress;
    this.roninSLP = roninResponse.ronin_slp;
    this.inGameSLP = roninResponse.in_game_slp;
    this.totalSLP = roninResponse.total_slp;
    this.lifetimeSLP = roninResponse.lifetime_slp;
    this.mmr = roninResponse.mmr;
    this.rank = roninResponse.rank;
    this.lastClaim = roninResponse.last_claim;
    this.nextClaim = roninResponse.next_claim;
  }
}
