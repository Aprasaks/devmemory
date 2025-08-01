// src/lib/notion.ts
import { Client } from "@notionhq/client";

// 노션 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 데이터베이스 ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

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
