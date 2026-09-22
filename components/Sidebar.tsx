"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import TreeNode from "./TreeNode";

const Sidebar = () => {
  const { state } = useWorkspace();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-panel">
      <div className="border-b border-border px-4 py-3">
        <h1 className="text-sm font-semibold text-white">
          Mini Workspace Explorer
        </h1>
        <p className="text-xs text-muted">Folders</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <TreeNode id={state.rootId} depth={0} />
      </div>
    </aside>
  );
};

export default Sidebar;
