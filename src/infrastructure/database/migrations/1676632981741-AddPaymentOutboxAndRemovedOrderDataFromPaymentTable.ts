import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentOutboxAndRemovedOrderDataFromPaymentTable1676632981741
  implements MigrationInterface
{
  name = 'AddPaymentOutboxAndRemovedOrderDataFromPaymentTable1676632981741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"
    `);
    await queryRunner.query(`
            CREATE TYPE "public"."payment_outbox_status_enum" AS ENUM('PENDING', 'PROCESSED', 'REJECTED')
        `);
    await queryRunner.query(`
        CREATE TABLE "payment_outbox"
        (
            "id"            uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
            "status"        "public"."payment_outbox_status_enum" NOT NULL DEFAULT 'PENDING',
            "payload"       jsonb                                 NOT NULL,
            "correlationId" uuid                                  NOT NULL,
            "context"       text                                  NOT NULL,
            "token"         text                                  NOT NULL,
            "dateOccurred"  TIMESTAMP WITH TIME ZONE              NOT NULL,
            CONSTRAINT "PK_70f409ce53496b180a03281be84" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP CONSTRAINT "REL_d09d285fe1645cd2f0db811e29"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP COLUMN "orderId"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP CONSTRAINT "REL_b046318e0b341a7f72110b7585"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment" DROP COLUMN "userId"
    `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ADD "invoiceId" uuid
    `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_orderstatus_enum" AS ENUM('PENDING', 'CONFIRMED', 'PLACED', 'CANCELLED')
        `);
    await queryRunner.query(`
        ALTER TABLE "order"
            ADD "orderStatus" "public"."order_orderstatus_enum" NOT NULL DEFAULT 'PENDING'
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD "amount" integer NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "payment" DROP COLUMN "amount"
    `);
    await queryRunner.query(`
        ALTER TABLE "order" DROP COLUMN "orderStatus"
    `);
    await queryRunner.query(`
            DROP TYPE "public"."order_orderstatus_enum"
        `);
    await queryRunner.query(`
        ALTER TABLE "order" DROP COLUMN "invoiceId"
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD "userId" uuid
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD CONSTRAINT "REL_b046318e0b341a7f72110b7585" UNIQUE ("userId")
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD "orderId" uuid
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD CONSTRAINT "REL_d09d285fe1645cd2f0db811e29" UNIQUE ("orderId")
    `);
    await queryRunner.query(`
        DROP TABLE "payment_outbox"
    `);
    await queryRunner.query(`
            DROP TYPE "public"."payment_outbox_status_enum"
        `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "payment"
            ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
