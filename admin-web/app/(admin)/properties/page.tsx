"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PropertyForm } from "@/components/property-form";
import { useOrganizationContext } from "@/components/organization-context";
import { EmptyState, ErrorState, LoadingState, StatusBadge, UnsupportedState } from "@/components/states";
import { bookingApi } from "@/lib/booking-api";
import type { Property } from "@/lib/types";

export default function PropertiesPage(){
  const {organizationId}=useOrganizationContext();const [items,setItems]=useState<Property[]>([]);const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  const load=useCallback(async()=>{await Promise.resolve();if(!organizationId)return;setLoading(true);setError("");try{setItems(await bookingApi.listProperties());}catch(caught){setError(caught instanceof Error?caught.message:"Unable to load properties");}finally{setLoading(false);}},[organizationId]);
  useEffect(()=>{queueMicrotask(()=>void load());},[load]);
  if(!organizationId)return <><div className="page-heading"><h1>Properties</h1></div><div className="notice">Enter an organization UUID in the header to use the local Booking context.</div></>;
  return <div className="stack"><div className="page-heading"><div><h1>Properties</h1><p className="muted">Organization {organizationId}</p></div></div>{error&&<ErrorState message={error}/>}<section className="card"><h2>Create property</h2><PropertyForm onCreated={(value)=>setItems((current)=>[...current,value])}/></section><section className="card"><h2>Properties</h2>{loading?<LoadingState/>:items.length===0?<EmptyState>No properties found.</EmptyState>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Slug</th><th>Location</th><th>Status</th><th></th></tr></thead><tbody>{items.map((item)=><tr key={item.id}><td>{item.name}</td><td>{item.slug}</td><td>{item.city||"—"}</td><td><StatusBadge active={item.is_active}/></td><td><Link href={`/properties/${item.id}`}>View</Link></td></tr>)}</tbody></table></div>}</section><UnsupportedState>Property update, activation/deactivation, and deletion endpoints do not exist, so edit and destructive controls are disabled.</UnsupportedState></div>;
}
