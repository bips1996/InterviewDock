import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Question, PaginationMeta } from "@/types";
import { questionApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { QuestionFilters } from "@/components/QuestionFilters";
import { Sidebar } from "@/components/Sidebar";
import { CodeBlock } from "@/components/CodeBlock";
import "react-quill/dist/quill.snow.css";

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

  const handleLike = async (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedQuestion = await questionApi.like(questionId);
      // Update the question in the list
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === questionId ? updatedQuestion : q)),
      );
    } catch (error) {
      console.error("Failed to like question:", error);
    }
  };

  const handleDislike = async (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedQuestion = await questionApi.dislike(questionId);
      // Update the question in the list
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === questionId ? updatedQuestion : q)),
      );
    } catch (error) {
      console.error("Failed to dislike question:", error);
    }
  };

  const getImpressionScore = (question: Question): number => {
    return question.likes - question.dislikes;
  };

  const handlePageChange = (newPage: number) => {
    useAppStore.getState().setFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Check if content is HTML (from rich text editor) or Markdown
  const isHtmlContent = (text: string): boolean => {
    const decoded = decodeHtmlEntities(text);
    return /<\/?[a-z][\s\S]*>/i.test(decoded);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <QuestionFilters onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            {/* Loading State */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 animate-pulse"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-32"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-16 bg-gray-200 rounded-md"></div>
                        <div className="h-7 w-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Questions List */}
            {!loading && questions.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 text-center py-12">
                <p className="text-gray-600 text-base">
                  No questions found. Try adjusting your filters.
                </p>
              </div>
            )}

            {!loading && questions.length > 0 && (
              <div className="space-y-3">
                {questions.map((question) => {
                  const isExpanded = expandedId === question.id;

                  return (
                    <div
                      key={question.id}
                      className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50/50 transition-all duration-200 overflow-hidden"
                    >
                      {/* Card Header */}
                      <div
                        className="px-3 sm:px-6 py-4 sm:py-5 cursor-pointer"
                        onClick={() => toggleExpand(question.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
                          {/* Left Side: Question Title */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug mb-1 hover:text-blue-600 transition-colors">
                              {question.title}
                            </h3>
                            {/* Question ID as subtle kicker */}
                            <p className="text-xs text-gray-400 font-mono">
                              {question.questionNumber}
                            </p>
                          </div>

                          {/* Right Side: Metadata */}
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                            {/* Impressions */}
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={(e) => handleLike(question.id, e)}
                                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 text-xs text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Like"
                              >
                                <ThumbsUp className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                                <span className="font-medium">
                                  {question.likes}
                                </span>
                              </button>
                              <button
                                onClick={(e) => handleDislike(question.id, e)}
                                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Dislike"
                              >
                                <ThumbsDown className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                                <span className="font-medium">
                                  {question.dislikes}
                                </span>
                              </button>
                              <span className="text-xs font-semibold text-gray-700">
                                ({getImpressionScore(question) >= 0 ? "+" : ""}
                                {getImpressionScore(question)})
                              </span>
                            </div>

                            {/* Difficulty Badge */}
                            <DifficultyBadge difficulty={question.difficulty} />

                            {/* Technology */}
                            {question.technology && (
                              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                <span className="text-sm">
                                  {question.technology.icon}
                                </span>
                                <span className="font-medium">
                                  {question.technology.name}
                                </span>
                              </div>
                            )}

                            {/* Expand Button */}
                            <button className="flex-shrink-0 p-1 sm:p-1.5 hover:bg-gray-200 rounded-lg transition-colors sm:ml-2">
                              {isExpanded ? (
                                <ChevronUp className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-5 py-3 sm:py-4">
                          {/* Tags and Company Tags */}
                          <div className="flex items-center gap-2 flex-wrap mb-4">
                            {/* Tags */}
                            {question.tags && question.tags.length > 0 && (
                              <>
                                {question.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-medium"
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </>
                            )}

                            {/* Company Tags */}
                            {question.companyTags &&
                              question.companyTags.length > 0 && (
                                <>
                                  {question.companyTags.map((company, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold"
                                    >
                                      {company}
                                    </span>
                                  ))}
                                </>
                              )}
                          </div>

                          <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Answer:
                          </h4>

                          {isHtmlContent(question.answer) ? (
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: decodeHtmlEntities(question.answer),
                              }}
                            />
                          ) : (
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown>{question.answer}</ReactMarkdown>
                            </div>
                          )}

                          {question.codeSnippet && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Code Example:
                              </h4>
                              <CodeBlock
                                code={question.codeSnippet}
                                language={question.codeLanguage || "javascript"}
                              />
                            </div>
                          )}

                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <Link
                              to={`/questions/${question.id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline inline-flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Full Details →
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
