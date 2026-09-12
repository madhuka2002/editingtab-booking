"use client";

import { FormEvent, useState } from "react";

import { bookingApi } from "@/lib/booking-api";
import type { Property } from "@/lib/types";

export function PropertyForm({ onCreated }: { onCreated: (property: Property) => void }) {
  const [values, setValues] = useState({ name:"", slug:"", description:"", address_line_1:"", address_line_2:"", city:"", country_code:"", timezone:"Asia/Colombo" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const change = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!values.name.trim() || !values.slug.trim() || !values.timezone.trim()) { setError("Name, slug, and timezone are required"); return; }
    if (values.country_code && !/^[a-z]{2}$/i.test(values.country_code)) { setError("Country code must contain exactly two letters"); return; }
    setLoading(true);
    try {
      const payload = Object.fromEntries(Object.entries(values).map(([key,value]) => [key, value.trim() || null]));
      const property = await bookingApi.createProperty(payload); onCreated(property);
      setValues({ name:"", slug:"", description:"", address_line_1:"", address_line_2:"", city:"", country_code:"", timezone:"Asia/Colombo" });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to create property"); }
    finally { setLoading(false); }
  }
  return <form className="form-grid" onSubmit={submit} noValidate>
    {error && <div role="alert" className="error-banner field full">{error}</div>}
    <div className="field"><label htmlFor="property-name">Name</label><input id="property-name" value={values.name} onChange={(e)=>change("name",e.target.value)} required /></div>
    <div className="field"><label htmlFor="property-slug">Slug</label><input id="property-slug" value={values.slug} onChange={(e)=>change("slug",e.target.value)} required /></div>
    <div className="field full"><label htmlFor="property-description">Description</label><textarea id="property-description" value={values.description} onChange={(e)=>change("description",e.target.value)} /></div>
    <div className="field"><label htmlFor="address-1">Address line 1</label><input id="address-1" value={values.address_line_1} onChange={(e)=>change("address_line_1",e.target.value)} /></div>
    <div className="field"><label htmlFor="address-2">Address line 2</label><input id="address-2" value={values.address_line_2} onChange={(e)=>change("address_line_2",e.target.value)} /></div>
    <div className="field"><label htmlFor="city">City</label><input id="city" value={values.city} onChange={(e)=>change("city",e.target.value)} /></div>
    <div className="field"><label htmlFor="country">Country code</label><input id="country" maxLength={2} value={values.country_code} onChange={(e)=>change("country_code",e.target.value)} /></div>
    <div className="field"><label htmlFor="timezone">IANA timezone</label><input id="timezone" value={values.timezone} onChange={(e)=>change("timezone",e.target.value)} required /></div>
    <div className="field"><span></span><button type="submit" disabled={loading}>{loading ? "Creating…" : "Create property"}</button></div>
  </form>;
}

