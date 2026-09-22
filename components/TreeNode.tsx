"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import { getChildren } from "@/lib/utils";

interface TreeNodeProps {
  id: string;
  depth: number;
}

const TreeNode = ({ id, depth }: TreeNodeProps) => {
  const { state, selectFolder } = useWorkspace();

  const [expanded, setExpanded] = useState(depth === 0);

  const item = state.items[id];
  if (!item) return null;

  const childFolders = getChildren(state, id).filter(
    (c) => c.type === "folder",
  );
  const hasChildren = childFolders.length > 0;
  const isSelected = state.selectedFolderId === id;

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors ${
          isSelected
            ? "bg-accent/20 text-white"
            : "text-muted hover:bg-panel2 hover:text-white"
        }`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => selectFolder(id)}
      >
        <button
          aria-label={expanded ? "Collapse folder" : "Expand folder"}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className={`flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-muted transition-transform ${
            hasChildren ? "" : "invisible"
          } ${expanded ? "rotate-90" : ""}`}
        >
          ▶
        </button>
        <span className="shrink-0">
          {expanded && hasChildren ? "📂" : "📁"}
        </span>
        <span className="truncate">{item.name}</span>
      </div>
      {expanded && hasChildren && (
        <div>
          {childFolders.map((child) => (
            <TreeNode key={child.id} id={child.id} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
