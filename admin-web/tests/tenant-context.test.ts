import { getStoredBookingOrganization, setBookingOrganization } from "@/lib/booking-api";

test("centralizes local Booking organization context without emitting the trusted header", async () => {
  const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ organization_id: organizationId }), { status: 200 }));
  await setBookingOrganization(organizationId);
  expect(getStoredBookingOrganization()).toBe(organizationId);
  expect(fetchMock).toHaveBeenCalledWith("/api/context", expect.objectContaining({ method: "PUT", body: JSON.stringify({ organization_id: organizationId }) }));
  expect(JSON.stringify(fetchMock.mock.calls)).not.toContain("X-Organization-ID");
});

