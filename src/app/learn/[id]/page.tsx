"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface NotionBlock {
  id: string;
  type: string;
  paragraph?: {
    rich_text: Array<{ plain_text: string }>;
  };
  heading_1?: {
    rich_text: Array<{ plain_text: string }>;
  };
  heading_2?: {
    rich_text: Array<{ plain_text: string }>;
  };
  heading_3?: {
    rich_text: Array<{ plain_text: string }>;
  };
  bulleted_list_item?: {
    rich_text: Array<{ plain_text: string }>;
  };
  numbered_list_item?: {
    rich_text: Array<{ plain_text: string }>;
  };
  code?: {
    rich_text: Array<{ plain_text: string }>;
    language?: string;
  };
  quote?: {
    rich_text: Array<{ plain_text: string }>;
  };
}

export default function LearnPostDetail() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/learn/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else if (response.status === 404) {
          setError("포스트를 찾을 수 없습니다.");
        } else {
          setError("포스트를 불러오는 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("포스트 로딩 실패:", error);
        setError("포스트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

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

  // 노션 블록을 렌더링하는 함수
  const renderNotionBlock = (block: NotionBlock) => {
    switch (block.type) {
      case "paragraph":
        const text = block.paragraph?.rich_text?.[0]?.plain_text || "";
        return text ? <p className="mb-4 text-gray-300 leading-relaxed">{text}</p> : null;

      case "heading_1":
        const h1Text = block.heading_1?.rich_text?.[0]?.plain_text || "";
        return <h1 className="text-2xl font-bold text-white mb-6 mt-8">{h1Text}</h1>;

      case "heading_2":
        const h2Text = block.heading_2?.rich_text?.[0]?.plain_text || "";
        return <h2 className="text-xl font-bold text-white mb-4 mt-6">{h2Text}</h2>;

      case "heading_3":
        const h3Text = block.heading_3?.rich_text?.[0]?.plain_text || "";
        return <h3 className="text-lg font-bold text-white mb-3 mt-5">{h3Text}</h3>;

      case "bulleted_list_item":
        const bulletText = block.bulleted_list_item?.rich_text?.[0]?.plain_text || "";
        return <li className="mb-2 text-gray-300 ml-4">• {bulletText}</li>;

      case "numbered_list_item":
        const numberText = block.numbered_list_item?.rich_text?.[0]?.plain_text || "";
        return <li className="mb-2 text-gray-300 ml-4 list-decimal">{numberText}</li>;

      case "code":
        const codeText = block.code?.rich_text?.[0]?.plain_text || "";
        return (
          <pre className="bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-green-400 text-sm">{codeText}</code>
          </pre>
        );

      case "quote":
        const quoteText = block.quote?.rich_text?.[0]?.plain_text || "";
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-500/5 text-gray-300 italic">
            {quoteText}
          </blockquote>
        );

      case "divider":
        return <hr className="border-gray-700 my-8" />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-white">포스트를 불러오는 중...</div>
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
            <Link href="/learn" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Learn 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // 포스트 메타데이터 추출
  const postProperties = post.page?.properties;
  const title = postProperties?.["이름"]?.title?.[0]?.plain_text || "제목 없음";
  const category = postProperties?.["카테고리"]?.select?.name || "General";
  const tags = postProperties?.["태그"]?.multi_select?.map((tag: any) => tag.name) || [];
  const createdAt = postProperties?.["작성일"]?.date?.start || "";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href="/learn"
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
            Learn으로 돌아가기
          </Link>
        </div>

        {/* 포스트 헤더 */}
        <header className="mb-8">
          {/* 카테고리 */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
            >
              {category}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{title}</h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div>작성일: {new Date(createdAt).toLocaleDateString("ko-KR")}</div>
          </div>

          {/* 태그 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm border ${getTagColor(tag)}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 구분선 */}
        <hr className="border-gray-800 mb-8" />

        {/* 포스트 내용 */}
        <article className="prose prose-invert max-w-none">
          {post.blocks?.length > 0 ? (
            post.blocks.map((block: NotionBlock) => (
              <div key={block.id}>{renderNotionBlock(block)}</div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>아직 내용이 작성되지 않았습니다.</p>
            </div>
          )}
        </article>

        {/* 하단 네비게이션 */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center">
            <Link
              href="/learn"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              다른 포스트 보기
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
