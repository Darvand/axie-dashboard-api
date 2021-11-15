import { Controller, Get } from '@nestjs/common';
import { CoinMarketApiService } from '../services/coin-market-api.service';

@Controller('coin')
export class CoinController {
  constructor(private coinMarketAPI: CoinMarketApiService) {}

  @Get('/slp')
  async getSLPPrice() {
    const coinmarketResponse = await this.coinMarketAPI.getCurrentSLPPrice();
    return { price: coinmarketResponse.data.quote.USD.price };
  }
}
