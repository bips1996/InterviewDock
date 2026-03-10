import { Search, X, Menu } from "lucide-react";
import { Difficulty } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

interface QuestionFiltersProps {
  onToggleSidebar: () => void;
}

export const QuestionFilters = ({ onToggleSidebar }: QuestionFiltersProps) => {
  const { filters, setFilters, resetFilters } = useAppStore();
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput || undefined, page: 1 });
  };

  const handleDifficultyChange = (difficulty: Difficulty | "") => {
    setFilters({
      difficulty: difficulty || undefined,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({
      sortBy: sortBy as "difficulty" | "impressions" | "recent",
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    resetFilters();
  };

  const hasActiveFilters = filters.search || filters.difficulty || filters.tag;

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Toggle filters"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search questions"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Sort By */}
          <select
            value={filters.sortBy || "difficulty"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
          >
            <option value="difficulty">Sort by Difficulty</option>
            <option value="impressions">Sort by Impressions</option>
            <option value="recent">Sort by Recent</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={filters.difficulty || ""}
            onChange={(e) =>
              handleDifficultyChange(e.target.value as Difficulty | "")
            }
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
          >
            <option value="">All Difficulties</option>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.MEDIUM}>Medium</option>
            <option value={Difficulty.HARD}>Hard</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
