"use client";

import React from "react";

const Breadcrumb = () => {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm text-muted">
      <button className="rounded px-1.5 py-0.5 hover:bg-panel2 hover:text-white">
        Workspace
      </button>

      <span className="text-border">/</span>

      <button className="rounded px-1.5 py-0.5 hover:bg-panel2 hover:text-white">
        Projects
      </button>

      <span className="text-border">/</span>

      <button className="rounded px-1.5 py-0.5 font-medium text-white" disabled>
        Webbly
      </button>
    </div>
  );
};

export default Breadcrumb;
