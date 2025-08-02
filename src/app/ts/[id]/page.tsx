"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface NotionRichText {
  plain_text: string;
}

interface NotionBlock {
  id: string;
  type: string;
  paragraph?: {
    rich_text: NotionRichText[];
  };
  heading_1?: {
    rich_text: NotionRichText[];
  };
  heading_2?: {
    rich_text: NotionRichText[];
  };
  heading_3?: {
    rich_text: NotionRichText[];
  };
  bulleted_list_item?: {
    rich_text: NotionRichText[];
  };
  numbered_list_item?: {
    rich_text: NotionRichText[];
  };
  code?: {
    rich_text: NotionRichText[];
    language?: string;
  };
  quote?: {
    rich_text: NotionRichText[];
  };
}

interface NotionSelectOption {
  name: string;
}

interface NotionMultiSelectOption {
  name: string;
}

interface NotionDate {
  start: string;
}

interface NotionTitle {
  plain_text: string;
}

interface PostProperties {
  이름?: {
    title: NotionTitle[];
  };
  문제유형?: {
    select: NotionSelectOption;
  };
  기술스택?: {
    multi_select: NotionMultiSelectOption[];
  };
  작성일?: {
    date: NotionDate;
  };
}

interface NotionPage {
  properties: PostProperties;
}

interface Post {
  page: NotionPage;
  blocks: NotionBlock[];
}

export default function TSPostDetail() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/ts/${params.id}`);
        if (response.ok) {
          const data: Post = await response.json();
          setPost(data);
        } else if (response.status === 404) {
          setError("트러블슈팅 포스트를 찾을 수 없습니다.");
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

  // 문제유형별 색상
  const getTypeColor = (type: string): string => {
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
  const getTechColor = (tech: string): string => {
    const colors = [
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      "bg-pink-500/10 text-pink-400 border-pink-500/20",
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    ];
    return colors[tech.length % colors.length];
  };

  // 노션 블록을 렌더링하는 함수
  const renderNotionBlock = (block: NotionBlock) => {
    const getText = (richText: NotionRichText[] | undefined): string => {
      return richText?.[0]?.plain_text || "";
    };

    switch (block.type) {
      case "paragraph":
        const text = getText(block.paragraph?.rich_text);
        return text ? <p className="mb-4 text-gray-300 leading-relaxed">{text}</p> : null;

      case "heading_1":
        const h1Text = getText(block.heading_1?.rich_text);
        return <h1 className="text-2xl font-bold text-white mb-6 mt-8">{h1Text}</h1>;

      case "heading_2":
        const h2Text = getText(block.heading_2?.rich_text);
        return <h2 className="text-xl font-bold text-white mb-4 mt-6">{h2Text}</h2>;

      case "heading_3":
        const h3Text = getText(block.heading_3?.rich_text);
        return <h3 className="text-lg font-bold text-white mb-3 mt-5">{h3Text}</h3>;

      case "bulleted_list_item":
        const bulletText = getText(block.bulleted_list_item?.rich_text);
        return <li className="mb-2 text-gray-300 list-disc ml-6">{bulletText}</li>;

      case "numbered_list_item":
        const numberText = getText(block.numbered_list_item?.rich_text);
        return <li className="mb-2 text-gray-300 list-decimal ml-6">{numberText}</li>;

      case "code":
        const codeText = getText(block.code?.rich_text);
        const language = block.code?.language || "text";

        return (
          <div className="mb-4">
            {language !== "text" && (
              <div className="text-xs text-gray-400 mb-1 px-4 py-1 bg-gray-900 rounded-t-lg border-b border-gray-700">
                {language}
              </div>
            )}
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: language !== "text" ? "0 0 0.5rem 0.5rem" : "0.5rem",
                fontSize: "0.875rem",
                border: "1px solid rgb(55 65 81)",
              }}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        );

      case "quote":
        const quoteText = getText(block.quote?.rich_text);
        return (
          <blockquote className="border-l-4 border-red-500 pl-4 py-2 mb-4 bg-red-500/5 text-gray-300 italic">
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
            <div className="text-white">트러블슈팅 포스트를 불러오는 중...</div>
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
            <Link href="/ts" className="text-red-400 hover:text-red-300 transition-colors">
              ← TS 페이지로 돌아가기
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
  const postProperties = post.page.properties;
  const title = postProperties["이름"]?.title?.[0]?.plain_text || "제목 없음";
  const problemType = postProperties["문제유형"]?.select?.name || "General";
  const techStack = postProperties["기술스택"]?.multi_select?.map((tech) => tech.name) || [];
  const createdAt = postProperties["작성일"]?.date?.start || "";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href="/ts"
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
            TS로 돌아가기
          </Link>
        </div>

        {/* 포스트 헤더 */}
        <header className="mb-8">
          {/* 문제유형 */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(problemType)}`}
            >
              🔧 {problemType}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{title}</h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div>작성일: {new Date(createdAt).toLocaleDateString("ko-KR")}</div>
            <div className="flex items-center gap-1 text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>해결완료</span>
            </div>
          </div>

          {/* 기술스택 */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm border ${getTechColor(tech)}`}
                >
                  {tech}
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
              href="/ts"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              다른 트러블슈팅 보기
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
