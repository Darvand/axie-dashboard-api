import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { COINMARKET_SLP_ID } from '../constants';
import { CoinMarketPriceResponse } from '../types/coinmarket-price-response.type';

@Injectable()
export class CoinMarketApiService {
  private readonly logger = new Logger(CoinMarketApiService.name);

  constructor(private http: HttpService) {}

  async getCurrentSLPPrice(): Promise<CoinMarketPriceResponse> {
    try {
      this.logger.log('Trying to get SLP price');
      const axiosResponse$ = this.http.get<CoinMarketPriceResponse>(
        `${process.env.COINMARKET_API}/v1/tools/price-conversion?id=${COINMARKET_SLP_ID}&amount=1`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY,
          },
        },
      );
      const axiosResponse = await lastValueFrom(axiosResponse$);
      return axiosResponse.data;
    } catch (error) {
      this.logger.error(
        `There was an error in the coinmarket API ${error.message}`,
      );
      throw new HttpException('Unexpected Error', HttpStatus.BAD_REQUEST);
    }
  }
}
