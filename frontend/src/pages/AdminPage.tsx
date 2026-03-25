import { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  LogOut,
  User,
  Edit2,
  Trash2,
  List,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryApi, technologyApi, questionApi } from "@/services/api";
import { Category, Technology, Question, Difficulty } from "@/types";
import { RichTextEditor, CodeEditor } from "@/components";
import { useAuthStore } from "@/store/useAuthStore";

type MainTab = "technology" | "question";
type SubTab = "add" | "manage";

export const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuthStore();
  const [mainTab, setMainTab] = useState<MainTab>("technology");
  const [subTab, setSubTab] = useState<SubTab>("add");

  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Edit state
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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

  useEffect(() => {
    if (mainTab === "question" && subTab === "manage") {
      loadQuestions();
    }
  }, [mainTab, subTab]);

  // Handle navigation from question detail page with edit state
  useEffect(() => {
    const state = location.state as { editQuestion?: Question } | null;
    if (state?.editQuestion) {
      const question = state.editQuestion;
      handleEditQuestion(question);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

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

  const loadQuestions = async () => {
    try {
      const response = await questionApi.getAll({ page: 1, limit: 100 });
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  };

  const resetTechForm = () => {
    setTechForm({
      name: "",
      slug: "",
      description: "",
      icon: "",
      categoryId: "",
      order: "",
    });
    setEditingTech(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      title: "",
      answer: "",
      codeSnippet: "",
      codeLanguage: "",
      difficulty: Difficulty.EASY,
      technologyId: "",
      tags: "",
    });
    setEditingQuestion(null);
  };

  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const techData = {
        name: techForm.name,
        slug: techForm.slug,
        description: techForm.description,
        icon: techForm.icon,
        categoryId: techForm.categoryId,
        order: techForm.order ? parseInt(techForm.order) : undefined,
      };

      if (editingTech) {
        await technologyApi.update(editingTech.id, techData);
        setMessage({
          type: "success",
          text: "Technology updated successfully!",
        });
      } else {
        await technologyApi.create(techData);
        setMessage({
          type: "success",
          text: "Technology created successfully!",
        });
      }

      resetTechForm();
      loadTechnologies();
      if (editingTech) {
        setSubTab("manage");
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Operation failed",
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

      const questionData = {
        title: questionForm.title,
        answer: questionForm.answer,
        codeSnippet: questionForm.codeSnippet || undefined,
        codeLanguage: questionForm.codeLanguage || undefined,
        difficulty: questionForm.difficulty,
        technologyId: questionForm.technologyId,
        tags: tags.length > 0 ? tags : undefined,
      };

      if (editingQuestion) {
        await questionApi.update(editingQuestion.id, questionData);
        setMessage({ type: "success", text: "Question updated successfully!" });
      } else {
        await questionApi.create(questionData);
        setMessage({ type: "success", text: "Question created successfully!" });
      }

      resetQuestionForm();
      loadQuestions();
      if (editingQuestion) {
        setSubTab("manage");
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Operation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTech = (tech: Technology) => {
    setEditingTech(tech);
    setTechForm({
      name: tech.name,
      slug: tech.slug,
      description: tech.description,
      icon: tech.icon,
      categoryId: tech.categoryId,
      order: tech.order?.toString() || "",
    });
    setMainTab("technology");
    setSubTab("add");
  };

  const handleDeleteTech = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technology?")) return;

    setLoading(true);
    try {
      await technologyApi.delete(id);
      setMessage({ type: "success", text: "Technology deleted successfully!" });
      loadTechnologies();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Delete failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      title: question.title,
      answer: question.answer,
      codeSnippet: question.codeSnippet || "",
      codeLanguage: question.codeLanguage || "",
      difficulty: question.difficulty,
      technologyId: question.technologyId,
      tags: question.tags?.map((t) => t.name).join(", ") || "",
    });
    setMainTab("question");
    setSubTab("add");
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    setLoading(true);
    try {
      await questionApi.delete(id);
      setMessage({ type: "success", text: "Question deleted successfully!" });
      loadQuestions();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Delete failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {admin?.name || "Admin"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1">
                  <span className="truncate">User ID: {admin?.userId}</span>
                  {admin?.isSuperAdmin && (
                    <span className="ml-1 px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded whitespace-nowrap">
                      Super Admin
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {admin?.isSuperAdmin && (
                <button
                  onClick={() => navigate("/users")}
                  className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Manage Users</span>
                  <span className="sm:hidden">Users</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Panel
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage technologies and questions
          </p>
        </div>

        {/* Main Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-6">
              <button
                onClick={() => setMainTab("technology")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                  mainTab === "technology"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Technologies
              </button>
              <button
                onClick={() => setMainTab("question")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                  mainTab === "question"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Questions
              </button>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-2 sm:space-x-4 px-4 sm:px-6">
              <button
                onClick={() => {
                  setSubTab("add");
                  if (mainTab === "technology") resetTechForm();
                  if (mainTab === "question") resetQuestionForm();
                }}
                className={`py-2.5 sm:py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 ${
                  subTab === "add"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Add New</span>
              </button>
              <button
                onClick={() => setSubTab("manage")}
                className={`py-2.5 sm:py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 ${
                  subTab === "manage"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Manage Existing</span>
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

            {/* Technology Add/Edit Form */}
            {mainTab === "technology" && subTab === "add" && (
              <form onSubmit={handleTechSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTech ? "Edit Technology" : "Add New Technology"}
                </h3>

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

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        {editingTech ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        {editingTech
                          ? "Update Technology"
                          : "Create Technology"}
                      </>
                    )}
                  </button>
                  {editingTech && (
                    <button
                      type="button"
                      onClick={() => {
                        resetTechForm();
                        setSubTab("manage");
                      }}
                      className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Technology Management */}
            {mainTab === "technology" && subTab === "manage" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Technologies
                </h3>
                {technologies.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No technologies found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {technologies.map((tech) => (
                      <div
                        key={tech.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-2xl">{tech.icon}</span>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {tech.name}
                              </h4>
                              <span className="text-xs text-gray-500">
                                ({tech.slug})
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {tech.description}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>Category: {tech.category?.name}</span>
                              {tech.order !== null && (
                                <span>Order: {tech.order}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditTech(tech)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTech(tech.id)}
                              disabled={loading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Question Add/Edit Form */}
            {mainTab === "question" && subTab === "add" && (
              <form onSubmit={handleQuestionSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingQuestion ? "Edit Question" : "Add New Question"}
                </h3>

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
                  <RichTextEditor
                    value={questionForm.answer}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        answer: value,
                      })
                    }
                    placeholder="Provide a detailed answer with rich formatting..."
                    height="400px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Snippet (Optional)
                  </label>
                  <CodeEditor
                    value={questionForm.codeSnippet}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        codeSnippet: value,
                      })
                    }
                    language={questionForm.codeLanguage || "javascript"}
                    onLanguageChange={(language) =>
                      setQuestionForm({
                        ...questionForm,
                        codeLanguage: language,
                      })
                    }
                    height="400px"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        {editingQuestion ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        {editingQuestion
                          ? "Update Question"
                          : "Create Question"}
                      </>
                    )}
                  </button>
                  {editingQuestion && (
                    <button
                      type="button"
                      onClick={() => {
                        resetQuestionForm();
                        setSubTab("manage");
                      }}
                      className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Question Management */}
            {mainTab === "question" && subTab === "manage" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Questions
                </h3>
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No questions found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {question.title}
                            </h4>
                            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                              <span>
                                Difficulty:{" "}
                                <span
                                  className={`font-medium ${
                                    question.difficulty === "Easy"
                                      ? "text-green-600"
                                      : question.difficulty === "Medium"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {question.difficulty}
                                </span>
                              </span>
                              <span>
                                Technology: {question.technology?.name}
                              </span>
                            </div>
                            {question.tags && question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {question.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              disabled={loading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
