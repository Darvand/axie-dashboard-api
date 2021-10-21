import { Injectable } from '@nestjs/common';
import { CriptocurrenciesDTO } from '../dtos/criptocurrencies.dto';
import { CriptocurrenciesEntity } from '../entities/criptocurrencies.entity';

@Injectable()
export class CriptocurrenciesMapper {
  dtoToEntity(
    criptocurrenciesDTO: CriptocurrenciesDTO,
  ): CriptocurrenciesEntity {
    return new CriptocurrenciesEntity(criptocurrenciesDTO.slp);
  }

  entityToDto(
    criptocurrencieEntity: CriptocurrenciesEntity,
  ): CriptocurrenciesDTO {
    return new CriptocurrenciesDTO(criptocurrencieEntity.slp);
  }
}
