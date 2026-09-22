import { WorkspaceState } from "./types";

const STORAGE_KEY = "mini-workspace-explorer:v1";

export const loadState = (): WorkspaceState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkspaceState;
    // Minimal shape check so a corrupted/old/duplicated entry doesn't crash the system.
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.items ||
      !parsed.rootId
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveState = (state: WorkspaceState): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};
