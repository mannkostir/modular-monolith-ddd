import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSagaTableForOrder1676638148930 implements MigrationInterface {
    name = 'AddSagaTableForOrder1676638148930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "order_saga" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "state" jsonb NOT NULL,
                "type" text NOT NULL,
                "correlationId" uuid NOT NULL,
                "isCompleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_401cd915eb9510e748ea2fc8501" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "order_saga"
        `);
    }

}
