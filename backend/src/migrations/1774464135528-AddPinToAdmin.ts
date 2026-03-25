import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPinToAdmin1774464135528 implements MigrationInterface {
    name = 'AddPinToAdmin1774464135528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(50) NOT NULL, "pinHash" character varying(255) NOT NULL, "name" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "isSuperAdmin" boolean NOT NULL DEFAULT false, "lastLoginAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_420cf6d31487d2f341b40d52e37" UNIQUE ("userId"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_420cf6d31487d2f341b40d52e3" ON "admins" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_420cf6d31487d2f341b40d52e3"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
