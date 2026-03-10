import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddQuestionImpressions1710159000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add likes column
    await queryRunner.addColumn(
      'questions',
      new TableColumn({
        name: 'likes',
        type: 'integer',
        default: 0,
      })
    );

    // Add dislikes column
    await queryRunner.addColumn(
      'questions',
      new TableColumn({
        name: 'dislikes',
        type: 'integer',
        default: 0,
      })
    );

    // Add index for sorting by impressions (likes - dislikes)
    await queryRunner.query(`
      CREATE INDEX "IDX_questions_impressions" ON "questions" ((likes - dislikes) DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX "IDX_questions_impressions"`);

    // Drop columns
    await queryRunner.dropColumn('questions', 'dislikes');
    await queryRunner.dropColumn('questions', 'likes');
  }
}
