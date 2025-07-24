import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const note = await request.json();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 기존 파일이 있는지 확인 (githubPath가 있으면 기존 파일)
    let path;
    let sha = undefined;

    if (note.githubPath) {
      // 기존 파일 업데이트
      path = note.githubPath;

      // 기존 파일의 SHA 가져오기 (업데이트에 필요)
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner: process.env.GITHUB_USERNAME!,
          repo: process.env.KNOWLEDGE_REPO!,
          path: path,
        });

        if ("sha" in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error) {
        console.log("기존 파일을 찾을 수 없어서 새 파일로 생성합니다.");
      }
    } else {
      // 새 파일 생성
      const filename = `${year}-${month}-${day}-${note.id}.md`;
      path = `notes/${year}/${month}/${filename}`;
    }

    const content = `---
title: ${note.title}
tags: [${note.tags?.join(", ") || ""}]
created: ${note.createdAt}
updated: ${note.updatedAt}
---

${note.content}
`;

    const params = {
      owner: process.env.GITHUB_USERNAME!,
      repo: process.env.KNOWLEDGE_REPO!,
      path,
      message: sha ? `Update note: ${note.title}` : `Add note: ${note.title}`,
      content: Buffer.from(content).toString("base64"),
      ...(sha && { sha }), // SHA가 있으면 포함 (업데이트용)
    };

    await octokit.repos.createOrUpdateFileContents(params);

    return NextResponse.json({ success: true, path });
  } catch (error) {
    console.error("Failed to save to GitHub:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
