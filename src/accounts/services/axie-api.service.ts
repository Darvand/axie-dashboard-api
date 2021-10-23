import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SLPResponse } from '../types/slp-response.type';
import { lastValueFrom } from 'rxjs';
import {
  PveFightsResponse,
  PvpFightsResponse,
} from '../types/fights-response.type';
import { MMRResponse } from '../types/mmr-response.type';

@Injectable()
export class AxieApiService {
  constructor(private http: HttpService) {}

  getTodaySLP(ronin: string) {
    return lastValueFrom(
      this.http.get<SLPResponse>(`${process.env.AXIE_API_URL}/api/v1/${ronin}`),
    )
      .then((response) => response.data)
      .catch((error) => {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  getLast20PVP(ronin: string) {
    return lastValueFrom(
      this.http.get<PvpFightsResponse[]>(
        `${process.env.AXIE_API_URL}/battlelog/${ronin}`,
      ),
    )
      .then((response) => response.data)
      .catch((error) => {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  getLast20PVE(ronin: string) {
    return lastValueFrom(
      this.http.get<PveFightsResponse>(
        `${process.env.LUNACIA_API_URL}/_battles/${ronin}/20/1`,
      ),
    )
      .then((response) => response.data)
      .catch((error) => {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  getMMR(ronin: string) {
    return lastValueFrom(
      this.http.get<MMRResponse[]>(`${process.env.AXIE_API_URL}/mmr/${ronin}`),
    )
      .then((response) => response.data)
      .catch((error) => {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
