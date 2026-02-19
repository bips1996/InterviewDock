import { BookOpen, Code, Database, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ace Your Tech Interviews
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive collection of interview questions across frontend,
            backend, and full-stack technologies. All content is free and
            publicly accessible.
          </p>
          <Link
            to="/questions"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Preparing
            <Zap className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organized Content</h3>
            <p className="text-gray-600">
              Questions organized by category, technology, and difficulty level
              for efficient learning.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Code className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Code Examples</h3>
            <p className="text-gray-600">
              Real code snippets with syntax highlighting to understand concepts
              better.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Database className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Extensive Coverage</h3>
            <p className="text-gray-600">
              React, Node.js, PostgreSQL, Spring Boot, and many more
              technologies covered.
            </p>
          </div>
        </div>

        {/* Technologies Preview */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Popular Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "React", icon: "⚛️", color: "bg-blue-50" },
              { name: "Node.js", icon: "🟢", color: "bg-green-50" },
              { name: "PostgreSQL", icon: "🐘", color: "bg-purple-50" },
              { name: "JavaScript", icon: "📜", color: "bg-yellow-50" },
              { name: "TypeScript", icon: "💙", color: "bg-blue-50" },
              { name: "Vue.js", icon: "💚", color: "bg-green-50" },
              { name: "Spring Boot", icon: "🍃", color: "bg-green-50" },
              { name: "MongoDB", icon: "🍃", color: "bg-green-50" },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`${tech.color} p-4 rounded-lg text-center transition-transform hover:scale-105`}
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-medium text-gray-700">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
