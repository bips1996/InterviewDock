import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateQuestionNumbers1710158500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get all questions with their technology information, ordered by creation date
    const questions = await queryRunner.query(`
      SELECT q.id, q."technologyId", q."createdAt", t.slug as technology_slug
      FROM questions q
      INNER JOIN technologies t ON q."technologyId" = t.id
      ORDER BY q."createdAt" ASC
    `);

    // Group questions by technology and assign numbers
    const technologyCounters: { [key: string]: number } = {};

    for (const question of questions) {
      const techSlug = question.technology_slug;
      
      // Initialize counter for this technology if not exists
      if (!technologyCounters[techSlug]) {
        technologyCounters[techSlug] = 1;
      }

      // Generate question number: _{TechSlug}-{Counter}
      // Format counter to 3 digits (001, 002, etc.)
      const questionNumber = `${techSlug}-${String(technologyCounters[techSlug]).padStart(3, '0')}`;

      // Update the question with the generated number
      await queryRunner.query(
        `UPDATE questions SET "questionNumber" = $1 WHERE id = $2`,
        [questionNumber, question.id]
      );

      // Increment counter for this technology
      technologyCounters[techSlug]++;
    }

    // Now make questionNumber NOT NULL and UNIQUE
    await queryRunner.query(`
      ALTER TABLE questions 
      ALTER COLUMN "questionNumber" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE questions 
      ADD CONSTRAINT "UQ_question_questionNumber" UNIQUE ("questionNumber")
    `);

    console.log('✅ Question numbers populated successfully!');
    console.log('📊 Summary:');
    Object.entries(technologyCounters).forEach(([tech, count]) => {
      console.log(`   - ${tech}: ${count - 1} questions`);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the unique constraint
    await queryRunner.query(`
      ALTER TABLE questions 
      DROP CONSTRAINT IF EXISTS "UQ_question_questionNumber"
    `);

    // Make column nullable again
    await queryRunner.query(`
      ALTER TABLE questions 
      ALTER COLUMN "questionNumber" DROP NOT NULL
    `);

    // Clear all question numbers
    await queryRunner.query(`
      UPDATE questions SET "questionNumber" = NULL
    `);
  }
}
