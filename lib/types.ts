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

export type Action =
  | { type: "HYDRATE"; state: WorkspaceState }
  | { type: "CREATE_ITEM"; parentId: string; name: string; itemType: ItemType }
  | { type: "RENAME_ITEM"; id: string; name: string }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "UPDATE_CONTENT"; id: string; content: string }
  | { type: "SELECT_FOLDER"; id: string }
  | { type: "OPEN_FILE"; id: string }
  | { type: "CLOSE_FILE" };

export interface WorkspaceContextValue {
  state: WorkspaceState;
  hydrated: boolean;
  createItem: (
    parentId: string,
    name: string,
    itemType: ItemType,
  ) => { ok: boolean; error?: string };
  renameItem: (id: string, name: string) => { ok: boolean; error?: string };
  deleteItem: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  selectFolder: (id: string) => void;
  openFile: (id: string) => void;
  closeFile: () => void;
}

export const ROOT_ID = "root";
