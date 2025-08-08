import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const startCursor = searchParams.get("start_cursor");

    // params를 await로 해결해야 함!
    const { id } = await params;

    const response = await notion.blocks.children.list({
      block_id: id, // 이제 id 사용 가능
      start_cursor: startCursor || undefined,
      page_size: 100,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("블록 가져오기 실패:", error);
    return NextResponse.json({ error: "블록을 가져올 수 없습니다" }, { status: 500 });
  }
}
