// src/app/api/learn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getLearnPosts, getLearnPostsByCategory } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let posts;
    if (category) {
      posts = await getLearnPostsByCategory(category);
    } else {
      posts = await getLearnPosts();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Learn API Error:", error);
    return NextResponse.json({ error: "Learn Posts를 불러올 수 없습니다." }, { status: 500 });
  }
}
