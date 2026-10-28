"use client";

import type { ReactNode } from "react";

export default function ConfirmSubmit({
  message,
  name,
  value,
  className,
  children,
}: {
  message: string;
  name: string;
  value: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}