import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearTokens, coreApiUrl, REFRESH_COOKIE } from "@/lib/core-api";

export async function POST(): Promise<NextResponse> {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    await fetch(coreApiUrl("/auth/logout"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }), cache: "no-store",
    }).catch(() => undefined);
  }
  await clearTokens();
  return new NextResponse(null, { status: 204 });
}

