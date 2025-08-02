// src/app/api/ts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTSPosts, getTSPostsByType } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const problemType = searchParams.get("problemType");

    let posts;
    if (problemType) {
      posts = await getTSPostsByType(problemType);
    } else {
      posts = await getTSPosts();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("TS API Error:", error);
    return NextResponse.json({ error: "TS Posts를 불러올 수 없습니다." }, { status: 500 });
  }
}
