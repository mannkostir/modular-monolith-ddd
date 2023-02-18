import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteForOrderedItem1676743259625
  implements MigrationInterface
{
  name = 'AddOnDeleteForOrderedItem1676743259625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "ordered_item" DROP CONSTRAINT "FK_d5144196f9ef94620707f9c11f1"
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item" DROP CONSTRAINT "FK_0bee3f1355e3824e2c893e872d6"
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item"
            ADD CONSTRAINT "FK_d5144196f9ef94620707f9c11f1" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item"
            ADD CONSTRAINT "FK_0bee3f1355e3824e2c893e872d6" FOREIGN KEY ("itemId") REFERENCES "item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "ordered_item" DROP CONSTRAINT "FK_0bee3f1355e3824e2c893e872d6"
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item" DROP CONSTRAINT "FK_d5144196f9ef94620707f9c11f1"
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item"
            ADD CONSTRAINT "FK_0bee3f1355e3824e2c893e872d6" FOREIGN KEY ("itemId") REFERENCES "item" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item"
            ADD CONSTRAINT "FK_d5144196f9ef94620707f9c11f1" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
