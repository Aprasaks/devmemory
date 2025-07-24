"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  value: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function MarkdownEditor({ value, onChange, title, onTitleChange }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white">
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-2xl font-bold bg-transparent outline-none w-full mb-2"
          placeholder="제목 입력..."
        />
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          {showPreview ? "편집" : "미리보기"}
        </button>
      </div>

      {showPreview ? (
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          <ReactMarkdown
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]}>
                    {String(children)}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 px-1 rounded">{children}</code>
                );
              },
            }}
          >
            {value}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-4 resize-none outline-none font-mono"
          placeholder="# 제목&#10;&#10;```javascript&#10;console.log('코드 작성!');&#10;```"
        />
      )}
    </div>
  );
}
