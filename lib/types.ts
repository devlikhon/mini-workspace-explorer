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

export interface TreeNodeProps {
  id: string;
  depth: number;
}

export interface FolderViewProps {
  folderId: string;
}

export type PendingModal =
  | { kind: "create"; itemType: ItemType }
  | { kind: "rename"; item: FSItem }
  | { kind: "delete"; item: FSItem }
  | { kind: "delete-current" }
  | null;

export interface PromptModalProps {
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onSubmit: (value: string) => string | void;
}

export interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface FileEditorProps {
  fileId: string;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export interface MainPanelProps {
  query: string;
  onQueryChange: (value: string) => void;
  onMenuClick: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface SearchResultsProps {
  query: string;
}

export const ROOT_ID = "root";
