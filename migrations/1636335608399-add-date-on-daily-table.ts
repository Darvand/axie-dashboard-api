import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDateOnDailyTable1636335608399 implements MigrationInterface {
  name = 'addDateOnDailyTable1636335608399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accounts_daily" DROP COLUMN "date"`);
  }
}
