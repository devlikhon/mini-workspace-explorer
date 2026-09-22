"use client";

import React from "react";
import Breadcrumb from "./Breadcrumb";
import FolderView from "./FolderView";

const MainPanel = () => {
  return (
    <main className="flex h-full min-w-0 flex-1 flex-col bg-canvas">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <Breadcrumb />

        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search workspace..."
            className="w-64 rounded-lg border border-border bg-panel px-3 py-1.5 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
          />
        </div>
      </div>

      {/* Folder */}
      <div className="min-h-0 flex-1">
        <FolderView />
      </div>
    </main>
  );
};

export default MainPanel;
