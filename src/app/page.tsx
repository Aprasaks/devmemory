"use client";

import { useState, useEffect } from "react";
import { Search, Plus, FileText, Save } from "lucide-react";
import { Note } from "@/types";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotesFromGitHub();
  }, []);

  const loadNotesFromGitHub = async () => {
    try {
      const response = await fetch("/api/load-notes");
      const result = await response.json();

      if (result.success && result.notes.length > 0) {
        const loadedNotes: Note[] = result.notes.map((note: Note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(loadedNotes);
        setSelectedNote(loadedNotes[0]);
      } else {
        const defaultNote: Note = {
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
      const defaultNote: Note = {
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
    const newNote: Note = {
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
    if (!selectedNote) return;

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
          githubPath: selectedNote.githubPath,
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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-rose-500 rounded-full animate-pulse" />
          <p className="text-rose-700">노트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!selectedNote) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="text-slate-600">노트를 선택하세요.</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-rose-50 to-pink-100 relative">
      {/* 사이드바 */}
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-rose-200 p-4 shadow-sm overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">DM</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">DevMemory</h1>
        </div>

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="노트 검색..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-rose-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
          />
        </div>

        <button
          onClick={createNewNote}
          className="w-full flex items-center justify-center gap-2 p-3 text-rose-600 hover:bg-rose-50 rounded-xl mb-6 transition-all border border-dashed border-rose-300 hover:border-rose-400"
        >
          <Plus className="w-4 h-4" />새 노트 만들기
        </button>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 mb-3 px-2">
            전체 노트 ({notes.length}개)
          </div>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedNote.id === note.id
                  ? "bg-rose-500 text-white shadow-md"
                  : "bg-white hover:bg-rose-50 border border-rose-100 hover:border-rose-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    selectedNote.id === note.id ? "text-white" : "text-rose-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-sm truncate ${
                      selectedNote.id === note.id
                        ? "text-white"
                        : "text-slate-800"
                    }`}
                  >
                    {note.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      selectedNote.id === note.id
                        ? "text-rose-100"
                        : "text-slate-500"
                    }`}
                  >
                    {note.content.replace(/[#*`]/g, "").substring(0, 60) ||
                      "내용 없음"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedNote.id === note.id
                              ? "bg-white/20 text-white"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-xs ${
                        selectedNote.id === note.id
                          ? "text-rose-200"
                          : "text-slate-400"
                      }`}
                    >
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 에디터 영역 */}
      <div className="flex-1 flex flex-col">
        <MarkdownEditor
          title={selectedNote.title}
          onTitleChange={(title: string) => {
            const updatedNote = { ...selectedNote, title };
            setSelectedNote(updatedNote);
            setNotes(
              notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)),
            );
          }}
          value={selectedNote.content}
          onChange={(content: string) => {
            const updatedNote = { ...selectedNote, content };
            setSelectedNote(updatedNote);
            setNotes(
              notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)),
            );
          }}
          tags={selectedNote.tags}
          onTagsChange={(tags: string[]) => {
            const updatedNote = { ...selectedNote, tags };
            setSelectedNote(updatedNote);
            setNotes(
              notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)),
            );
          }}
        />
      </div>

      {/* 플로팅 저장 버튼 */}
      <button
        onClick={saveToGitHub}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 z-50"
      >
        <Save className="w-5 h-5" />
        <span className="font-medium">저장</span>
      </button>
    </div>
  );
}
