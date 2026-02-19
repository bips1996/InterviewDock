import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Category, Technology } from "@/types";
import { categoryApi, technologyApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export const Sidebar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { selectedTechnologyId, setSelectedTechnology } = useAppStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, techs] = await Promise.all([
        categoryApi.getAll(),
        technologyApi.getAll(),
      ]);
      setCategories(cats);
      setTechnologies(techs);

      // Auto-expand first category
      if (cats.length > 0) {
        setExpandedCategory(cats[0].id);
      }
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTechnologiesForCategory = (categoryId: string) => {
    return technologies.filter((tech) => tech.categoryId === categoryId);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Categories
        </h2>

        <nav className="space-y-1">
          {categories.map((category) => {
            const categoryTechs = getTechnologiesForCategory(category.id);
            const isExpanded = expandedCategory === category.id;

            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>{category.name}</span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {categoryTechs.map((tech) => (
                      <button
                        key={tech.id}
                        onClick={() => setSelectedTechnology(tech.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedTechnologyId === tech.id
                            ? "bg-primary-50 text-primary-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="mr-2">{tech.icon}</span>
                        {tech.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
