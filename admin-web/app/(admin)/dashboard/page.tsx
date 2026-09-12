"use client";

import { useAuth } from "@/components/auth-provider";
import { useOrganizationContext } from "@/components/organization-context";

export default function DashboardPage() {
  const { user } = useAuth(); const { organizationId } = useOrganizationContext();
  return <div className="stack"><div className="page-heading"><div><h1>Dashboard</h1><p className="muted">Booking administration foundation</p></div></div><div className="grid three"><section className="card"><h2>Signed in as</h2><p>{user?.first_name || user?.email}</p><span className={`status ${user?.is_super_admin?"active":"inactive"}`}>{user?.is_super_admin?"Platform Super Admin":"Organization user"}</span></section><section className="card"><h2>Booking context</h2><p className="muted">{organizationId||"No organization selected"}</p></section><section className="card"><h2>Available module</h2><p className="metric">Booking</p><p className="muted">Properties, room types, and rooms</p></section></div></div>;
}

