"use client";

import { useState } from "react";
import { MarkdownEditorProps } from "@/types";
import EditorHeader from "./ui/EditorHeader";
import TextEditor from "./ui/TextEditor";
import MarkdownPreview from "./ui/MarkdownPreview";

export default function MarkdownEditor({
  value,
  onChange,
  title,
  onTitleChange,
  tags,
  onTagsChange,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <EditorHeader
        title={title}
        onTitleChange={onTitleChange}
        showPreview={showPreview}
        onTogglePreview={setShowPreview}
        tags={tags}
        onTagsChange={onTagsChange}
      />

      <div className="flex-1 flex">
        <TextEditor
          value={value}
          onChange={onChange}
          showPreview={showPreview}
        />

        {showPreview && <MarkdownPreview content={value} />}
      </div>
    </div>
  );
}
