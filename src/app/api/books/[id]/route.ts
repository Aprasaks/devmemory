import { NextRequest, NextResponse } from "next/server";
import { getBook } from "@/lib/notion";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const book = await getBook(id);

    if (!book) {
      return NextResponse.json({ error: "책을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Book API Error:", error);
    return NextResponse.json({ error: "책을 불러올 수 없습니다." }, { status: 500 });
  }
}
