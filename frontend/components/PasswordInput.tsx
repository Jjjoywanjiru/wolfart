"use client";

import { useState } from "react";

export default function PasswordInput({
  id,
  name = "password",
  minLength,
  autoComplete,
}: {
  id?: string;
  name?: string;
  minLength?: number;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        className="w-full border border-line rounded px-3 py-2 pr-16"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}