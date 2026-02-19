import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({
  code,
  language = "javascript",
}: CodeBlockProps) => {
  return (
    <div className="rounded-lg overflow-hidden my-4">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
