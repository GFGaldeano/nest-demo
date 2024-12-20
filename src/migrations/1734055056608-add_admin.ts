import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmin1734055056608 implements MigrationInterface {
    name = 'AddAdmin1734055056608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "isCompleted" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "isCompleted" SET DEFAULT false`);
    }

}
