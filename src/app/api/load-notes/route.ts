import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_USERNAME!,
      repo: process.env.KNOWLEDGE_REPO!,
      path: "notes",
    });

    const notes = [];

    if (Array.isArray(data)) {
      for (const yearFolder of data) {
        if (yearFolder.type === "dir") {
          const { data: months } = await octokit.repos.getContent({
            owner: process.env.GITHUB_USERNAME!,
            repo: process.env.KNOWLEDGE_REPO!,
            path: yearFolder.path,
          });

          if (Array.isArray(months)) {
            for (const monthFolder of months) {
              if (monthFolder.type === "dir") {
                const { data: files } = await octokit.repos.getContent({
                  owner: process.env.GITHUB_USERNAME!,
                  repo: process.env.KNOWLEDGE_REPO!,
                  path: monthFolder.path,
                });

                if (Array.isArray(files)) {
                  for (const file of files) {
                    if (
                      file.name.endsWith(".md") &&
                      file.name !== "README.md"
                    ) {
                      const { data: fileData } = await octokit.repos.getContent(
                        {
                          owner: process.env.GITHUB_USERNAME!,
                          repo: process.env.KNOWLEDGE_REPO!,
                          path: file.path,
                        },
                      );

                      if ("content" in fileData) {
                        const content = Buffer.from(
                          fileData.content,
                          "base64",
                        ).toString();
                        const lines = content.split("\n");

                        let title = file.name.replace(".md", "");
                        let noteContent = content;

                        // 프론트매터에서 제목 추출
                        if (content.startsWith("---")) {
                          const endIndex = content.indexOf("---", 3);
                          if (endIndex > 0) {
                            const frontMatter = content.substring(4, endIndex);
                            const titleMatch =
                              frontMatter.match(/title:\s*(.+)/);
                            if (titleMatch) {
                              title = titleMatch[1];
                            }
                            noteContent = content
                              .substring(endIndex + 4)
                              .trim();
                          }
                        }

                        notes.push({
                          id: file.name.replace(".md", ""),
                          title,
                          content: noteContent,
                          tags: [],
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          githubPath: file.path,
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Failed to load notes:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
