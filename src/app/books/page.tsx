"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  category: string;
  slug: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          setError("책 목록을 불러오는 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Books 로딩 실패:", error);
        setError("책 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "FullStack":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Frontend":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Backend":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "DevOps":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "CS":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-white">책 목록을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-400 mb-4">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Books</h1>
          <p className="text-gray-400">책 내용을 정리하고 기록합니다</p>
        </div>

        {/* 책 목록 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="group">
                <article className="rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group-hover:transform group-hover:-translate-y-1">
                  {/* 카테고리 */}
                  {book.category && (
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(book.category)}`}
                      >
                        {book.category}
                      </span>
                    </div>
                  )}

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {book.title}
                  </h3>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-2">등록된 책이 없습니다</div>
              <div className="text-gray-500 text-sm">
                노션에서 Books 데이터베이스에 책을 추가해주세요
              </div>
            </div>
          )}
        </div>

        {/* 통계 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">총 {books.length}개의 책</div>
        </div>
      </div>
    </div>
  );
}
