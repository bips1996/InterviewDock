import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { categoryApi, technologyApi, questionApi } from "@/services/api";
import { Category, Technology, Difficulty } from "@/types";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"technology" | "question">(
    "technology",
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Technology form state
  const [techForm, setTechForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    categoryId: "",
    order: "",
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    title: "",
    answer: "",
    codeSnippet: "",
    codeLanguage: "",
    difficulty: Difficulty.EASY,
    technologyId: "",
    tags: "",
  });

  useEffect(() => {
    loadCategories();
    loadTechnologies();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadTechnologies = async () => {
    try {
      const data = await technologyApi.getAll();
      setTechnologies(data);
    } catch (error) {
      console.error("Failed to load technologies:", error);
    }
  };

  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await technologyApi.create({
        name: techForm.name,
        slug: techForm.slug,
        description: techForm.description,
        icon: techForm.icon,
        categoryId: techForm.categoryId,
        order: techForm.order ? parseInt(techForm.order) : undefined,
      });

      setMessage({ type: "success", text: "Technology created successfully!" });
      setTechForm({
        name: "",
        slug: "",
        description: "",
        icon: "",
        categoryId: "",
        order: "",
      });
      loadTechnologies();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create technology",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const tags = questionForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await questionApi.create({
        title: questionForm.title,
        answer: questionForm.answer,
        codeSnippet: questionForm.codeSnippet || undefined,
        codeLanguage: questionForm.codeLanguage || undefined,
        difficulty: questionForm.difficulty,
        technologyId: questionForm.technologyId,
        tags: tags.length > 0 ? tags : undefined,
      });

      setMessage({ type: "success", text: "Question created successfully!" });
      setQuestionForm({
        title: "",
        answer: "",
        codeSnippet: "",
        codeLanguage: "",
        difficulty: Difficulty.EASY,
        technologyId: "",
        tags: "",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create question",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Add new technologies and questions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("technology")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "technology"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Add Technology
              </button>
              <button
                onClick={() => setActiveTab("question")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "question"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Add Question
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Technology Form */}
            {activeTab === "technology" && (
              <form onSubmit={handleTechSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={techForm.name}
                      onChange={(e) =>
                        setTechForm({ ...techForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., React"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={techForm.slug}
                      onChange={(e) =>
                        setTechForm({ ...techForm, slug: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., react"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={techForm.description}
                      onChange={(e) =>
                        setTechForm({
                          ...techForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Brief description of the technology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon (Emoji) *
                    </label>
                    <input
                      type="text"
                      required
                      value={techForm.icon}
                      onChange={(e) =>
                        setTechForm({ ...techForm, icon: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="⚛️"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={techForm.categoryId}
                      onChange={(e) =>
                        setTechForm({ ...techForm, categoryId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order (Optional)
                    </label>
                    <input
                      type="number"
                      value={techForm.order}
                      onChange={(e) =>
                        setTechForm({ ...techForm, order: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Technology
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Question Form */}
            {activeTab === "question" && (
              <form onSubmit={handleQuestionSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={questionForm.title}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="What is the Virtual DOM?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer *
                  </label>
                  <textarea
                    required
                    value={questionForm.answer}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        answer: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={10}
                    placeholder="Provide a detailed answer (Markdown supported)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Snippet (Optional)
                  </label>
                  <textarea
                    value={questionForm.codeSnippet}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        codeSnippet: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    rows={8}
                    placeholder="const example = () => { ... }"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code Language
                    </label>
                    <input
                      type="text"
                      value={questionForm.codeLanguage}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          codeLanguage: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="javascript"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technology *
                    </label>
                    <select
                      required
                      value={questionForm.technologyId}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          technologyId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a technology</option>
                      {technologies.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.icon} {tech.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty *
                    </label>
                    <select
                      required
                      value={questionForm.difficulty}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={questionForm.tags}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          tags: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Hooks, Performance, React"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Question
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
