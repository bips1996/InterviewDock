import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  height?: string;
}

// Popular programming languages for interview questions
const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "bash", label: "Bash" },
  { value: "shell", label: "Shell" },
  { value: "powershell", label: "PowerShell" },
  { value: "markdown", label: "Markdown" },
];

export const CodeEditor = ({
  value,
  onChange,
  language,
  onLanguageChange,
  height = "400px",
}: CodeEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <div className="code-editor border border-gray-300 rounded-lg overflow-hidden">
      {/* Language Selector */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300">Language:</label>
          <select
            value={language || "javascript"}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
          <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={language || "javascript"}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          foldingStrategy: "indentation",
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
};
