"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Chapter {
  id: string;
  title: string;
  tags: string[];
  date: string | null;
}

interface BookDetail {
  page: {
    properties: {
      이름: {
        title: { plain_text: string }[];
      };
      카테고리?: {
        select: { name: string } | null;
      };
    };
  };
  chapters: Chapter[];
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setBook(data);
        } else if (response.status === 404) {
          setError("책을 찾을 수 없습니다.");
        } else {
          setError("책 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("책 정보 로딩 실패:", error);
        setError("책 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetail();
    }
  }, [bookId]);

  // 카테고리 색상
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

  // 태그 색상
  const getTagColor = (tag: string) => {
    const colors = [
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "bg-green-500/10 text-green-400 border-green-500/20",
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
      "bg-teal-500/10 text-teal-400 border-teal-500/20",
    ];
    return colors[tag.length % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-white">책 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-400 mb-4">{error}</div>
            <Link href="/books" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Books 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  // 책 정보 추출
  const title = book.page.properties.이름.title[0]?.plain_text || "제목 없음";
  const category = book.page.properties.카테고리?.select?.name || "";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href="/books"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Books로 돌아가기
          </Link>
        </div>

        {/* 책 헤더 */}
        <header className="mb-8">
          {/* 카테고리 */}
          {category && (
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{title}</h1>
        </header>

        {/* 구분선 */}
        <hr className="border-gray-800 mb-8" />

        {/* 챕터 목록 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">챕터 목록</h2>

          {book.chapters.length > 0 ? (
            <div className="space-y-4">
              {book.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/books/${bookId}/chapter/${chapter.id}`}
                  className="block p-4 bg-gray-800/70 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200"
                >
                  <h3 className="text-lg font-medium text-white mb-2">{chapter.title}</h3>

                  {/* 태그 */}
                  {chapter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {chapter.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs border ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 날짜 */}
                  {chapter.date && (
                    <div className="text-sm text-gray-400">
                      {new Date(chapter.date).toLocaleDateString("ko-KR")}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-gray-400 mb-2">등록된 챕터가 없습니다</div>
              <div className="text-gray-500 text-sm">
                노션에서 책 페이지의 데이터베이스에 챕터를 추가해주세요
              </div>
            </div>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center">
            <Link
              href="/books"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              다른 책 보기
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
