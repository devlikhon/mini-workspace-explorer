"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import { getChildren } from "@/lib/utils";
import { ConfirmModal, PromptModal } from "./Modal";
import { FolderViewProps, PendingModal } from "@/lib/types";
import { useNavigationGuard } from "@/lib/navigationGuard";

const FolderView = ({ folderId }: FolderViewProps) => {
  const { state, createItem, renameItem, deleteItem, selectFolder, openFile } =
    useWorkspace();
  const { requestNavigation } = useNavigationGuard();
  const [modal, setModal] = useState<PendingModal>(null);

  const folder = state.items[folderId];
  const children = getChildren(state, folderId);
  const isRoot = folder?.parentId === null;

  const closeModal = () => setModal(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="text-sm text-muted">
          {children.length === 0
            ? "Empty folder"
            : `${children.length} item${children.length === 1 ? "" : "s"}`}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModal({ kind: "create", itemType: "folder" })}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-white hover:bg-panel2"
          >
            + New Folder
          </button>
          <button
            onClick={() => setModal({ kind: "create", itemType: "file" })}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-white hover:bg-panel2"
          >
            + New File
          </button>
          <span className="mx-1 h-4 w-px bg-border" />
          <button
            onClick={() => folder && setModal({ kind: "rename", item: folder })}
            disabled={isRoot}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:bg-panel2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            title={
              isRoot ? "The root folder can't be renamed" : "Rename this folder"
            }
          >
            Rename folder
          </button>
          <button
            onClick={() => setModal({ kind: "delete-current" })}
            disabled={isRoot}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              isRoot ? "The root folder can't be deleted" : "Delete this folder"
            }
          >
            Delete folder
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {children.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted">
            <span className="text-3xl">🗂️</span>
            <p className="text-sm">This folder is empty.</p>
            <p className="text-xs">
              Use &quot;New Folder&quot; or &quot;New File&quot; above to add
              something.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {children.map((child) => (
              <li
                key={child.id}
                className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-panel2"
                onClick={() =>
                  requestNavigation(() =>
                    child.type === "folder"
                      ? selectFolder(child.id)
                      : openFile(child.id),
                  )
                }
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span>{child.type === "folder" ? "📁" : "📄"}</span>
                  <span className="truncate text-sm text-white">
                    {child.name}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ kind: "rename", item: child });
                    }}
                    className="rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-white"
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ kind: "delete", item: child });
                    }}
                    className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modal?.kind === "create" && (
        <PromptModal
          title={modal.itemType === "folder" ? "New Folder" : "New File"}
          label="Name"
          initialValue={
            modal.itemType === "file" ? "untitled.txt" : "New Folder"
          }
          confirmLabel="Create"
          onCancel={closeModal}
          onSubmit={(name) => {
            const result = createItem(folderId, name, modal.itemType);
            if (result.ok) closeModal();
            return result.error;
          }}
        />
      )}

      {modal?.kind === "rename" && (
        <PromptModal
          title={`Rename "${modal.item.name}"`}
          label="New name"
          initialValue={modal.item.name}
          confirmLabel="Rename"
          onCancel={closeModal}
          onSubmit={(name) => {
            const result = renameItem(modal.item.id, name);
            if (result.ok) closeModal();
            return result.error;
          }}
        />
      )}

      {modal?.kind === "delete" && (
        <ConfirmModal
          title={`Delete "${modal.item.name}"?`}
          description={
            modal.item.type === "folder"
              ? "This will permanently delete this folder and everything inside it."
              : "This will permanently delete this file."
          }
          onCancel={closeModal}
          onConfirm={() => {
            deleteItem(modal.item.id);
            closeModal();
          }}
        />
      )}

      {modal?.kind === "delete-current" && folder && (
        <ConfirmModal
          title={`Delete "${folder.name}"?`}
          description="This will permanently delete this folder and everything inside it. You'll be moved to its parent folder."
          onCancel={closeModal}
          onConfirm={() => {
            deleteItem(folder.id);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default FolderView;
