"use client";

import { SearchBarProps } from "@/lib/types";
import React from "react";

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-xs">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        🔎
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the whole workspace..."
        className="w-full rounded-lg border border-border bg-panel2 py-2 pl-9 pr-8 text-sm text-white outline-none focus:border-accent"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
