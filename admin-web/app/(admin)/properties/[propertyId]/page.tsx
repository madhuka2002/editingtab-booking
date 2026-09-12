"use client";

import { use, useCallback, useEffect, useState } from "react";

import { useOrganizationContext } from "@/components/organization-context";
import { PhysicalRoomForm } from "@/components/physical-room-form";
import { RoomTypeForm } from "@/components/room-type-form";
import { EmptyState, ErrorState, LoadingState, StatusBadge, UnsupportedState } from "@/components/states";
import { bookingApi } from "@/lib/booking-api";
import type { PhysicalRoom, Property, RoomType } from "@/lib/types";

export default function PropertyDetailsPage({params}:{params:Promise<{propertyId:string}>}){
  const {propertyId}=use(params);const {organizationId}=useOrganizationContext();const [property,setProperty]=useState<Property|null>(null);const [types,setTypes]=useState<RoomType[]>([]);const [rooms,setRooms]=useState<PhysicalRoom[]>([]);const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  const load=useCallback(async()=>{await Promise.resolve();if(!organizationId)return;setLoading(true);setError("");try{const [p,t,r]=await Promise.all([bookingApi.getProperty(propertyId),bookingApi.listRoomTypes(propertyId),bookingApi.listRooms(propertyId)]);setProperty(p);setTypes(t);setRooms(r);}catch(caught){setError(caught instanceof Error?caught.message:"Unable to load property");}finally{setLoading(false);}},[organizationId,propertyId]);
  useEffect(()=>{queueMicrotask(()=>void load());},[load]);
  if(!organizationId)return <div className="notice">Select an organization before viewing a property.</div>;
  if(loading)return <LoadingState label="Loading property…"/>;
  if(error)return <><h1>Property</h1><ErrorState message={error}/></>;
  if(!property)return <EmptyState>Property not found.</EmptyState>;
  return <div className="stack"><div className="page-heading"><div><h1>{property.name}</h1><p className="muted">{property.slug} · {property.timezone}</p></div><StatusBadge active={property.is_active}/></div><section className="card"><h2>Property information</h2><div className="grid two"><p><strong>Description</strong><br/>{property.description||"—"}</p><p><strong>Address</strong><br/>{[property.address_line_1,property.address_line_2,property.city,property.country_code].filter(Boolean).join(", ")||"—"}</p></div></section><section className="card"><h2>Create room type</h2><RoomTypeForm propertyId={propertyId} onCreated={(value)=>setTypes((current)=>[...current,value])}/></section><section className="card"><h2>Room types</h2>{types.length===0?<EmptyState>No room types found.</EmptyState>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Code</th><th>Adults</th><th>Children</th><th>Occupancy</th><th>Status</th></tr></thead><tbody>{types.map((item)=><tr key={item.id}><td>{item.name}</td><td>{item.code}</td><td>{item.max_adults}</td><td>{item.max_children}</td><td>{item.max_occupancy}</td><td><StatusBadge active={item.is_active}/></td></tr>)}</tbody></table></div>}</section><section className="card"><h2>Create physical room</h2><PhysicalRoomForm propertyId={propertyId} roomTypes={types} onCreated={(value)=>setRooms((current)=>[...current,value])}/></section><section className="card"><h2>Physical rooms</h2>{rooms.length===0?<EmptyState>No physical rooms found.</EmptyState>:<div className="table-wrap"><table><thead><tr><th>Room</th><th>Floor</th><th>Room type</th><th>Status</th></tr></thead><tbody>{rooms.map((item)=><tr key={item.id}><td>{item.room_number}</td><td>{item.floor||"—"}</td><td>{types.find((type)=>type.id===item.room_type_id)?.name||item.room_type_id}</td><td><StatusBadge active={item.is_active}/></td></tr>)}</tbody></table></div>}</section><UnsupportedState>Property, room-type, and room editing, activation/deactivation, and deletion are blocked because Booking has no corresponding endpoints.</UnsupportedState></div>;
}
