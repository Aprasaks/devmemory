"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TSPost {
  id: string;
  title: string;
  problemType: string;
  resolved: boolean;
  techStack: string[];
  createdAt: string;
  slug: string;
}

export default function TSPage() {
  const [posts, setPosts] = useState<TSPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<TSPost[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 문제 유형 목록
  const problemTypes = ["All", "Error", "Build", "Deploy", "Performance", "Config"];

  // 포스트 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/ts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
          setFilteredPosts(data);
        }
      } catch (error) {
        console.error("TS Posts 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = posts;

    // 문제유형 필터
    if (selectedType !== "All") {
      filtered = filtered.filter((post) => post.problemType === selectedType);
    }

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedType, searchTerm]);

  // 문제유형별 색상
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Error":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Build":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Deploy":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Performance":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Config":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  // 기술스택 색상
  const getTechColor = (tech: string) => {
    const colors = [
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      "bg-pink-500/10 text-pink-400 border-pink-500/20",
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    ];
    return colors[tech.length % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-white">트러블슈팅 포스트를 불러오는 중...</div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Trouble Shooting</h1>
          <p className="text-gray-400">개발 중 마주한 문제들과 해결 과정을 기록합니다</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="문제나 기술스택으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
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

          {/* 문제유형 필터 */}
          <div className="flex gap-2 flex-wrap">
            {problemTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedType === type
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-800/30 text-gray-300 border-gray-700 hover:border-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 포스트 목록 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link key={post.id} href={`/ts/${post.id}`} className="group">
                <article className="rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all duration-200 group-hover:transform group-hover:-translate-y-1">
                  {/* 문제유형 */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(post.problemType)}`}
                    >
                      🔧 {post.problemType}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-red-400 transition-colors">
                    {post.title}
                  </h3>

                  {/* 기술스택 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.techStack.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs border ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                    {post.techStack.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-700/50 text-gray-400 border border-gray-600">
                        +{post.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 하단 정보 */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">해결완료</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-2">검색 결과가 없습니다</div>
              <div className="text-gray-500 text-sm">다른 키워드나 문제유형을 시도해보세요</div>
            </div>
          )}
        </div>

        {/* 통계 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            총 {posts.length}개의 트러블슈팅 • 현재 {filteredPosts.length}개 표시 중
          </div>
        </div>
      </div>
    </div>
  );
}
