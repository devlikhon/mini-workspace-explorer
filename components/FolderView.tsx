"use client";

import React from "react";

const FolderView = () => {
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="text-sm text-muted">4 items</div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-white hover:bg-panel2">
            + New Folder
          </button>

          <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-white hover:bg-panel2">
            + New File
          </button>

          <span className="mx-1 h-4 w-px bg-border" />

          <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:bg-panel2 hover:text-white">
            Rename folder
          </button>

          <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
            Delete folder
          </button>
        </div>
      </div>

      {/* Folder contents */}
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="divide-y divide-border/60">
          {/* Folder */}
          <li className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-panel2">
            <div className="flex min-w-0 items-center gap-2">
              <span>📁</span>

              <span className="truncate text-sm text-white">Components</span>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-white">
                Rename
              </button>

              <button className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                Delete
              </button>
            </div>
          </li>

          {/* Folder */}
          <li className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-panel2">
            <div className="flex min-w-0 items-center gap-2">
              <span>📁</span>

              <span className="truncate text-sm text-white">Pages</span>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-white">
                Rename
              </button>

              <button className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                Delete
              </button>
            </div>
          </li>

          {/* File */}
          <li className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-panel2">
            <div className="flex min-w-0 items-center gap-2">
              <span>📄</span>

              <span className="truncate text-sm text-white">README.txt</span>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-white">
                Rename
              </button>

              <button className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                Delete
              </button>
            </div>
          </li>

          {/* File */}
          <li className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-panel2">
            <div className="flex min-w-0 items-center gap-2">
              <span>📄</span>

              <span className="truncate text-sm text-white">notes.txt</span>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-white">
                Rename
              </button>

              <button className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FolderView;
