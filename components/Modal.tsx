"use client";

import { ConfirmModalProps, PromptModalProps } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";

// A small centered dialog that asks for a single text value (used for create + rename).

export const PromptModal = ({
  title,
  label,
  initialValue = "",
  confirmLabel = "Create",
  onCancel,
  onSubmit,
}: PromptModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const submit = () => {
    const err = onSubmit(value);
    if (err) setError(err);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-panel p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-semibold text-white">{title}</h2>
        <label className="mb-1 block text-xs text-muted">{label}</label>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onCancel();
          }}
          className="w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white outline-none focus:border-accent"
        />
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-panel2 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// A small centered dialog for yes/no confirmations (used for delete).

export const ConfirmModal = ({
  title,
  description,
  confirmLabel = "Delete",
  danger = true,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-panel p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-sm font-semibold text-white">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-panel2 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 ${
              danger ? "bg-red-500" : "bg-accent"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
