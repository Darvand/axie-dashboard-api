import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PutDailyDTO } from '../dtos/put-daily.dto';
import { AccountsDailyService } from '../services/accounts-daily.service';

@Injectable()
export class ValidatePutDaily
  implements PipeTransform<PutDailyDTO, Promise<PutDailyDTO>>
{
  constructor(private service: AccountsDailyService) {}

  async transform(body: PutDailyDTO) {
    const { id } = body;
    const daily = await this.service.getById(id);
    if (!daily) {
      throw new NotFoundException(`Daily with id ${id} not found`);
    }

    return body;
  }
}
