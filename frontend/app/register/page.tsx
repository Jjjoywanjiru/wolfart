"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "./actions";

const inputClass = "border border-line rounded px-3 py-2";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined);

  return (
    <main className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
      <form action={formAction} className="flex flex-col gap-4 text-sm">
        <label className="flex flex-col gap-1">
          Name
          <input name="name" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          Email
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          Password (8+ characters)
          <input name="password" type="password" minLength={8} required className={inputClass} />
        </label>
        {state?.error && <p className="text-red-700">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="text-sm text-muted mt-4">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}