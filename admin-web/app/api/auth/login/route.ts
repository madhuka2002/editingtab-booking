import { NextRequest, NextResponse } from "next/server";

import { clearTokens, coreApiUrl, saveTokens, type CoreTokenResponse } from "@/lib/core-api";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  let loginResponse: Response;
  try {
    loginResponse = await fetch(coreApiUrl("/auth/login"), {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store",
    });
  } catch {
    return NextResponse.json({ detail: "Platform Core is unavailable" }, { status: 502 });
  }
  if (!loginResponse.ok) return new NextResponse(await loginResponse.text(), { status: loginResponse.status, headers: { "Content-Type": "application/json" } });
  const tokens = (await loginResponse.json()) as CoreTokenResponse;
  await saveTokens(tokens);
  const meResponse = await fetch(coreApiUrl("/auth/me"), {
    headers: { Authorization: `Bearer ${tokens.access_token}` }, cache: "no-store",
  });
  if (!meResponse.ok) {
    await clearTokens();
    return NextResponse.json({ detail: "Unable to load authenticated user" }, { status: 401 });
  }
  return new NextResponse(await meResponse.text(), { status: 200, headers: { "Content-Type": "application/json" } });
}
