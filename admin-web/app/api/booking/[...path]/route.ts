import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { BOOKING_CONTEXT_COOKIE } from "@/lib/constants";
import { coreAuthenticatedFetch } from "@/lib/core-api";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  // Require a valid Core session even though Booking cannot yet validate that session itself.
  const sessionCheck = await coreAuthenticatedFetch("/auth/me");
  if (!sessionCheck.ok) return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  const organizationId = (await cookies()).get(BOOKING_CONTEXT_COOKIE)?.value;
  if (!organizationId) return NextResponse.json({ detail: "Select an organization before using Booking" }, { status: 400 });
  const { path } = await context.params;
  const base = (process.env.NEXT_PUBLIC_BOOKING_API_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");
  const upstream = `${base}/api/v1/${path.join("/")}${request.nextUrl.search}`;
  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers: { "Content-Type": request.headers.get("content-type") ?? "application/json", "X-Organization-ID": organizationId },
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
      cache: "no-store",
    });
    return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ detail: "Booking service is unavailable" }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
