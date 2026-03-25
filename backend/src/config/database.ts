import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Category } from '../entities/Category';
import { Technology } from '../entities/Technology';
import { Question } from '../entities/Question';
import { Tag } from '../entities/Tag';
import { Admin } from '../entities/Admin';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'interviewdock',
  synchronize: false, // Always use migrations, never use synchronize
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  entities: [Category, Technology, Question, Tag, Admin],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  subscribers: [],
  // Add connection retry logic
  extra: {
    max: 10,
    connectionTimeoutMillis: 5000,
  },
});
