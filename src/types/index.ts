export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  githubPath?: string;
}

export interface GitHubSyncResult {
  success: boolean;
  path?: string;
  error?: any;
}

// 에디터 관련 타입들도 export
export * from "./editor";
