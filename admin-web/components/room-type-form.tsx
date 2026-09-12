"use client";

import { FormEvent, useState } from "react";

import { bookingApi } from "@/lib/booking-api";
import type { RoomType } from "@/lib/types";

export function RoomTypeForm({ propertyId, onCreated }: { propertyId: string; onCreated: (value: RoomType) => void }) {
  const [values, setValues] = useState({ name:"", code:"", description:"", max_adults:"2", max_children:"0", max_occupancy:"2" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const change = (name:string,value:string) => setValues((current)=>({...current,[name]:value}));
  async function submit(event:FormEvent) {
    event.preventDefault(); setError("");
    const adults=Number(values.max_adults), children=Number(values.max_children), occupancy=Number(values.max_occupancy);
    if (!values.name.trim() || !values.code.trim()) { setError("Name and code are required"); return; }
    if (![adults,children,occupancy].every(Number.isInteger) || Math.min(adults,children,occupancy)<0) { setError("Occupancy values must be non-negative whole numbers"); return; }
    if (occupancy < Math.max(adults,children) || occupancy > adults+children) { setError("Maximum occupancy must fit the adult and child capacities"); return; }
    setLoading(true);
    try { const created=await bookingApi.createRoomType(propertyId,{name:values.name.trim(),code:values.code.trim(),description:values.description.trim()||null,max_adults:adults,max_children:children,max_occupancy:occupancy}); onCreated(created); setValues({name:"",code:"",description:"",max_adults:"2",max_children:"0",max_occupancy:"2"}); }
    catch(caught){setError(caught instanceof Error?caught.message:"Unable to create room type");} finally{setLoading(false);}
  }
  return <form className="form-grid" onSubmit={submit} noValidate>
    {error&&<div role="alert" className="error-banner field full">{error}</div>}
    <div className="field"><label htmlFor="room-type-name">Name</label><input id="room-type-name" value={values.name} onChange={(e)=>change("name",e.target.value)} required/></div>
    <div className="field"><label htmlFor="room-type-code">Code</label><input id="room-type-code" value={values.code} onChange={(e)=>change("code",e.target.value)} required/></div>
    <div className="field full"><label htmlFor="room-type-description">Description</label><textarea id="room-type-description" value={values.description} onChange={(e)=>change("description",e.target.value)}/></div>
    <div className="field"><label htmlFor="max-adults">Max adults</label><input id="max-adults" type="number" min="0" value={values.max_adults} onChange={(e)=>change("max_adults",e.target.value)}/></div>
    <div className="field"><label htmlFor="max-children">Max children</label><input id="max-children" type="number" min="0" value={values.max_children} onChange={(e)=>change("max_children",e.target.value)}/></div>
    <div className="field"><label htmlFor="max-occupancy">Max occupancy</label><input id="max-occupancy" type="number" min="0" value={values.max_occupancy} onChange={(e)=>change("max_occupancy",e.target.value)}/></div>
    <div className="field"><span></span><button type="submit" disabled={loading}>{loading?"Creating…":"Create room type"}</button></div>
  </form>;
}

