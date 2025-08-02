"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LearnPost {
  id: string;
  title: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  slug: string;
}

export default function LearnPage() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<LearnPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 카테고리 목록
  const categories = ["All", "React", "Next.js", "CSS", "JavaScript", "TypeScript"];

  // 포스트 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/learn");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
          setFilteredPosts(data);
        }
      } catch (error) {
        console.error("Learn Posts 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = posts;

    // 카테고리 필터
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "React":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Next.js":
        return "bg-gray-500/10 text-gray-300 border-gray-500/20";
      case "CSS":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "JavaScript":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "TypeScript":
        return "bg-blue-600/10 text-blue-300 border-blue-600/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  // 태그 색상
  const getTagColor = (tag: string) => {
    const colors = [
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "bg-green-500/10 text-green-400 border-green-500/20",
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
      "bg-teal-500/10 text-teal-400 border-teal-500/20",
      "bg-red-500/10 text-red-400 border-red-500/20",
    ];
    return colors[tag.length % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-white">Learn Posts를 불러오는 중...</div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Learn</h1>
          <p className="text-gray-400">개발 학습 기록과 지식을 정리합니다</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="포스트나 태그로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <svg
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-800/30 text-gray-300 border-gray-700 hover:border-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 포스트 목록 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link key={post.id} href={`/learn/${post.id}`} className="group">
                <article className="rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group-hover:transform group-hover:-translate-y-1">
                  {/* 카테고리 */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs border ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-700/50 text-gray-400 border border-gray-600">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 작성일 */}
                  <div className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-2">검색 결과가 없습니다</div>
              <div className="text-gray-500 text-sm">다른 키워드나 카테고리를 시도해보세요</div>
            </div>
          )}
        </div>

        {/* 통계 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            총 {posts.length}개의 포스트 • 현재 {filteredPosts.length}개 표시 중
          </div>
        </div>
      </div>
    </div>
  );
}
