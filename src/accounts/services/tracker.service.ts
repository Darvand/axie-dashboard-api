import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TrackerDailyResponse } from '../types/tracker-response.type';

const TRACKER_API = 'https://api.axie.management/v1';

const buildRequest = () => ({
  headers: {
    'sec-ch-ua': '"Chromium";v="94", " Not A;Brand";v="99", "Opera GX";v="80"',
    accept: 'application/json, text/plain, */*',
    'sec-ch-ua-mobile': '?0',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 OPR/80.0.4170.91',
    'sec-ch-ua-platform': '"Windows"',
    origin: 'https://axie.management',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    referer: 'en-US,en;q=0.9',
    authority: 'api.axie.management',
  },
});

@Injectable()
export class TrackerService {
  constructor(private http: HttpService) {}

  getDaily(address: string) {
    const fixed = address.replace('ronin:', '0x');
    return lastValueFrom(
      this.http.get<TrackerDailyResponse>(
        `${TRACKER_API}/daily/${fixed}`,
        buildRequest(),
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
}
