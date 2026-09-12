"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { logout } from "@/lib/auth";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { OrganizationContextProvider, useOrganizationContext } from "@/components/organization-context";

const links = [["Dashboard","/dashboard"],["Organizations","/organizations"],["Properties","/properties"],["Room Types","/room-types"],["Rooms","/rooms"],["Users","/users"],["Roles","/roles"]];

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { organizationId, setOrganizationId } = useOrganizationContext();
  const [draft, setDraft] = useState(organizationId);
  const [message, setMessage] = useState("");
  useEffect(() => { queueMicrotask(() => setDraft(organizationId)); }, [organizationId]);
  async function save(event: FormEvent) {
    event.preventDefault(); setMessage("");
    try { await setOrganizationId(draft); setMessage("Context set"); } catch (error) { setMessage(error instanceof Error ? error.message : "Invalid organization"); }
  }
  return <div className="admin-grid">
    <aside className="sidebar"><p className="brand">EditingTab Admin</p><nav>{links.map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav></aside>
    <div className="admin-main">
      <header className="topbar">
        <form className="context-field" onSubmit={save}><label htmlFor="organization-context">Booking organization</label><input id="organization-context" placeholder="Organization UUID" value={draft} onChange={(e) => setDraft(e.target.value)} required/><button type="submit">Use</button>{message && <small>{message}</small>}</form>
        <div className="topbar-actions"><span>{user?.email}</span><button className="secondary" onClick={() => void logout().finally(() => router.replace("/login"))}>Logout</button></div>
      </header>
      <main className="content">{children}</main>
    </div>
  </div>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <AuthProvider><OrganizationContextProvider><Shell>{children}</Shell></OrganizationContextProvider></AuthProvider>;
}
