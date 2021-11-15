import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScholarEntity } from './scholars.entity';

@Injectable()
export class ScholarsRepository {
  private readonly logger = new Logger(ScholarsRepository.name);

  constructor(
    @InjectRepository(ScholarEntity)
    private repository: Repository<ScholarEntity>,
  ) {}

  async getAll() {
    this.logger.debug(`Attempting to get all scholars`);
    const scholars = await this.repository.find();
    this.logger.debug(`Found ${scholars.length} scholars`);
    return scholars;
  }

  async getById(id: ScholarEntity['id']) {
    this.logger.debug(`Looking for scholar with ID ${id}`);
    const scholar = await this.repository.findOne({ where: { id } });
    this.logger.debug(`Scholar ${!scholar && 'not '}found`);
    return scholar;
  }

  async save(scholar: ScholarEntity) {
    this.logger.debug(`Attempting to save scholar with name ${scholar.name}`);
    const saved = await this.repository.save(scholar);
    this.logger.debug('Scholar successfully saved');
    return saved;
  }

  async update(scholar: Partial<ScholarEntity>) {
    this.logger.debug(
      `Attempting to update scholar ${scholar.id} with ${scholar}`,
    );
    const updated = await this.repository.update({ id: scholar.id }, scholar);
    this.logger.debug(`Updated scholar: ${updated.affected}`);
    return updated;
  }

  async delete(id: ScholarEntity['id']) {
    this.logger.debug(`Attempting to delete scholar with id ${id}`);
    const deleted = await this.repository.delete({ id });
    this.logger.debug(`Scholar successfully deleted: ${deleted.affected}`);
    return deleted;
  }
}
