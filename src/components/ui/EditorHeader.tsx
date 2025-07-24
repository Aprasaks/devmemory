"use client";

import { useState, KeyboardEvent } from "react";
import { Edit3, Eye, X } from "lucide-react";
import { EditorHeaderProps } from "@/types";

export default function EditorHeader({
  title,
  onTitleChange,
  showPreview,
  onTogglePreview,
  tags,
  onTagsChange,
}: EditorHeaderProps) {
  const [tagInput, setTagInput] = useState("");

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="p-4 border-b border-rose-200 bg-white">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-2xl font-bold bg-transparent outline-none w-full text-slate-800 placeholder-slate-400"
        placeholder="제목을 입력하세요..."
      />

      {/* 태그 입력 영역 */}
      <div className="mt-3 mb-3">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
          placeholder="태그를 입력하고 Enter를 누르세요 (예: React, JavaScript)"
          className="w-full px-3 py-2 text-sm bg-rose-50 border border-rose-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full"
            >
              #{tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-rose-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onTogglePreview(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            !showPreview
              ? "bg-rose-500 text-white"
              : "bg-rose-100 text-rose-600 hover:bg-rose-200"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          작성
        </button>
        <button
          onClick={() => onTogglePreview(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            showPreview
              ? "bg-rose-500 text-white"
              : "bg-rose-100 text-rose-600 hover:bg-rose-200"
          }`}
        >
          <Eye className="w-4 h-4" />
          미리보기
        </button>
      </div>
    </div>
  );
}
