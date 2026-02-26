"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  onCheckboxToggle?: (checkboxIndex: number) => void;
}

function buildComponents(onCheckboxToggle?: (index: number) => void): Components {
  let checkboxCount = 0;

  return {
    h1: ({ children }) => <h1 className="text-xl font-bold text-neutral-100 mt-6 mb-3">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-semibold text-neutral-100 mt-5 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-semibold text-neutral-200 mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-sm text-neutral-300 leading-relaxed mb-3">{children}</p>,
    ul: ({ children }) => <ul className="text-sm text-neutral-300 space-y-1 mb-3 pl-1">{children}</ul>,
    ol: ({ children }) => <ol className="text-sm text-neutral-300 space-y-1 mb-3 pl-4 list-decimal">{children}</ol>,
    li: ({ children, ...props }) => {
      const className = props.className;
      if (className === "task-list-item") {
        return <li className="flex items-start gap-2 list-none">{children}</li>;
      }
      return <li className="ml-4 list-disc">{children}</li>;
    },
    input: ({ checked, ...props }) => {
      const index = checkboxCount++;
      return (
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheckboxToggle?.(index)}
          readOnly={!onCheckboxToggle}
          className="mt-1 h-5 w-5 min-w-[20px] rounded border-neutral-700 bg-neutral-800 text-blue-400 accent-blue-400 cursor-pointer"
          {...props}
        />
      );
    },
    a: ({ children, href }) => (
      <a href={href} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    code: ({ children, className }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return (
          <code className="block bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs text-neutral-300 overflow-x-auto mb-3">
            {children}
          </code>
        );
      }
      return <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs text-neutral-200">{children}</code>;
    },
    pre: ({ children }) => <pre className="mb-3">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-neutral-700 pl-3 text-sm text-neutral-400 italic mb-3">{children}</blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-3">
        <table className="text-sm text-neutral-300 border border-neutral-800 w-full">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-neutral-800/50">{children}</thead>,
    th: ({ children }) => <th className="border border-neutral-800 px-3 py-1.5 text-left text-xs font-semibold text-neutral-200">{children}</th>,
    td: ({ children }) => <td className="border border-neutral-800 px-3 py-1.5 text-xs">{children}</td>,
    hr: () => <hr className="border-neutral-800 my-4" />,
    strong: ({ children }) => <strong className="font-semibold text-neutral-100">{children}</strong>,
    em: ({ children }) => <em className="text-neutral-400">{children}</em>,
  };
}

export function MarkdownRenderer({ content, onCheckboxToggle }: MarkdownRendererProps) {
  // Use ref to get fresh components each render (resets checkbox counter)
  const components = useRef(buildComponents(onCheckboxToggle));
  components.current = buildComponents(onCheckboxToggle);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components.current}>
      {content}
    </ReactMarkdown>
  );
}
