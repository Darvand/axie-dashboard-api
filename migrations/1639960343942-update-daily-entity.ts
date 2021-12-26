import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateDailyEntity1639960343942 implements MigrationInterface {
  name = 'updateDailyEntity1639960343942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "rank" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "mmr" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "ronin_slp" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "in_game_slp" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "lifetime_slp" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "lifetime_slp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "in_game_slp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "ronin_slp"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts_daily" DROP COLUMN "mmr"`);
    await queryRunner.query(`ALTER TABLE "accounts_daily" DROP COLUMN "rank"`);
  }
}
