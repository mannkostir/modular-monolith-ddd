import { MigrationInterface, QueryRunner } from "typeorm";

export class AddValueToOrderStatusEnum1676749780713 implements MigrationInterface {
    name = 'AddValueToOrderStatusEnum1676749780713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "public"."order_orderstatus_enum"
            RENAME TO "order_orderstatus_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."order_orderstatus_enum" AS ENUM(
                'PENDING',
                'CONFIRMED',
                'PLACED',
                'CANCELLED',
                'PAID'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ALTER COLUMN "orderStatus" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ALTER COLUMN "orderStatus" TYPE "public"."order_orderstatus_enum" USING "orderStatus"::"text"::"public"."order_orderstatus_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ALTER COLUMN "orderStatus"
            SET DEFAULT 'PENDING'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."order_orderstatus_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."order_orderstatus_enum_old" AS ENUM('PENDING', 'CONFIRMED', 'PLACED', 'CANCELLED')
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ALTER COLUMN "orderStatus" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ALTER COLUMN "orderStatus" TYPE "public"."order_orderstatus_enum_old" USING "orderStatus"::"text"::"public"."order_orderstatus_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ALTER COLUMN "orderStatus"
            SET DEFAULT 'PENDING'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."order_orderstatus_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."order_orderstatus_enum_old"
            RENAME TO "order_orderstatus_enum"
        `);
    }

}
