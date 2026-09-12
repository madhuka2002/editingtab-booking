export type CurrentUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_super_admin: boolean;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
};

export type Property = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  country_code: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RoomType = {
  id: string;
  organization_id: string;
  property_id: string;
  name: string;
  code: string;
  description: string | null;
  max_adults: number;
  max_children: number;
  max_occupancy: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PhysicalRoom = {
  id: string;
  organization_id: string;
  property_id: string;
  room_type_id: string;
  room_number: string;
  floor: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

export async function responseData<T>(response: Response): Promise<T> {
  if (response.ok) return (await response.json()) as T;
  let body: { detail?: string | Array<{ loc?: string[]; msg?: string }> } = {};
  try { body = await response.json(); } catch { /* non-JSON upstream response */ }
  const message = Array.isArray(body.detail)
    ? body.detail.map((item) => `${item.loc?.at(-1) ?? "field"}: ${item.msg ?? "Invalid value"}`).join("; ")
    : body.detail ?? (response.status === 403 ? "Permission denied" : "Request failed");
  throw new ApiError(response.status, message, body.detail);
}

