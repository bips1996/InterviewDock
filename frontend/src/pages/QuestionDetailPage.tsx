import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag as TagIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Question } from "@/types";
import { questionApi } from "@/services/api";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";
import "react-quill/dist/quill.snow.css";

export const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadQuestion(id);
    }
  }, [id]);

  const loadQuestion = async (questionId: string) => {
    try {
      setLoading(true);
      const data = await questionApi.getById(questionId);
      setQuestion(data);
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Check if content is HTML (from rich text editor) or Markdown
  const isHtmlContent = (text: string): boolean => {
    // Decode first to check actual content
    const decoded = decodeHtmlEntities(text);
    // Check if it contains HTML tags (not just entities)
    return /<\/?[a-z][\s\S]*>/i.test(decoded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Question not found
          </h2>
          <Link to="/questions" className="btn btn-primary">
            Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="relative px-8 py-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-gray-200">
            {/* Question Number - Primary Badge */}
            <div className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg font-mono text-sm font-bold tracking-wide shadow-md mb-4">
              {question.questionNumber}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {question.title}
            </h1>

            {/* Metadata Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <DifficultyBadge difficulty={question.difficulty} />

              {question.technology && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-lg">{question.technology.icon}</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        {question.technology.name}
                      </span>
                      {question.technology.category && (
                        <span className="text-xs text-gray-500 ml-1">
                          • {question.technology.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              <span className="text-gray-300">•</span>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(question.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    {question.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Company Tags */}
            {question.companyTags && question.companyTags.length > 0 && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Companies:
                </span>
                {question.companyTags.map((company, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    {company}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            {/* Answer */}
            <style>{`
            .answer-content {
              font-size: 1.125rem;
              line-height: 1.75rem;
              color: #1f2937;
            }
            .answer-content p {
              margin-bottom: 1rem;
            }
            .answer-content ul, .answer-content ol {
              padding-left: 1.5rem;
              margin-bottom: 1rem;
              list-style-position: outside;
            }
            .answer-content ul {
              list-style-type: disc;
            }
            .answer-content ol {
              list-style-type: decimal;
            }
            .answer-content li {
              margin-bottom: 0.5rem;
              line-height: 1.75;
            }
            .answer-content h1 {
              font-size: 2.25rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: #111827;
            }
            .answer-content h2 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-top: 1.75rem;
              margin-bottom: 0.875rem;
              color: #111827;
            }
            .answer-content h3 {
              font-size: 1.5rem;
              font-weight: 700;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              color: #111827;
            }
            .answer-content h4 {
              font-size: 1.25rem;
              font-weight: 600;
              margin-top: 1.25rem;
              margin-bottom: 0.625rem;
              color: #111827;
            }
            .answer-content h5, .answer-content h6 {
              font-size: 1.125rem;
              font-weight: 600;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              color: #111827;
            }
            .answer-content strong {
              font-weight: 700;
              color: #111827;
            }
            .answer-content em {
              font-style: italic;
            }
            .answer-content u {
              text-decoration: underline;
            }
            .answer-content s {
              text-decoration: line-through;
            }
            .answer-content blockquote {
              border-left: 4px solid #e5e7eb;
              padding-left: 1rem;
              margin: 1rem 0;
              color: #6b7280;
              font-style: italic;
            }
            .answer-content pre {
              background: #1e1e1e;
              color: #d4d4d4;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
            }
            .answer-content code {
              background: #f3f4f6;
              color: #e83e8c;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-size: 0.875em;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
            }
            .answer-content pre code {
              background: transparent;
              color: #d4d4d4;
              padding: 0;
            }
            .answer-content a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .answer-content a:hover {
              color: #2563eb;
            }
            /* Handle Quill color classes */
            .answer-content .ql-align-center {
              text-align: center;
            }
            .answer-content .ql-align-right {
              text-align: right;
            }
            .answer-content .ql-align-justify {
              text-align: justify;
            }
          `}</style>
            {isHtmlContent(question.answer) ? (
              <div
                className="answer-content"
                dangerouslySetInnerHTML={{
                  __html: decodeHtmlEntities(question.answer),
                }}
              />
            ) : (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{question.answer}</ReactMarkdown>
              </div>
            )}

            {/* Code Snippet */}
            {question.codeSnippet && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Code Example</h3>
                <CodeBlock
                  code={question.codeSnippet}
                  language={question.codeLanguage || "javascript"}
                />
              </div>
            )}
          </div>

          {/* Related Questions CTA */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <Link
              to="/questions"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Explore More Questions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
