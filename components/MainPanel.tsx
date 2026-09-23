"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import Breadcrumb from "./Breadcrumb";
import FolderView from "./FolderView";
import FileEditor from "./FileEditor";
import { MainPanelProps } from "@/lib/types";
import SearchResults from "./SearchResults";
import SearchBar from "./SearchBar";

const MainPanel = ({ query, onQueryChange, onMenuClick }: MainPanelProps) => {
  const { state } = useWorkspace();

  let body: React.ReactNode;
  if (state.openFileId && state.items[state.openFileId]) {
    body = <FileEditor fileId={state.openFileId} />;
  } else if (query.trim()) {
    body = <SearchResults query={query} />;
  } else {
    body = <FolderView folderId={state.selectedFolderId} />;
  }

  return (
    <main className="flex h-full w-full min-w-0 flex-1 flex-col bg-canvas">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="rounded-md p-0 text-muted text-xl hover:bg-panel2 hover:text-white md:hidden"
          >
            ☰
          </button>
          <Breadcrumb />
        </div>
        <SearchBar value={query} onChange={onQueryChange} />
      </div>
      <div className="min-h-0 flex-1">{body}</div>
    </main>
  );
};

export default MainPanel;
