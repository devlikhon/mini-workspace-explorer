"use client";

import React, { useEffect, useState } from "react";
import { useWorkspace } from "@/lib/workspaceContext";
import { FileEditorProps } from "@/lib/types";
import { useNavigationGuard } from "@/lib/navigationGuard";

const FileEditor = ({ fileId }: FileEditorProps) => {
  const { state, updateContent, closeFile } = useWorkspace();
  const { setGuard, requestNavigation } = useNavigationGuard();
  const file = state.items[fileId];

  const [draft, setDraft] = useState(file?.content ?? "");
  const dirty = file ? draft !== (file.content ?? "") : false;

  useEffect(() => {
    setDraft(file?.content ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  // Register this editor's unsaved-changes guard while it's mounted.
  useEffect(() => {
    setGuard(() => {
      if (!dirty) return true;
      return window.confirm(
        `"${file?.name ?? "This file"}" has unsaved changes. Discard them and continue?`,
      );
    });
    return () => setGuard(null);
  }, [dirty, file?.name, setGuard]);

  // Warn on a hard page refresh/close too, not just in-app navigation.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!file) return null;

  const save = () => updateContent(fileId, draft);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span>📄</span>
          <span className="text-sm font-medium text-white">{file.name}</span>
          {dirty && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              title="Unsaved changes"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={!dirty}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
          <button
            onClick={() => requestNavigation(() => closeFile())}
            className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-panel2 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            save();
          }
        }}
        spellCheck={false}
        className="flex-1 resize-none bg-canvas p-5 font-mono text-sm text-white outline-none"
        placeholder="Start typing..."
      />
      <div className="border-t border-border px-5 py-1.5 text-xs text-muted">
        {dirty
          ? "Unsaved changes -- Ctrl/Cmd+S or Save to keep them"
          : "All changes saved"}
      </div>
    </div>
  );
};

export default FileEditor;
