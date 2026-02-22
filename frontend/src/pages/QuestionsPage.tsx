import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Question, PaginationMeta } from "@/types";
import { questionApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { QuestionFilters } from "@/components/QuestionFilters";
import { Sidebar } from "@/components/Sidebar";
import { CodeBlock } from "@/components/CodeBlock";

export const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <QuestionFilters onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
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
                {questions.map((question, index) => {
                  const isExpanded = expandedId === question.id;
                  // Calculate question number based on current page
                  const questionNumber = pagination
                    ? (pagination.page - 1) * pagination.limit + index + 1
                    : index + 1;

                  return (
                    <div key={question.id} className="card">
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleExpand(question.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 pr-2 sm:pr-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              <span className="text-primary-600">
                                Question {questionNumber}.
                              </span>{" "}
                              {question.title}
                            </h3>
                          </div>
                          <button className="flex-shrink-0 hover:bg-gray-100 rounded-full p-1 sm:p-1.5 transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <DifficultyBadge difficulty={question.difficulty} />
                          {question.technology && (
                            <span className="text-sm text-gray-600 font-medium">
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
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Answer:
                          </h4>
                          <div className="prose prose-base max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-4 prose-li:text-gray-700 prose-li:leading-7 prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                            <ReactMarkdown>{question.answer}</ReactMarkdown>
                          </div>

                          {question.codeSnippet && (
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                Code Example:
                              </h4>
                              <CodeBlock
                                code={question.codeSnippet}
                                language={question.codeLanguage || "javascript"}
                              />
                            </div>
                          )}

                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <Link
                              to={`/questions/${question.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center text-sm hover:underline"
                            >
                              View in Detail Page →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
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
                        <div
                          key={page}
                          className="flex items-center gap-1 sm:gap-2"
                        >
                          {showEllipsis && (
                            <span className="text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
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
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
