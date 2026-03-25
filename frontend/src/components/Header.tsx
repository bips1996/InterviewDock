import { Link } from "react-router-dom";
import { Shield, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export const Header = () => {
  const { isAuthenticated, admin } = useAuthStore();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/id_logo.png"
              alt="InterviewDock Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
              onError={(e) => {
                // Fallback if logo not found
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-base sm:text-xl font-black tracking-wide uppercase transition-colors duration-200">
              <span className="text-gray-900">INTERVIEW </span>
              <span style={{ color: "#bc8109" }}>DOCK</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
            >
              Home
            </Link>
            <Link
              to="/questions"
              className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
            >
              Questions
            </Link>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-1"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
