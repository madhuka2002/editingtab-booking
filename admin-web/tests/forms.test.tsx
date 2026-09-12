import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const { api } = vi.hoisted(() => ({ api: { createProperty:vi.fn(), createRoomType:vi.fn(), createRoom:vi.fn() } }));
vi.mock("@/lib/booking-api", () => ({ bookingApi: api }));

import { PhysicalRoomForm } from "@/components/physical-room-form";
import { PropertyForm } from "@/components/property-form";
import { RoomTypeForm } from "@/components/room-type-form";

test("submits a valid property", async()=>{
  const onCreated=vi.fn();api.createProperty.mockResolvedValueOnce({id:"p1"});render(<PropertyForm onCreated={onCreated}/>);
  fireEvent.change(screen.getByLabelText("Name"),{target:{value:"Ocean View"}});fireEvent.change(screen.getByLabelText("Slug"),{target:{value:"ocean-view"}});fireEvent.click(screen.getByRole("button",{name:"Create property"}));
  await waitFor(()=>expect(api.createProperty).toHaveBeenCalled());expect(onCreated).toHaveBeenCalledWith({id:"p1"});
});

test("rejects an invalid room type capacity then submits valid data",async()=>{
  const onCreated=vi.fn();api.createRoomType.mockResolvedValueOnce({id:"rt1"});render(<RoomTypeForm propertyId="p1" onCreated={onCreated}/>);
  fireEvent.change(screen.getByLabelText("Name"),{target:{value:"Deluxe"}});fireEvent.change(screen.getByLabelText("Code"),{target:{value:"DLX"}});fireEvent.change(screen.getByLabelText("Max occupancy"),{target:{value:"3"}});fireEvent.click(screen.getByRole("button",{name:"Create room type"}));expect(screen.getByRole("alert")).toHaveTextContent("fit");
  fireEvent.change(screen.getByLabelText("Max children"),{target:{value:"1"}});fireEvent.click(screen.getByRole("button",{name:"Create room type"}));await waitFor(()=>expect(api.createRoomType).toHaveBeenCalledWith("p1",expect.objectContaining({code:"DLX",max_occupancy:3})));
});

test("requires a room type and submits a physical room",async()=>{
  const roomType={id:"rt1",name:"Deluxe",code:"DLX",organization_id:"o",property_id:"p1",description:null,max_adults:2,max_children:0,max_occupancy:2,is_active:true,created_at:"",updated_at:""};const onCreated=vi.fn();api.createRoom.mockResolvedValueOnce({id:"r1"});render(<PhysicalRoomForm propertyId="p1" roomTypes={[roomType]} onCreated={onCreated}/>);
  fireEvent.change(screen.getByLabelText("Room number / name"),{target:{value:"101"}});fireEvent.click(screen.getByRole("button",{name:"Create physical room"}));expect(screen.getByRole("alert")).toHaveTextContent("required");fireEvent.change(screen.getByLabelText("Room type"),{target:{value:"rt1"}});fireEvent.click(screen.getByRole("button",{name:"Create physical room"}));await waitFor(()=>expect(api.createRoom).toHaveBeenCalledWith("p1",expect.objectContaining({room_type_id:"rt1",room_number:"101"})));
});
