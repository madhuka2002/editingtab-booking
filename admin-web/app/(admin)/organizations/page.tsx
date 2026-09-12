"use client";

import { FormEvent, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { PermissionDenied, StatusBadge, UnsupportedState } from "@/components/states";
import { responseData, type Organization } from "@/lib/types";

export default function OrganizationsPage() {
  const { user }=useAuth(); const [name,setName]=useState(""); const [owner,setOwner]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [created,setCreated]=useState<Organization|null>(null);
  if (!user?.is_super_admin) return <><div className="page-heading"><h1>Organizations</h1></div><PermissionDenied /></>;
  async function submit(event:FormEvent){event.preventDefault();setError("");if(!name.trim()||!owner.trim()){setError("Organization name and owner user UUID are required");return;}setLoading(true);try{const response=await fetch("/api/core/organizations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name.trim(),owner_user_id:owner.trim()})});setCreated(await responseData<Organization>(response));setName("");setOwner("");}catch(caught){setError(caught instanceof Error?caught.message:"Unable to create organization");}finally{setLoading(false);}}
  return <div className="stack"><div className="page-heading"><div><h1>Organizations</h1><p className="muted">Platform Super Admin management</p></div></div><UnsupportedState>Core does not expose <code>GET /api/v1/organizations</code>, organization detail, or entitlement-read endpoints. Listing, durable detail views, and Booking entitlement status cannot be displayed yet.</UnsupportedState><section className="card"><h2>Create organization</h2><form className="form-grid" onSubmit={submit}>{error&&<div role="alert" className="error-banner field full">{error}</div>}<div className="field"><label htmlFor="organization-name">Name</label><input id="organization-name" value={name} onChange={(e)=>setName(e.target.value)} required/></div><div className="field"><label htmlFor="owner-id">Owner user UUID</label><input id="owner-id" value={owner} onChange={(e)=>setOwner(e.target.value)} required/></div><div className="field full"><button disabled={loading}>{loading?"Creating…":"Create organization"}</button></div></form></section>{created&&<section className="card"><h2>Organization created</h2><p><strong>{created.name}</strong> <StatusBadge active={created.is_active}/></p><p className="muted">ID: {created.id}<br/>Slug: {created.slug}</p><p className="notice">Booking is enabled during Core provisioning, but the current response does not expose entitlement status for independent verification.</p></section>}</div>;
}

