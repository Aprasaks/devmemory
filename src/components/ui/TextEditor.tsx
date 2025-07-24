"use client";

import { TextEditorProps } from "@/types";

export default function TextEditor({
  value,
  onChange,
  showPreview,
}: TextEditorProps) {
  return (
    <div
      className={`${showPreview ? "w-1/2" : "w-full"} flex flex-col border-r border-rose-200`}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 resize-none outline-none font-mono text-sm text-slate-700 bg-rose-50/30"
        placeholder="# 제목&#10;&#10;여기에 마크다운으로 작성하세요...&#10;&#10;```javascript&#10;console.log('코드 블록도 사용 가능!');&#10;```&#10;&#10;- 리스트&#10;- 항목들"
      />
    </div>
  );
}
