import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/accounts/entities/accounts.entity';
import { ScholarEntity } from '../scholars.entity';

export class CreateScholarDTO {
  @ApiProperty({ nullable: true })
  readonly paymentRoninAddress: ScholarEntity['paymentRoninAddress'];

  @ApiProperty()
  readonly mainAccountAddress: AccountEntity['roninAddress'];

  @ApiProperty()
  readonly name: ScholarEntity['name'];

  constructor(
    paymentRoninAddress: CreateScholarDTO['paymentRoninAddress'],
    mainAccountAddress: CreateScholarDTO['mainAccountAddress'],
    name: CreateScholarDTO['name'],
  ) {
    this.paymentRoninAddress = paymentRoninAddress;
    this.mainAccountAddress = mainAccountAddress;
    this.name = name;
  }
}
