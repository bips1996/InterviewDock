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
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
