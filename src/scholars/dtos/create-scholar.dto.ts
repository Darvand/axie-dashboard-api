import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { ScholarEntity } from '../scholars.entity';

export class CreateScholarDTO {
  @ApiProperty({ nullable: true })
  readonly payment_ronin_address: ScholarEntity['paymentRoninAddress'];

  @ApiProperty()
  readonly main_account_address: AccountEntity['roninAddress'];

  @ApiProperty()
  readonly name: ScholarEntity['name'];

  @ApiProperty()
  readonly entryDate: Date;

  constructor(
    paymentRoninAddress: CreateScholarDTO['payment_ronin_address'],
    mainAccountAddress: CreateScholarDTO['main_account_address'],
    name: CreateScholarDTO['name'],
    entryDate: CreateScholarDTO['entryDate'],
  ) {
    this.payment_ronin_address = paymentRoninAddress;
    this.main_account_address = mainAccountAddress;
    this.name = name;
    this.entryDate = entryDate;
  }
}
