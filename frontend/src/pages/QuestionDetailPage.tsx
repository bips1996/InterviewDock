import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag as TagIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Question } from "@/types";
import { questionApi } from "@/services/api";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CodeBlock } from "@/components/CodeBlock";

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
        <div className="card">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {question.title}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              <DifficultyBadge difficulty={question.difficulty} />

              {question.technology && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">{question.technology.icon}</span>
                  <span className="font-medium">
                    {question.technology.name}
                  </span>
                  {question.technology.category && (
                    <span className="text-gray-400">
                      • {question.technology.category.name}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(question.createdAt).toLocaleDateString()}
              </div>
            </div>

            {question.tags && question.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <div className="flex gap-2 flex-wrap">
                  {question.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="badge bg-gray-100 text-gray-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Answer */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{question.answer}</ReactMarkdown>
          </div>

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
        <div className="mt-6 text-center">
          <Link
            to="/questions"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            Explore More Questions →
          </Link>
        </div>
      </div>
    </div>
  );
};
