import { Search, Filter, X, Menu } from "lucide-react";
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

  const clearFilters = () => {
    setSearchInput("");
    resetFilters();
  };

  const hasActiveFilters = filters.search || filters.difficulty || filters.tag;

  return (
    <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle filters"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 min-w-[150px] sm:min-w-[200px]"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
          <select
            value={filters.difficulty || ""}
            onChange={(e) =>
              handleDifficultyChange(e.target.value as Difficulty | "")
            }
            className="px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Difficulties</option>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.MEDIUM}>Medium</option>
            <option value={Difficulty.HARD}>Hard</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
