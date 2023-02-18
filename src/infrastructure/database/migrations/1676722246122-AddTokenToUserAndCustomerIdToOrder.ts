import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerIdToOrder1676722246122 implements MigrationInterface {
  name = 'AddCustomerIdToOrder1676722246122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ALTER COLUMN "customerId"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ALTER COLUMN "customerId" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
