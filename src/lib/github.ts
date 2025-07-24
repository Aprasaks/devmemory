import { Octokit } from "@octokit/rest";
import { Note, GitHubSyncResult } from "@/types";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const saveNoteToGitHub = async (note: Note): Promise<GitHubSyncResult> => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const filename = `${year}-${month}-${day}-${note.id}.md`;
    const path = `notes/${year}/${month}/${filename}`;

    const content = `---
title: ${note.title}
tags: [${note.tags.join(", ")}]
created: ${note.createdAt.toISOString()}
updated: ${note.updatedAt.toISOString()}
---

${note.content}
`;

    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_USERNAME!,
      repo: process.env.KNOWLEDGE_REPO!,
      path,
      message: `Add note: ${note.title}`,
      content: Buffer.from(content).toString("base64"),
    });

    return { success: true, path };
  } catch (error) {
    console.error("Failed to save to GitHub:", error);
    return { success: false, error };
  }
};
