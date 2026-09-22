import { FSItem, WorkspaceState } from "./types";

// Apply unique id (timestamp + random suffix).

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// Direct children of a folder, folders first then files, alphabetical within each group.

export function getChildren(state: WorkspaceState, folderId: string): FSItem[] {
  return Object.values(state.items)
    .filter((item) => item.parentId === folderId)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
}

// All descendant ids of a folder (not including the folder itself), any depth.

export function getDescendantIds(
  state: WorkspaceState,
  folderId: string,
): string[] {
  const result: string[] = [];
  const stack = [folderId];
  while (stack.length) {
    const current = stack.pop()!;
    for (const item of Object.values(state.items)) {
      if (item.parentId === current) {
        result.push(item.id);
        if (item.type === "folder") stack.push(item.id);
      }
    }
  }
  return result;
}

// Path from the root down to `itemId`, inclusive.

export function getPath(state: WorkspaceState, itemId: string): FSItem[] {
  const path: FSItem[] = [];
  let current: FSItem | undefined = state.items[itemId];
  while (current) {
    path.unshift(current);
    current = current.parentId ? state.items[current.parentId] : undefined;
  }
  return path;
}

// True if `candidateAncestorId` is the same as, or an ancestor of, `itemId`.

export function isSameOrAncestor(
  state: WorkspaceState,
  candidateAncestorId: string,
  itemId: string,
): boolean {
  let current: FSItem | undefined = state.items[itemId];
  while (current) {
    if (current.id === candidateAncestorId) return true;
    current = current.parentId ? state.items[current.parentId] : undefined;
  }
  return false;
}

export interface NameValidationResult {
  valid: boolean;
  error?: string;
}

// Validates a proposed name for a new or renamed item within `parentId`.

export function validateName(
  state: WorkspaceState,
  parentId: string,
  name: string,
  ignoreId?: string,
): NameValidationResult {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, error: "Name cannot be empty." };
  if (trimmed.includes("/") || trimmed.includes("\\")) {
    return { valid: false, error: "Name cannot contain / or \\." };
  }
  const siblings = getChildren(state, parentId).filter(
    (i) => i.id !== ignoreId,
  );
  const clash = siblings.some(
    (s) =>
      s.name.localeCompare(trimmed, undefined, { sensitivity: "base" }) === 0,
  );
  if (clash) {
    return {
      valid: false,
      error: `"${trimmed}" already exists in this folder.`,
    };
  }
  return { valid: true };
}

// Highlights `query` inside `text` -- returns segments for rendering, case-insensitive.

export function splitByMatch(
  text: string,
  query: string,
): { text: string; match: boolean }[] {
  if (!query.trim()) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const segments: { text: string; match: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      segments.push({ text: text.slice(i), match: false });
      break;
    }
    if (idx > i) segments.push({ text: text.slice(i, idx), match: false });
    segments.push({ text: text.slice(idx, idx + q.length), match: true });
    i = idx + q.length;
  }
  return segments;
}
