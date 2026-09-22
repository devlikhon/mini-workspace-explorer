"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import Breadcrumb from "./Breadcrumb";
import FolderView from "./FolderView";
import FileEditor from "./FileEditor";
import { MainPanelProps } from "@/lib/types";

const MainPanel = ({ query, onQueryChange }: MainPanelProps) => {
  const { state } = useWorkspace();

  let body: React.ReactNode;
  if (state.openFileId && state.items[state.openFileId]) {
    body = <FileEditor fileId={state.openFileId} />;
  } else if (query.trim()) {
  } else {
    body = <FolderView folderId={state.selectedFolderId} />;
  }

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col bg-canvas">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <Breadcrumb />
      </div>
      <div className="min-h-0 flex-1">{body}</div>
    </main>
  );
};

export default MainPanel;
