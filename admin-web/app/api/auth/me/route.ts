import { NextResponse } from "next/server";

import { coreAuthenticatedFetch } from "@/lib/core-api";

export async function GET(): Promise<NextResponse> {
  try {
    const response = await coreAuthenticatedFetch("/auth/me");
    return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": "application/json" } });
  } catch {
    return NextResponse.json({ detail: "Platform Core is unavailable" }, { status: 502 });
  }
}
