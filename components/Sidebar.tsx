"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import TreeNode from "./TreeNode";
import { SidebarProps } from "@/lib/types";

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { state } = useWorkspace();

  return (
    <>
      {/* Backdrop -- mobile only, closes sidebar on tap */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-border bg-panel transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
    </>
  );
};

export default Sidebar;
