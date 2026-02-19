export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
  technologies?: Technology[];
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  order: number;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  answer: string;
  codeSnippet?: string;
  codeLanguage?: string;
  difficulty: Difficulty;
  technologyId: string;
  technology?: Technology;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  status: 'success';
  data: T;
}

export interface QuestionFilters {
  technologyId?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}
