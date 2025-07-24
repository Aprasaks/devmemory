export interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  showPreview: boolean;
  onTogglePreview: (show: boolean) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  showPreview: boolean;
}

export interface MarkdownPreviewProps {
  content: string;
}

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}
