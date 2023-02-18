import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSagaSchema1676754357627 implements MigrationInterface {
    name = 'FixSagaSchema1676754357627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_saga" DROP CONSTRAINT "PK_401cd915eb9510e748ea2fc8501"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_saga" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_saga"
            ADD CONSTRAINT "PK_637d0bb17330cc396b27266da52" PRIMARY KEY ("correlationId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_saga" DROP CONSTRAINT "PK_637d0bb17330cc396b27266da52"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_saga"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "order_saga"
            ADD CONSTRAINT "PK_401cd915eb9510e748ea2fc8501" PRIMARY KEY ("id")
        `);
    }

}
