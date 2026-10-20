"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginRequest } from "@/lib/api";

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginRequest(email, password);
  if (!result) return { error: "Invalid email or password" };

  const cookieStore = await cookies();
  cookieStore.set("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(result.user.role === "ADMIN" ? "/admin" : "/");
}