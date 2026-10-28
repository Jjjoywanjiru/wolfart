"use client";

import Link from "next/link";
import { useActionState } from "react";
import PasswordInput from "@/components/PasswordInput";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>
      <form action={formAction} className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="border border-line rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <PasswordInput id="password" autoComplete="current-password" />
        </div>
        {state?.error && <p className="text-red-700">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-sm text-muted mt-4">
        New here?{" "}
        <Link href="/register" className="underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}