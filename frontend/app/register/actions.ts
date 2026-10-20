"use server";

import { redirect } from "next/navigation";
import { loginRequest, registerRequest } from "@/lib/api";
import { setSessionCookie } from "@/lib/session";

export async function register(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const created = await registerRequest(name, email, password);
  if (!created.ok) return { error: created.error };

  const result = await loginRequest(email, password);
  if (!result) redirect("/login");

  await setSessionCookie(result.token);
  redirect("/");
}