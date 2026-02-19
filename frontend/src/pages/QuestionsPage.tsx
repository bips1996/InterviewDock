import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Question, PaginationMeta } from "@/types";
import { questionApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { QuestionFilters } from "@/components/QuestionFilters";
import { Sidebar } from "@/components/Sidebar";

export const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { filters } = useAppStore();

  useEffect(() => {
    loadQuestions();
  }, [filters]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getAll(filters);
      setQuestions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = (newPage: number) => {
    useAppStore.getState().setFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <QuestionFilters />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Questions
              </h1>
              {pagination && (
                <p className="text-gray-600 mt-2">
                  Showing {questions.length} of {pagination.total} questions
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Questions List */}
            {!loading && questions.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-lg">
                  No questions found. Try adjusting your filters.
                </p>
              </div>
            )}

            {!loading && questions.length > 0 && (
              <div className="space-y-4">
                {questions.map((question) => {
                  const isExpanded = expandedId === question.id;

                  return (
                    <div key={question.id} className="card">
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleExpand(question.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
                            {question.title}
                          </h3>
                          <button className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <DifficultyBadge difficulty={question.difficulty} />
                          {question.technology && (
                            <span className="text-sm text-gray-600">
                              {question.technology.icon}{" "}
                              {question.technology.name}
                            </span>
                          )}
                          {question.tags && question.tags.length > 0 && (
                            <div className="flex gap-2">
                              {question.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="badge bg-gray-100 text-gray-700"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Link
                            to={`/questions/${question.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                          >
                            View Full Answer →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter((page) => {
                      const current = pagination.page;
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= current - 1 && page <= current + 1)
                      );
                    })
                    .map((page, idx, arr) => {
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              page === pagination.page
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
