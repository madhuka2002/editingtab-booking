import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { BOOKING_CONTEXT_COOKIE } from "@/lib/constants";
import { coreAuthenticatedFetch } from "@/lib/core-api";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const sessionCheck = await coreAuthenticatedFetch("/auth/me");
    if (!sessionCheck.ok) return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  } catch {
    return NextResponse.json({ detail: "Platform Core is unavailable" }, { status: 502 });
  }
  const body = (await request.json()) as { organization_id?: string };
  if (!body.organization_id || !UUID_PATTERN.test(body.organization_id)) {
    return NextResponse.json({ detail: "A valid organization UUID is required" }, { status: 400 });
  }
  (await cookies()).set(BOOKING_CONTEXT_COOKIE, body.organization_id, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
  });
  return NextResponse.json({ organization_id: body.organization_id });
}
