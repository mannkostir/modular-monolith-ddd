import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdentityOutboxTable1676635088216 implements MigrationInterface {
    name = 'AddIdentityOutboxTable1676635088216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."identity_outbox_status_enum" AS ENUM('PENDING', 'PROCESSED', 'REJECTED')
        `);
        await queryRunner.query(`
            CREATE TABLE "identity_outbox" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" "public"."identity_outbox_status_enum" NOT NULL DEFAULT 'PENDING',
                "payload" jsonb NOT NULL,
                "correlationId" uuid NOT NULL,
                "context" text NOT NULL,
                "token" text NOT NULL,
                "dateOccurred" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_f1af68d9027f659aaa82ae86704" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "identity_outbox"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."identity_outbox_status_enum"
        `);
    }

}
