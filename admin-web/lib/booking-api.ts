"use client";

import type { PhysicalRoom, Property, RoomType } from "@/lib/types";
import { responseData } from "@/lib/types";

const ORGANIZATION_STORAGE_KEY = "editingtab_local_booking_organization_id";

/*
 * SECURITY WARNING — LOCAL DEVELOPMENT BRIDGE ONLY.
 * Booking currently accepts X-Organization-ID as temporary trusted context. All
 * tenant selection is centralized here and synchronized to a same-site Next.js
 * proxy cookie; the proxy alone adds that header. This is NOT production-ready
 * authorization. A production deployment must derive organization identity from
 * a verified Core-to-Booking token/contract, ignore browser-selected ownership,
 * and enforce membership/entitlement server-side.
 */
export async function setBookingOrganization(organizationId: string): Promise<void> {
  const response = await fetch("/api/context", {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ organization_id: organizationId }),
  });
  await responseData<{ organization_id: string }>(response);
  localStorage.setItem(ORGANIZATION_STORAGE_KEY, organizationId);
}

export function getStoredBookingOrganization(): string {
  return typeof window === "undefined" ? "" : localStorage.getItem(ORGANIZATION_STORAGE_KEY) ?? "";
}

async function bookingFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/booking${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (response.status === 401) window.dispatchEvent(new Event("editingtab:unauthorized"));
  return responseData<T>(response);
}

export const bookingApi = {
  listProperties: () => bookingFetch<Property[]>("/properties"),
  getProperty: (id: string) => bookingFetch<Property>(`/properties/${id}`),
  createProperty: (data: Record<string, unknown>) => bookingFetch<Property>("/properties", { method: "POST", body: JSON.stringify(data) }),
  listRoomTypes: (propertyId: string) => bookingFetch<RoomType[]>(`/properties/${propertyId}/room-types`),
  createRoomType: (propertyId: string, data: Record<string, unknown>) => bookingFetch<RoomType>(`/properties/${propertyId}/room-types`, { method: "POST", body: JSON.stringify(data) }),
  listRooms: (propertyId: string) => bookingFetch<PhysicalRoom[]>(`/properties/${propertyId}/rooms`),
  createRoom: (propertyId: string, data: Record<string, unknown>) => bookingFetch<PhysicalRoom>(`/properties/${propertyId}/rooms`, { method: "POST", body: JSON.stringify(data) }),
};
