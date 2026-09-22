export type ItemType = "folder" | "file";

export interface FSItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceState {
  items: Record<string, FSItem>;
  rootId: string;
  selectedFolderId: string;
  openFileId: string | null;
}

export interface NameValidationResult {
  valid: boolean;
  error?: string;
}

export const ROOT_ID = "root";
