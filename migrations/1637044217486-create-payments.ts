import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPayments1637044217486 implements MigrationInterface {
  name = 'createPayments1637044217486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "payment_proportion" double precision NOT NULL, "transaction_hash" character varying NOT NULL, "slp" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "managerAccountId" uuid, "scholarAccountId" uuid, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_5eb5461e6090d486e6e6e9f8011" FOREIGN KEY ("managerAccountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_45ac968e91df06ba9dd470a75d9" FOREIGN KEY ("scholarAccountId") REFERENCES "scholars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_45ac968e91df06ba9dd470a75d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_5eb5461e6090d486e6e6e9f8011"`,
    );
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
