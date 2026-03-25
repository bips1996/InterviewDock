import { api } from '@/lib/api';
import {
  Category,
  Technology,
  Question,
  QuestionFilters,
  PaginatedResponse,
  ApiResponse,
  Admin,
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

  update: async (id: string, technology: Partial<{
    name: string;
    slug: string;
    description: string;
    icon: string;
    categoryId: string;
    order: number;
  }>): Promise<Technology> => {
    const { data } = await api.put<ApiResponse<Technology>>(
      `/technologies/${id}`,
      technology
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/technologies/${id}`);
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

  update: async (id: string, question: Partial<{
    title: string;
    answer: string;
    codeSnippet: string;
    codeLanguage: string;
    difficulty: string;
    tags: string[];
  }>): Promise<Question> => {
    const { data } = await api.put<ApiResponse<Question>>(
      `/questions/${id}`,
      question
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },

  like: async (id: string): Promise<Question> => {
    const { data } = await api.post<ApiResponse<Question>>(`/questions/${id}/like`);
    return data.data;
  },

  dislike: async (id: string): Promise<Question> => {
    const { data } = await api.post<ApiResponse<Question>>(`/questions/${id}/dislike`);
    return data.data;
  },
};

export const adminApi = {
  getAll: async (): Promise<Admin[]> => {
    const { data } = await api.get<ApiResponse<Admin[]>>('/auth/admins');
    return data.data;
  },

  create: async (admin: {
    userId: string;
    pin: string;
    name?: string;
    isSuperAdmin?: boolean;
  }): Promise<{ adminId: string }> => {
    const { data } = await api.post<ApiResponse<{ adminId: string }>>('/auth/admins', admin);
    return data.data;
  },

  update: async (id: string, admin: {
    name?: string;
    pin?: string;
    isActive?: boolean;
  }): Promise<void> => {
    await api.put(`/auth/admins/${id}`, admin);
  },

  activate: async (id: string): Promise<void> => {
    await api.patch(`/auth/admins/${id}/activate`);
  },

  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/auth/admins/${id}`);
  },
};
