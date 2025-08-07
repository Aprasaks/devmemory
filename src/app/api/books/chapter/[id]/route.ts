import { NextRequest, NextResponse } from "next/server";
import { getBookChapter } from "@/lib/notion";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const chapter = await getBookChapter(id);

    if (!chapter) {
      return NextResponse.json({ error: "챕터를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Chapter API Error:", error);
    return NextResponse.json({ error: "챕터를 불러올 수 없습니다." }, { status: 500 });
  }
}
