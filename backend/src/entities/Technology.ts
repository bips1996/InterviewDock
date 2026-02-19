import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './Category';
import { Question } from './Question';

@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  slug: string;

  @Column({ nullable: true, length: 200 })
  icon: string; // URL or icon class name

  @Column({ default: 0 })
  order: number;

  @Column('uuid')
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.technologies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Question, (question) => question.technology, {
    cascade: true,
  })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
