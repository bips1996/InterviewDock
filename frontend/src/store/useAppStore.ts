import { create } from 'zustand';
import { Category, Technology, QuestionFilters } from '@/types';

interface AppState {
  // Data
  categories: Category[];
  technologies: Technology[];
  selectedCategoryId: string | null;
  selectedTechnologyId: string | null;

  // Filters
  filters: QuestionFilters;

  // Actions
  setCategories: (categories: Category[]) => void;
  setTechnologies: (technologies: Technology[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedTechnology: (technologyId: string | null) => void;
  setFilters: (filters: Partial<QuestionFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: QuestionFilters = {
  page: 1,
  limit: 20,
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  categories: [],
  technologies: [],
  selectedCategoryId: null,
  selectedTechnologyId: null,
  filters: defaultFilters,

  // Actions
  setCategories: (categories) => set({ categories }),

  setTechnologies: (technologies) => set({ technologies }),

  setSelectedCategory: (categoryId) =>
    set({
      selectedCategoryId: categoryId,
      selectedTechnologyId: null,
      filters: defaultFilters,
    }),

  setSelectedTechnology: (technologyId) =>
    set({
      selectedTechnologyId: technologyId,
      filters: { ...defaultFilters, technologyId: technologyId || undefined },
    }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () =>
    set((state) => ({
      filters: {
        ...defaultFilters,
        technologyId: state.selectedTechnologyId || undefined,
      },
    })),
}));
