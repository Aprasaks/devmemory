// src/app/api/learn/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getLearnPost } from "@/lib/notion";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await getLearnPost(id);

    if (!post) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Learn Post API Error:", error);
    return NextResponse.json({ error: "포스트를 불러올 수 없습니다." }, { status: 500 });
  }
}
