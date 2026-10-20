"use server";

import { redirect } from "next/navigation";
import { loginRequest } from "@/lib/api";
import { setSessionCookie } from "@/lib/session";

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginRequest(email, password);
  if (!result) return { error: "Invalid email or password" };

  await setSessionCookie(result.token);
  redirect(result.user.role === "ADMIN" ? "/admin" : "/");
}