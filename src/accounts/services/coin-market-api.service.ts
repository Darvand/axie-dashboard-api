import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { COINMARKET_SLP_ID } from '../constants';
import { CoinMarketPriceResponse } from '../types/coinmarket-price-response.type';

@Injectable()
export class CoinMarketApiService {
  constructor(private http: HttpService) {}

  getCurrentSLPPrice() {
    return this.http
      .get<CoinMarketPriceResponse>(
        `${process.env.COINMARKET_API}/v1/tools/price-conversion?id=${COINMARKET_SLP_ID}&amount=1`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY,
          },
        },
      )
      .pipe(map((axiosResponse) => axiosResponse.data));
  }
}
