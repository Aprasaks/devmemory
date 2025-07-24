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
