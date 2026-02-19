import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Developed by</span>
            <a
              href="https://github.com/bips1996"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors group"
            >
              <img
                src="/bips_logo.png"
                alt="Bips Logo"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to GitHub icon if logo image is not found
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <Github className="h-6 w-6 hidden" />
              <span className="font-medium group-hover:underline">
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
