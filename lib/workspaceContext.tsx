"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  Action,
  FSItem,
  ItemType,
  WorkspaceContextValue,
  WorkspaceState,
} from "./types";
import { buildSeedState } from "./seedData";
import { loadState, saveState } from "./storage";
import {
  getDescendantIds,
  isSameOrAncestor,
  makeId,
  validateName,
} from "./utils";

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const reducer = (state: WorkspaceState, action: Action): WorkspaceState => {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "CREATE_ITEM": {
      const id = makeId();
      const now = Date.now();
      const newItem: FSItem = {
        id,
        name: action.name.trim(),
        type: action.itemType,
        parentId: action.parentId,
        content: action.itemType === "file" ? "" : undefined,
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...state,
        items: { ...state.items, [id]: newItem },
      };
    }

    case "RENAME_ITEM": {
      const existing = state.items[action.id];
      if (!existing) return state;
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: {
            ...existing,
            name: action.name.trim(),
            updatedAt: Date.now(),
          },
        },
      };
    }

    case "DELETE_ITEM": {
      const target = state.items[action.id];
      if (!target) return state;

      const idsToDelete = new Set<string>([action.id]);
      if (target.type === "folder") {
        for (const d of getDescendantIds(state, action.id)) idsToDelete.add(d);
      }

      const nextItems = { ...state.items };
      idsToDelete.forEach((id) => delete nextItems[id]);

      // If the selected folder was deleted, fall back to the parent of the deleted item -- or root if
      // that parent no longer exists / there is none.
      let nextSelected = state.selectedFolderId;
      if (idsToDelete.has(nextSelected)) {
        nextSelected =
          target.parentId && nextItems[target.parentId]
            ? target.parentId
            : state.rootId;
      }

      // If the open file was deleted (directly or via an ancestor folder),
      // close the editor.
      const nextOpenFile =
        state.openFileId && idsToDelete.has(state.openFileId)
          ? null
          : state.openFileId;

      return {
        ...state,
        items: nextItems,
        selectedFolderId: nextSelected,
        openFileId: nextOpenFile,
      };
    }

    case "UPDATE_CONTENT": {
      const existing = state.items[action.id];
      if (!existing || existing.type !== "file") return state;
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: {
            ...existing,
            content: action.content,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case "SELECT_FOLDER":
      return { ...state, selectedFolderId: action.id };

    case "OPEN_FILE":
      return { ...state, openFileId: action.id };

    case "CLOSE_FILE":
      return { ...state, openFileId: null };

    default:
      return state;
  }
};

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, undefined, buildSeedState);
  const [hydrated, setHydrated] = React.useState(false);

  // Load persisted state once on mount (client only -- localStorage is unavailable during SSR).

  useEffect(() => {
    const stored = loadState();
    if (stored) dispatch({ type: "HYDRATE", state: stored });
    setHydrated(true);
  }, []);

  // Persist on every change, once hydration has happened (avoids overwriting saved data with the seed on first paint).

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const value = useMemo<WorkspaceContextValue>(() => {
    return {
      state,
      hydrated,
      createItem: (parentId, name, itemType) => {
        const result = validateName(state, parentId, name);
        if (!result.valid) return { ok: false, error: result.error };
        dispatch({ type: "CREATE_ITEM", parentId, name, itemType });
        return { ok: true };
      },
      renameItem: (id, name) => {
        const target = state.items[id];
        if (!target) return { ok: false, error: "Item no longer exists." };
        if (target.parentId === null)
          return { ok: false, error: "The root folder can't be renamed." };
        const result = validateName(state, target.parentId, name, id);
        if (!result.valid) return { ok: false, error: result.error };
        dispatch({ type: "RENAME_ITEM", id, name });
        return { ok: true };
      },
      deleteItem: (id) => dispatch({ type: "DELETE_ITEM", id }),
      updateContent: (id, content) =>
        dispatch({ type: "UPDATE_CONTENT", id, content }),
      selectFolder: (id) => dispatch({ type: "SELECT_FOLDER", id }),
      openFile: (id) => dispatch({ type: "OPEN_FILE", id }),
      closeFile: () => dispatch({ type: "CLOSE_FILE" }),
    };
  }, [state, hydrated]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
};

// Re-exported so components don't need to know they live in ./utils.
export { isSameOrAncestor };
