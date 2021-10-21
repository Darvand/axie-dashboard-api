import {MigrationInterface, QueryRunner} from "typeorm";

export class initDbAccounts1634782159970 implements MigrationInterface {
    name = 'initDbAccounts1634782159970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ronin_address" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4fd5e09cb43bc833ca79b95f87f" UNIQUE ("ronin_address"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts_daily" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_slp" integer NOT NULL, "total_ronin_slp" integer NOT NULL, "in_game_slp" integer NOT NULL, "last_claim" integer NOT NULL, "next_claim" integer NOT NULL, "pvp_win" integer NOT NULL, "pvp_lose" integer NOT NULL, "pvp_draw" integer NOT NULL, "slp_price" double precision NOT NULL, "pve" integer NOT NULL, "mmr" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "account_uuid" uuid NOT NULL, CONSTRAINT "PK_7ff617ce361a21d001b055ce2c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "criptocurrencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slp" double precision NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_013d1f23467850cc10462e08516" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts_daily" ADD CONSTRAINT "FK_75b4f8109e3043a707fc12b8ede" FOREIGN KEY ("account_uuid") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts_daily" DROP CONSTRAINT "FK_75b4f8109e3043a707fc12b8ede"`);
        await queryRunner.query(`DROP TABLE "criptocurrencies"`);
        await queryRunner.query(`DROP TABLE "accounts_daily"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
