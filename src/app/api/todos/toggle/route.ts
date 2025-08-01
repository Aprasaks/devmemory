// src/app/api/todos/toggle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { toggleTodoComplete } from "@/lib/notion";

export async function POST(request: NextRequest) {
  try {
    const { todoId, completed } = await request.json();

    const success = await toggleTodoComplete(todoId, completed);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "투두 상태 업데이트 실패" }, { status: 500 });
    }
  } catch (error) {
    console.error("Toggle API Error:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
