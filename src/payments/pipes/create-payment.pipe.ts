import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { AccountsService } from 'src/accounts/services/accounts.service';
import { ScholarsService } from 'src/scholars/scholars.service';
import { CreatePaymentDTO } from '../dtos/create-payment.dto';
import { CreatePayment } from '../interfaces/create-payment.interface';

@Injectable()
export class ValidateCreatePayment
  implements PipeTransform<CreatePaymentDTO, Promise<CreatePayment>>
{
  constructor(
    private accountsService: AccountsService,
    private scholarsService: ScholarsService,
  ) {}

  async transform(body: CreatePaymentDTO) {
    const { manager_account, scholar_account } = body;
    const managerRonin = manager_account.replace('ronin:', '0x');
    const scholarRonin = scholar_account.replace('ronin:', '0x');
    const manager = await this.accountsService.getAccountByAddress(
      managerRonin,
    );
    if (!manager) {
      throw new NotFoundException(
        `Manager account ajua with ronin ${managerRonin} not found`,
      );
    }
    const scholar = await this.scholarsService.getByRonin(scholarRonin);
    if (!scholar) {
      throw new NotFoundException(
        `Scholar account with ronin ${scholarRonin} not found`,
      );
    }

    return {
      managerAccount: manager,
      scholarAccount: scholar,
      startDate: body.start_date,
      endDate: body.end_date,
      paymentProportion: body.payment_proportion,
      transactionHash: body.transaction_hash,
      slp: body.slp,
    };
  }
}
