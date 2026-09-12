"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid email address"); return; }
    if (!password) { setError("Password is required"); return; }
    setLoading(true);
    try { await login(email.trim().toLowerCase(), password); router.replace("/dashboard"); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Login failed"); }
    finally { setLoading(false); }
  }
  return <form className="stack" onSubmit={submit} noValidate>
    {error && <div role="alert" className="error-banner">{error}</div>}
    <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
    <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
    <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
  </form>;
}

