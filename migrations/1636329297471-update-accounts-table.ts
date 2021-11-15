import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAccountsTable1636329297471 implements MigrationInterface {
  name = 'updateAccountsTable1636329297471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "total_slp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "total_ronin_slp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "in_game_slp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "last_claim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "next_claim"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "slp_price"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts_daily" DROP COLUMN "pve"`);
    await queryRunner.query(`ALTER TABLE "accounts_daily" DROP COLUMN "mmr"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "ronin_slp" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "in_game_slp" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "total_slp" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "lifetime_slp" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "mmr" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "rank" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "last_claim" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "next_claim" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "day_mmr" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "day_slp" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "day_slp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" DROP COLUMN "day_mmr"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "next_claim"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "last_claim"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "rank"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "mmr"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "lifetime_slp"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "total_slp"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "in_game_slp"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "ronin_slp"`);
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "mmr" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "pve" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "slp_price" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "next_claim" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "last_claim" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "in_game_slp" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "total_ronin_slp" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_daily" ADD "total_slp" integer NOT NULL`,
    );
  }
}
