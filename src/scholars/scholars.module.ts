import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ScholarsController } from './scholars.controller';
import { ScholarEntity } from './scholars.entity';
import { ScholarsMapper } from './scholars.mapper';
import { ScholarsRepository } from './scholars.repository';
import { ScholarsService } from './scholars.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScholarEntity]), AccountsModule],
  controllers: [ScholarsController],
  providers: [ScholarsService, ScholarsRepository, ScholarsMapper],
})
export class ScholarsModule {}
