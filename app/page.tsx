"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import Sidebar from "@/components/Sidebar";
import MainPanel from "@/components/MainPanel";

const Home = () => {
  const { hydrated } = useWorkspace();
  const [query, setQuery] = useState("");

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas text-muted">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />
      <MainPanel />
    </div>
  );
};

export default Home;
