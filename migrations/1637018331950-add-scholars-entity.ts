import { MigrationInterface, QueryRunner } from 'typeorm';

export class addScholarsEntity1637018331950 implements MigrationInterface {
  name = 'addScholarsEntity1637018331950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scholars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "payment_ronin_address" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a013ffeec501587853b7958a192" UNIQUE ("name"), CONSTRAINT "PK_f29915a6f27a275beff62f29609" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" ADD "scholarId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_824b0b928f00b393afbf6ab1901" UNIQUE ("scholarId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_824b0b928f00b393afbf6ab1901" FOREIGN KEY ("scholarId") REFERENCES "scholars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_824b0b928f00b393afbf6ab1901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_824b0b928f00b393afbf6ab1901"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "scholarId"`);
    await queryRunner.query(`DROP TABLE "scholars"`);
  }
}
