"use client";

import type { CurrentUser } from "@/lib/types";
import { responseData } from "@/lib/types";

export async function login(email: string, password: string): Promise<CurrentUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return responseData<CurrentUser>(response);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return responseData<CurrentUser>(await fetch("/api/auth/me", { cache: "no-store" }));
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
