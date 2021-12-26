import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateScholar1637560157529 implements MigrationInterface {
  name = 'updateScholar1637560157529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scholars" ADD "entry_date" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "scholars" DROP COLUMN "entry_date"`);
  }
}
