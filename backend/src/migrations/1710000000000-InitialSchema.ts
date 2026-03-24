import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create categories table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'order',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create technologies table
    await queryRunner.createTable(
      new Table({
        name: 'technologies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'icon',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'categoryId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create tags table
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create questions table with all columns
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'questionNumber',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'answer',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'codeSnippet',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'codeLanguage',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'difficulty',
            type: 'enum',
            enum: ['Easy', 'Medium', 'Hard'],
            default: "'Medium'",
            isNullable: false,
          },
          {
            name: 'companyTags',
            type: 'text',
            isArray: true,
            default: 'ARRAY[]::text[]',
            isNullable: false,
          },
          {
            name: 'technologyId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'likes',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'dislikes',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create question_tags junction table
    await queryRunner.createTable(
      new Table({
        name: 'question_tags',
        columns: [
          {
            name: 'questionId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'tagId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Add primary key constraint on junction table
    await queryRunner.query(
      `ALTER TABLE "question_tags" ADD CONSTRAINT "PK_question_tags" PRIMARY KEY ("questionId", "tagId")`
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      'technologies',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
        name: 'FK_technologies_categoryId',
      })
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['technologyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'technologies',
        onDelete: 'CASCADE',
        name: 'FK_questions_technologyId',
      })
    );

    await queryRunner.createForeignKey(
      'question_tags',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'questions',
        onDelete: 'CASCADE',
        name: 'FK_question_tags_questionId',
      })
    );

    await queryRunner.createForeignKey(
      'question_tags',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
        name: 'FK_question_tags_tagId',
      })
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_question_title',
        columnNames: ['title'],
      })
    );

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_question_difficulty',
        columnNames: ['difficulty'],
      })
    );

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_question_questionNumber',
        columnNames: ['questionNumber'],
      })
    );

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_question_technologyId',
        columnNames: ['technologyId'],
      })
    );

    await queryRunner.createIndex(
      'technologies',
      new TableIndex({
        name: 'IDX_technology_categoryId',
        columnNames: ['categoryId'],
      })
    );

    await queryRunner.createIndex(
      'question_tags',
      new TableIndex({
        name: 'IDX_question_tags_questionId',
        columnNames: ['questionId'],
      })
    );

    await queryRunner.createIndex(
      'question_tags',
      new TableIndex({
        name: 'IDX_question_tags_tagId',
        columnNames: ['tagId'],
      })
    );

    // Create GIN index for companyTags array queries
    await queryRunner.query(
      `CREATE INDEX "IDX_question_companyTags" ON "questions" USING GIN ("companyTags")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_question_companyTags"`);
    await queryRunner.dropIndex('question_tags', 'IDX_question_tags_tagId');
    await queryRunner.dropIndex('question_tags', 'IDX_question_tags_questionId');
    await queryRunner.dropIndex('technologies', 'IDX_technology_categoryId');
    await queryRunner.dropIndex('questions', 'IDX_question_technologyId');
    await queryRunner.dropIndex('questions', 'IDX_question_questionNumber');
    await queryRunner.dropIndex('questions', 'IDX_question_difficulty');
    await queryRunner.dropIndex('questions', 'IDX_question_title');

    // Drop foreign keys
    await queryRunner.dropForeignKey('question_tags', 'FK_question_tags_tagId');
    await queryRunner.dropForeignKey('question_tags', 'FK_question_tags_questionId');
    await queryRunner.dropForeignKey('questions', 'FK_questions_technologyId');
    await queryRunner.dropForeignKey('technologies', 'FK_technologies_categoryId');

    // Drop tables in reverse order
    await queryRunner.dropTable('question_tags', true);
    await queryRunner.dropTable('questions', true);
    await queryRunner.dropTable('tags', true);
    await queryRunner.dropTable('technologies', true);
    await queryRunner.dropTable('categories', true);
  }
}
