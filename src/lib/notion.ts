// src/lib/notion.ts
import { Client } from "@notionhq/client";

// 노션 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 데이터베이스 ID들
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const LEARN_DATABASE_ID = process.env.NOTION_LEARN_DB_ID!;

// Learn Post 타입 정의
export interface LearnPost {
  id: string;
  title: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  slug: string;
}

// 투두 아이템 타입 정의
export interface TodoItem {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

// 노션에서 투두 데이터 가져오기
export async function getTodosByDate() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "날짜",
          direction: "ascending",
        },
      ],
    });

    // 날짜별로 그룹화된 투두 데이터 생성
    const todosByDate: Record<number, TodoItem[]> = {};

    response.results.forEach((page: any) => {
      if (page.properties) {
        const title = page.properties["이름"]?.title?.[0]?.plain_text || "";
        const dateProperty = page.properties["날짜"]?.date?.start;
        const completed = page.properties["완료"]?.checkbox || false;
        const priority = page.properties["우선순위"]?.select?.name || "Medium";

        if (dateProperty && title) {
          const date = new Date(dateProperty);
          const day = date.getDate();

          if (!todosByDate[day]) {
            todosByDate[day] = [];
          }

          todosByDate[day].push({
            id: page.id,
            title,
            date: dateProperty,
            completed,
            priority: priority as "High" | "Medium" | "Low",
          });
        }
      }
    });

    return todosByDate;
  } catch (error) {
    console.error("노션 데이터 가져오기 실패:", error);
    return {};
  }
}

// 투두 완료 상태 토글
export async function toggleTodoComplete(pageId: string, completed: boolean) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        완료: {
          checkbox: !completed,
        },
      },
    });
    return true;
  } catch (error) {
    console.error("투두 상태 업데이트 실패:", error);
    return false;
  }
}

// 새 투두 아이템 추가
export async function addTodoItem(
  title: string,
  date: string,
  priority: "High" | "Medium" | "Low" = "Medium"
) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        이름: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        날짜: {
          date: {
            start: date,
          },
        },
        완료: {
          checkbox: false,
        },
        우선순위: {
          select: {
            name: priority,
          },
        },
      },
    });
    return response;
  } catch (error) {
    console.error("투두 아이템 추가 실패:", error);
    return null;
  }
}

// Learn Posts 관련 함수들

// 모든 Learn Posts 가져오기 (발행된 것만)
export async function getLearnPosts() {
  try {
    const response = await notion.databases.query({
      database_id: LEARN_DATABASE_ID,
      filter: {
        property: "작성완료",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "작성일",
          direction: "descending",
        },
      ],
    });

    const posts: LearnPost[] = response.results.map((page: any) => {
      const title = page.properties["이름"]?.title?.[0]?.plain_text || "";
      const category = page.properties["카테고리"]?.select?.name || "General";
      const tags = page.properties["태그"]?.multi_select?.map((tag: any) => tag.name) || [];
      const published = page.properties["Published"]?.checkbox || false;
      const createdAt = page.properties["작성일"]?.date?.start || "";

      // 슬러그 생성 (제목을 URL에 적합하게 변환)
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();

      return {
        id: page.id,
        title,
        category,
        tags,
        published,
        createdAt,
        slug: slug || page.id,
      };
    });

    return posts;
  } catch (error) {
    console.error("Learn Posts 가져오기 실패:", error);
    return [];
  }
}

// 카테고리별 Learn Posts 가져오기
export async function getLearnPostsByCategory(category: string) {
  try {
    const response = await notion.databases.query({
      database_id: LEARN_DATABASE_ID,
      filter: {
        and: [
          {
            property: "작성완료",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "카테고리",
            select: {
              equals: category,
            },
          },
        ],
      },
      sorts: [
        {
          property: "작성일",
          direction: "descending",
        },
      ],
    });

    const posts: LearnPost[] = response.results.map((page: any) => {
      const title = page.properties["이름"]?.title?.[0]?.plain_text || "";
      const category = page.properties["카테고리"]?.select?.name || "General";
      const tags = page.properties["태그"]?.multi_select?.map((tag: any) => tag.name) || [];
      const published = page.properties["작성완료"]?.checkbox || false;
      const createdAt = page.properties["작성일"]?.date?.start || "";

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();

      return {
        id: page.id,
        title,
        category,
        tags,
        published,
        createdAt,
        slug: slug || page.id,
      };
    });

    return posts;
  } catch (error) {
    console.error("카테고리별 Learn Posts 가져오기 실패:", error);
    return [];
  }
}

// 개별 Learn Post 가져오기 (페이지 내용 포함)
export async function getLearnPost(pageId: string) {
  try {
    // 페이지 메타데이터 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId });

    // 페이지 콘텐츠 가져오기
    const blocks = await notion.blocks.children.list({ block_id: pageId });

    return {
      page,
      blocks: blocks.results,
    };
  } catch (error) {
    console.error("개별 Learn Post 가져오기 실패:", error);
    return null;
  }
}
