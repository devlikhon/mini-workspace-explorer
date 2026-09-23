"use client";

import React, { useMemo } from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import { getPath, splitByMatch } from "@/lib/utils";
import { SearchResultsProps } from "@/lib/types";
import { useNavigationGuard } from "@/lib/navigationGuard";

const SearchResults = ({ query }: SearchResultsProps) => {
  const { state, selectFolder, openFile } = useWorkspace();
  const { requestNavigation } = useNavigationGuard();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.values(state.items)
      .filter(
        (item) => item.parentId !== null && item.name.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-3 text-sm text-muted">
        {results.length === 0
          ? `No matches for "${query}"`
          : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {results.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted">
            <span className="text-3xl">🔎</span>
            <p className="text-sm">Nothing matched that search.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {results.map((item) => {
              const path = getPath(state, item.id);
              const locationPath = path
                .slice(0, -1)
                .map((p) => p.name)
                .join(" / ");
              return (
                <li
                  key={item.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-panel2"
                  onClick={() =>
                    requestNavigation(() => {
                      if (item.type === "folder") {
                        selectFolder(item.id);
                      } else {
                        if (item.parentId) selectFolder(item.parentId);
                        openFile(item.id);
                      }
                    })
                  }
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span>{item.type === "folder" ? "📁" : "📄"}</span>
                    <span className="truncate text-sm text-white">
                      {splitByMatch(item.name, query).map((seg, i) =>
                        seg.match ? (
                          <mark
                            key={i}
                            className="rounded bg-accent/40 text-white"
                          >
                            {seg.text}
                          </mark>
                        ) : (
                          <span key={i}>{seg.text}</span>
                        ),
                      )}
                    </span>
                  </div>
                  <span className="ml-3 shrink-0 truncate text-xs text-muted">
                    {locationPath || "Workspace"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
