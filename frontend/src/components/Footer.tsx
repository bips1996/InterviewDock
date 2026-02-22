import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Developed by</span>
            <a
              href="https://github.com/bips1996"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-all duration-300 group"
            >
              <img
                src="/bips_logo.png"
                alt="Bips Logo"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-200 group-hover:ring-primary-400 transition-all duration-300"
                onError={(e) => {
                  // Fallback to GitHub icon if logo image is not found
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <Github className="h-6 w-6 hidden" />
              <span className="font-semibold group-hover:underline bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                @bips1996
              </span>
            </a>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} InterviewDock. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
