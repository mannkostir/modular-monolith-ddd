import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1676361794350 implements MigrationInterface {
  name = 'CreateInitialTables1676361794350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "item"
        (
            "id"    uuid    NOT NULL,
            "name"  text    NOT NULL,
            "price" integer NOT NULL,
            CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "order"
        (
            "id"         uuid NOT NULL,
            "customerId" uuid,
            CONSTRAINT "REL_124456e637cca7a415897dce65" UNIQUE ("customerId"),
            CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "ordered_item"
        (
            "id"       uuid    NOT NULL,
            "quantity" integer NOT NULL DEFAULT '1',
            "orderId"  uuid,
            "itemId"   uuid,
            CONSTRAINT "PK_5e6bd38fc51977db42e61d63a18" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum" AS ENUM('FULFILLED', 'PENDING', 'REJECTED')
        `);
    await queryRunner.query(`
        CREATE TABLE "payment"
        (
            "id"      uuid                           NOT NULL,
            "status"  "public"."payment_status_enum" NOT NULL DEFAULT 'PENDING',
            "orderId" uuid,
            "userId"  uuid,
            CONSTRAINT "REL_d09d285fe1645cd2f0db811e29" UNIQUE ("orderId"),
            CONSTRAINT "REL_b046318e0b341a7f72110b7585" UNIQUE ("userId"),
            CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "user"
        (
            "id"       uuid NOT NULL,
            "password" text NOT NULL,
            "email"    text NOT NULL,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "wallet"
        (
            "id"      uuid    NOT NULL,
            "balance" integer NOT NULL,
            "userId"  uuid,
            CONSTRAINT "REL_35472b1fe48b6330cd34970956" UNIQUE ("userId"),
            CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item"
            ADD CONSTRAINT "FK_d5144196f9ef94620707f9c11f1" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item"
            ADD CONSTRAINT "FK_0bee3f1355e3824e2c893e872d6" FOREIGN KEY ("itemId") REFERENCES "item" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item" DROP CONSTRAINT "FK_0bee3f1355e3824e2c893e872d6"
    `);
    await queryRunner.query(`
        ALTER TABLE "ordered_item" DROP CONSTRAINT "FK_d5144196f9ef94620707f9c11f1"
    `);
    await queryRunner.query(`
        ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"
    `);
    await queryRunner.query(`
        DROP TABLE "wallet"
    `);
    await queryRunner.query(`
        DROP TABLE "user"
    `);
    await queryRunner.query(`
        DROP TABLE "payment"
    `);
    await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum"
        `);
    await queryRunner.query(`
        DROP TABLE "ordered_item"
    `);
    await queryRunner.query(`
        DROP TABLE "order"
    `);
    await queryRunner.query(`
        DROP TABLE "item"
    `);
  }
}
