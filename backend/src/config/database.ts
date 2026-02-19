import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Category } from '../entities/Category';
import { Technology } from '../entities/Technology';
import { Question } from '../entities/Question';
import { Tag } from '../entities/Tag';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'interviewdock',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [Category, Technology, Question, Tag],
  migrations: [],
  subscribers: [],
});
