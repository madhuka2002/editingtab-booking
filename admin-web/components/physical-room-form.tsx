"use client";

import { FormEvent, useState } from "react";

import { bookingApi } from "@/lib/booking-api";
import type { PhysicalRoom, RoomType } from "@/lib/types";

export function PhysicalRoomForm({ propertyId, roomTypes, onCreated }: { propertyId:string; roomTypes:RoomType[]; onCreated:(value:PhysicalRoom)=>void }) {
  const [roomTypeId,setRoomTypeId]=useState(""); const [roomNumber,setRoomNumber]=useState(""); const [floor,setFloor]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(event:FormEvent){event.preventDefault();setError("");if(!roomTypeId||!roomNumber.trim()){setError("Room type and room number are required");return;}setLoading(true);try{const created=await bookingApi.createRoom(propertyId,{room_type_id:roomTypeId,room_number:roomNumber.trim(),floor:floor.trim()||null});onCreated(created);setRoomNumber("");setFloor("");}catch(caught){setError(caught instanceof Error?caught.message:"Unable to create room");}finally{setLoading(false);}}
  return <form className="form-grid" onSubmit={submit} noValidate>
    {error&&<div role="alert" className="error-banner field full">{error}</div>}
    <div className="field"><label htmlFor="physical-room-type">Room type</label><select id="physical-room-type" value={roomTypeId} onChange={(e)=>setRoomTypeId(e.target.value)} required><option value="">Select room type</option>{roomTypes.map((item)=><option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</select></div>
    <div className="field"><label htmlFor="room-number">Room number / name</label><input id="room-number" value={roomNumber} onChange={(e)=>setRoomNumber(e.target.value)} required/></div>
    <div className="field"><label htmlFor="floor">Floor</label><input id="floor" value={floor} onChange={(e)=>setFloor(e.target.value)}/></div>
    <div className="field"><span></span><button type="submit" disabled={loading||roomTypes.length===0}>{loading?"Creating…":"Create physical room"}</button></div>
    {roomTypes.length===0&&<p className="notice field full">Create a room type before adding physical rooms.</p>}
  </form>;
}

