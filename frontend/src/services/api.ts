import { api } from '@/lib/api';
import {
  Category,
  Technology,
  Question,
  QuestionFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return data.data;
  },
};

export const technologyApi = {
  getAll: async (categoryId?: string): Promise<Technology[]> => {
    const params = categoryId ? { categoryId } : {};
    const { data } = await api.get<ApiResponse<Technology[]>>('/technologies', {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<Technology> => {
    const { data } = await api.get<ApiResponse<Technology>>(
      `/technologies/${id}`
    );
    return data.data;
  },

  create: async (technology: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    categoryId: string;
    order?: number;
  }): Promise<Technology> => {
    const { data } = await api.post<ApiResponse<Technology>>(
      '/technologies',
      technology
    );
    return data.data;
  },
};

export const questionApi = {
  getAll: async (filters?: QuestionFilters): Promise<PaginatedResponse<Question>> => {
    const { data } = await api.get<PaginatedResponse<Question>>('/questions', {
      params: filters,
    });
    return data;
  },

  getById: async (id: string): Promise<Question> => {
    const { data } = await api.get<ApiResponse<Question>>(`/questions/${id}`);
    return data.data;
  },

  create: async (question: {
    title: string;
    answer: string;
    codeSnippet?: string;
    codeLanguage?: string;
    difficulty: string;
    technologyId: string;
    tags?: string[];
  }): Promise<Question> => {
    const { data } = await api.post<ApiResponse<Question>>(
      '/questions',
      question
    );
    return data.data;
  },
};
