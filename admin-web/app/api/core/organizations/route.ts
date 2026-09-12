import { NextRequest, NextResponse } from "next/server";

import { coreAuthenticatedFetch } from "@/lib/core-api";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const response = await coreAuthenticatedFetch("/organizations", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: await request.text(),
    });
    return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": "application/json" } });
  } catch {
    return NextResponse.json({ detail: "Platform Core is unavailable" }, { status: 502 });
  }
}
