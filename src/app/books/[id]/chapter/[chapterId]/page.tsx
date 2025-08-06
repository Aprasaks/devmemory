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

interface NotionMultiSelectOption {
  name: string;
}

interface NotionDate {
  start: string;
}

interface NotionTitle {
  plain_text: string;
}

interface ChapterDetail {
  이름?: {
    title: NotionTitle[];
  };
  태그?: {
    multi_select: NotionMultiSelectOption[];
  };
  날짜?: {
    date: NotionDate;
  };
}

interface NotionPage {
  properties: ChapterDetail;
}

interface Chapter {
  page: NotionPage;
  blocks: NotionBlock[];
}

export default function ChapterDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  const chapterId = params.chapterId as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterDetail = async () => {
      try {
        const response = await fetch(`/api/books/chapter/${chapterId}`);
        if (response.ok) {
          const data = await response.json();
          setChapter(data);
        } else if (response.status === 404) {
          setError("챕터를 찾을 수 없습니다.");
        } else {
          setError("챕터 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("챕터 정보 로딩 실패:", error);
        setError("챕터 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchChapterDetail();
    }
  }, [chapterId]);

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
            <div className="text-white">챕터 정보를 불러오는 중...</div>
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
            <Link
              href={`/books/${bookId}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← 책으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return null;
  }

  // 챕터 정보 추출
  const chapterDetail = chapter.page.properties;
  const title = chapterDetail["이름"]?.title[0]?.plain_text || "제목 없음";
  const tags = chapterDetail["태그"]?.multi_select?.map((tag) => tag.name) || [];
  const date = chapterDetail["날짜"]?.date?.start || "";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href={`/books/${bookId}`}
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
            책으로 돌아가기
          </Link>
        </div>

        {/* 챕터 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>

          {/* 태그 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
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

          {/* 날짜 */}
          {date && (
            <div className="text-sm text-gray-400">
              {new Date(date).toLocaleDateString("ko-KR")}
            </div>
          )}
        </header>

        {/* 구분선 */}
        <hr className="border-gray-800 mb-8" />

        {/* 챕터 내용 */}
        <article className="prose prose-invert max-w-none">
          {chapter.blocks?.length > 0 ? (
            chapter.blocks.map((block: NotionBlock) => (
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
              href={`/books/${bookId}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              다른 챕터 보기
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
