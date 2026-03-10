import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { Technology } from './Technology';
import { Tag } from './Tag';

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

@Entity('questions')
@Index(['title']) // Index for search performance
@Index(['difficulty']) // Index for filtering
@Index(['questionNumber']) // Index for question number lookup
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  questionNumber: string; // Format: _{TechSlug}-{Number}

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text' })
  answer: string; // Markdown supported

  @Column({ type: 'text', nullable: true })
  codeSnippet: string;

  @Column({ nullable: true, length: 50 })
  codeLanguage: string; // e.g., 'javascript', 'python', 'java'

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.MEDIUM,
  })
  difficulty: Difficulty;

  @Column('simple-array', { default: '' })
  companyTags: string[]; // Array of company names like ['Google', 'Amazon', 'Microsoft']

  @Column('uuid')
  technologyId: string;

  @ManyToOne(() => Technology, (technology) => technology.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'technologyId' })
  technology: Technology;

  @ManyToMany(() => Tag, (tag) => tag.questions, {
    cascade: true,
  })
  @JoinTable({
    name: 'question_tags',
    joinColumn: { name: 'questionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({ type: 'integer', default: 0 })
  likes: number;

  @Column({ type: 'integer', default: 0 })
  dislikes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
