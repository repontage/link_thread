export interface Comment {
  id: string;
  threadId: string;
  parentId: string | null;
  author: string;
  content: string;
  createdAt: string;
  children?: Comment[]; // For nested/tree structures
}
