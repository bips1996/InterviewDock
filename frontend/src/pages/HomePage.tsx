import { BookOpen, Code, Database, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <img
              src="/id_logo.png"
              alt="InterviewDock Logo"
              className="h-20 w-20 sm:h-28 sm:w-28 mx-auto object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent text-xs sm:text-sm font-semibold tracking-wide">
              Your Path to Interview Success
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight px-2">
            Ace Your{" "}
            <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              Tech Interviews
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-light">
            Master frontend, backend, and full-stack technologies with our
            comprehensive collection of interview questions. Free, accessible,
            and constantly updated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link
              to="/questions"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
            >
              Start Learning
              <Zap className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          {[
            {
              icon: BookOpen,
              title: "Organized Content",
              description:
                "Questions organized by category, technology, and difficulty level for efficient learning.",
              gradient: "from-primary-400 to-primary-600",
            },
            {
              icon: Code,
              title: "Code Examples",
              description:
                "Real code snippets with syntax highlighting to understand concepts better.",
              gradient: "from-accent-500 to-accent-700",
            },
            {
              icon: Database,
              title: "Extensive Coverage",
              description:
                "React, Node.js, PostgreSQL, Spring Boot, and many more technologies covered.",
              gradient: "from-primary-500 to-primary-700",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technologies Preview */}
        <div className="bg-white/90 backdrop-blur-sm border-2 border-primary-100 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-gray-900">
              Master In-Demand{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                Technologies
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Practice interview questions for the most sought-after
              technologies in the industry
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-7">
            {[
              {
                name: "React",
                icon: "⚛️",
                color: "from-blue-400 to-cyan-500",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
              },
              {
                name: "Node.js",
                icon: "🟢",
                color: "from-green-500 to-emerald-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
              },
              {
                name: "PostgreSQL",
                icon: "🐘",
                color: "from-indigo-400 to-purple-600",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
              },
              {
                name: "JavaScript",
                icon: "📜",
                color: "from-yellow-400 to-orange-500",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
              },
              {
                name: "TypeScript",
                icon: "💙",
                color: "from-blue-500 to-indigo-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
              },
              {
                name: "Vue.js",
                icon: "💚",
                color: "from-emerald-500 to-green-600",
                bgColor: "bg-emerald-50",
                borderColor: "border-emerald-200",
              },
              {
                name: "Spring Boot",
                icon: "🍃",
                color: "from-green-600 to-lime-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
              },
              {
                name: "MongoDB",
                icon: "🍃",
                color: "from-green-600 to-teal-700",
                bgColor: "bg-teal-50",
                borderColor: "border-teal-200",
              },
            ].map((tech) => (
              <Link
                key={tech.name}
                to="/questions"
                className={`group relative ${tech.bgColor} border-2 ${tech.borderColor} p-4 sm:p-8 rounded-xl sm:rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden`}
              >
                {/* Animated Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {tech.icon}
                  </div>
                  <div className="font-bold text-gray-800 text-sm sm:text-lg mb-2 group-hover:text-gray-900">
                    {tech.name}
                  </div>
                  <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to explore →
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div
                  className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${tech.color} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                ></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
