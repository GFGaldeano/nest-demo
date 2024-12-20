import { MigrationInterface, QueryRunner } from "typeorm";

export class Files1733874524693 implements MigrationInterface {
    name = 'Files1733874524693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "isCompleted" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "isCompleted" SET DEFAULT false`);
    }

}
