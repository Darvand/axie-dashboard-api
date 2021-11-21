import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountsService } from 'src/accounts/services/accounts.service';
import { CreateScholarDTO } from './dtos/create-scholar.dto';
import { ScholarsService } from './scholars.service';

@Controller('scholars')
export class ScholarsController {
  constructor(
    private scholarsService: ScholarsService,
    private accountsService: AccountsService,
  ) {}

  @Get()
  getAll() {
    return this.scholarsService.getAll();
  }

  @Post()
  async save(@Body() createScholarDTO: CreateScholarDTO) {
    const account = await this.accountsService.getAccountByAddress(
      createScholarDTO.main_account_address,
    );
    const scholar = await this.scholarsService.save(createScholarDTO, account);
    return this.accountsService.updateAccount({ ...account, scholar });
  }
}
