"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MarkdownPreviewProps } from "@/types";

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="w-1/2 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]}>
                  {String(children)}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-slate-800 mb-4 border-b border-rose-200 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-slate-700 mb-3 mt-6">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium text-slate-700 mb-2 mt-4">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-slate-600 mb-3 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-slate-600 mb-3 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-slate-600 mb-3 space-y-1">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-rose-300 pl-4 py-2 bg-rose-50 text-slate-600 mb-3 italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {content || "*미리보기가 여기에 표시됩니다...*"}
        </ReactMarkdown>
      </div>
    </div>
  );
}
