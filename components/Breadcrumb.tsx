"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import { useNavigationGuard } from "@/lib/navigationGuard";
import { getPath } from "@/lib/utils";

const Breadcrumb = () => {
  const { state, selectFolder } = useWorkspace();
  const { requestNavigation } = useNavigationGuard();
  const path = getPath(state, state.selectedFolderId);

  return (
    <div className="flex flex-wrap items-center gap-1 text-sm text-muted">
      {path.map((item, idx) => {
        const isLast = idx === path.length - 1;
        return (
          <React.Fragment key={item.id}>
            {idx > 0 && <span className="text-border">/</span>}
            <button
              onClick={() =>
                !isLast && requestNavigation(() => selectFolder(item.id))
              }
              className={`rounded px-1.5 py-0.5 ${
                isLast
                  ? "font-medium text-white"
                  : "hover:bg-panel2 hover:text-white"
              }`}
              disabled={isLast}
            >
              {item.name}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
