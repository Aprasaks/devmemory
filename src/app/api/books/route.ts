import { NextResponse } from "next/server";
import { getBooks } from "@/lib/notion";

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Books API Error:", error);
    return NextResponse.json({ error: "Books를 불러올 수 없습니다." }, { status: 500 });
  }
}
