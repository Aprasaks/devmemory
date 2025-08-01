// src/app/api/todos/route.ts
import { NextResponse } from "next/server";
import { getTodosByDate } from "@/lib/notion";

export async function GET() {
  try {
    const todoData = await getTodosByDate();
    return NextResponse.json(todoData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "투두 데이터를 불러올 수 없습니다." }, { status: 500 });
  }
}
