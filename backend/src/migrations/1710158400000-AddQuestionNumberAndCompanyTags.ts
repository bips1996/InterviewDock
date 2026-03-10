import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddQuestionNumberAndCompanyTags1710158400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add questionNumber column as nullable first (we'll populate it and make it required)
    await queryRunner.addColumn(
      'questions',
      new TableColumn({
        name: 'questionNumber',
        type: 'varchar',
        length: '50',
        isNullable: true,
        isUnique: false, // Will be unique after population
      })
    );

    // Add companyTags column (PostgreSQL array type)
    await queryRunner.addColumn(
      'questions',
      new TableColumn({
        name: 'companyTags',
        type: 'text',
        isArray: true,
        default: 'ARRAY[]::text[]',
        isNullable: false,
      })
    );

    // Create index on questionNumber for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_question_questionNumber" ON "questions" ("questionNumber")`
    );

    // Create index on companyTags using GIN for array queries
    await queryRunner.query(
      `CREATE INDEX "IDX_question_companyTags" ON "questions" USING GIN ("companyTags")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_question_companyTags"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_question_questionNumber"`);

    // Drop columns
    await queryRunner.dropColumn('questions', 'companyTags');
    await queryRunner.dropColumn('questions', 'questionNumber');
  }
}
