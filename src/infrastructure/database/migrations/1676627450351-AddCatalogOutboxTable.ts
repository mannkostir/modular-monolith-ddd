import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCatalogOutboxTable1676627450351 implements MigrationInterface {
    name = 'AddCatalogOutboxTable1676627450351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."catalog_outbox_status_enum" AS ENUM('PENDING', 'PROCESSED', 'REJECTED')
        `);
        await queryRunner.query(`
            CREATE TABLE "catalog_outbox" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" "public"."catalog_outbox_status_enum" NOT NULL DEFAULT 'PENDING',
                "payload" jsonb NOT NULL,
                "correlationId" uuid NOT NULL,
                "context" text NOT NULL,
                "token" text NOT NULL,
                "dateOccurred" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_47531934ca82443939b36275f03" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "catalog_outbox"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."catalog_outbox_status_enum"
        `);
    }

}
