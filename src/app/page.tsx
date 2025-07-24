"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Brain, FileText, Save } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // GitHub에서 노트 불러오기
  useEffect(() => {
    loadNotesFromGitHub();
  }, []);

  const loadNotesFromGitHub = async () => {
    try {
      const response = await fetch("/api/load-notes");
      const result = await response.json();

      if (result.success && result.notes.length > 0) {
        const loadedNotes = result.notes.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(loadedNotes);
        setSelectedNote(loadedNotes[0]);
      } else {
        // GitHub에 노트가 없으면 기본 노트 생성
        const defaultNote = {
          id: "1",
          title: "첫 번째 노트",
          content: "여기에 내용을 작성하세요...",
          tags: ["테스트"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setNotes([defaultNote]);
        setSelectedNote(defaultNote);
      }
    } catch (error) {
      console.error("노트 로딩 실패:", error);
      // 에러 시 기본 노트 생성
      const defaultNote = {
        id: "1",
        title: "첫 번째 노트",
        content: "여기에 내용을 작성하세요...",
        tags: ["테스트"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes([defaultNote]);
      setSelectedNote(defaultNote);
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "새 노트",
      content: "",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const saveToGitHub = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedNote.id,
          title: selectedNote.title,
          content: selectedNote.content,
          tags: selectedNote.tags,
          createdAt: selectedNote.createdAt.toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("GitHub에 저장되었습니다!");
      } else {
        alert("저장에 실패했습니다: " + result.error);
      }
    } catch (error) {
      alert("오류가 발생했습니다: " + error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
          <p>노트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!selectedNote) {
    return <div>노트를 선택하세요.</div>;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 사이드바 */}
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold">DevMemory</h1>
        </div>

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="노트 검색..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>

        <button
          onClick={createNewNote}
          className="w-full flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg mb-4"
        >
          <Plus className="w-4 h-4" />새 노트
        </button>

        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedNote.id === note.id ? "bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">{note.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {note.content || "내용 없음"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* 마크다운 에디터 */}
        <MarkdownEditor
          title={selectedNote.title}
          onTitleChange={(title) => {
            const updatedNote = { ...selectedNote, title };
            setSelectedNote(updatedNote);
            setNotes(notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)));
          }}
          value={selectedNote.content}
          onChange={(content) => {
            const updatedNote = { ...selectedNote, content };
            setSelectedNote(updatedNote);
            setNotes(notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)));
          }}
        />

        {/* 저장 버튼 */}
        <div className="p-4 bg-white border-t">
          <button
            onClick={saveToGitHub}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            GitHub에 저장
          </button>
        </div>
      </div>
    </div>
  );
}
