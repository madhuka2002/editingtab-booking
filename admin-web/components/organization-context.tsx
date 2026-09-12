"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getStoredBookingOrganization, setBookingOrganization } from "@/lib/booking-api";

type OrganizationState = { organizationId: string; setOrganizationId: (value: string) => Promise<void> };
const Context = createContext<OrganizationState>({ organizationId: "", setOrganizationId: async () => undefined });

export function OrganizationContextProvider({ children }: { children: React.ReactNode }) {
  const [organizationId, setValue] = useState("");
  useEffect(() => { queueMicrotask(() => setValue(getStoredBookingOrganization())); }, []);
  async function setOrganizationId(value: string) { await setBookingOrganization(value.trim()); setValue(value.trim()); }
  return <Context.Provider value={{ organizationId, setOrganizationId }}>{children}</Context.Provider>;
}

export function useOrganizationContext() { return useContext(Context); }
