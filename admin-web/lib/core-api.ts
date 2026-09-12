import "server-only";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "editingtab_access_token";
const REFRESH_COOKIE = "editingtab_refresh_token";

export type CoreTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export function coreApiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://127.0.0.1:8000";
  return `${base.replace(/\/$/, "")}/api/v1${path}`;
}

export async function saveTokens(tokens: CoreTokenResponse): Promise<void> {
  const jar = await cookies();
  const options = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
  jar.set(ACCESS_COOKIE, tokens.access_token, { ...options, maxAge: tokens.expires_in });
  jar.set(REFRESH_COOKIE, tokens.refresh_token, { ...options, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearTokens(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

async function refreshAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;
  const response = await fetch(coreApiUrl("/auth/refresh"), {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }), cache: "no-store",
  });
  if (!response.ok) { await clearTokens(); return null; }
  const tokens = (await response.json()) as CoreTokenResponse;
  await saveTokens(tokens);
  return tokens.access_token;
}

export async function coreAuthenticatedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const jar = await cookies();
  let token = jar.get(ACCESS_COOKIE)?.value;
  if (!token) return new Response(JSON.stringify({ detail: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const request = () => fetch(coreApiUrl(path), {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  let response = await request();
  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) { token = refreshedToken; response = await request(); }
  }
  return response;
}

export { ACCESS_COOKIE, REFRESH_COOKIE };
