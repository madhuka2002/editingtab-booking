"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { ApiError, type CurrentUser } from "@/lib/types";

type AuthState = { user: CurrentUser | null; loading: boolean; error: string | null };
const AuthContext = createContext<AuthState>({ user: null, loading: true, error: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });
  useEffect(() => {
    const unauthorized = () => router.replace("/login");
    window.addEventListener("editingtab:unauthorized", unauthorized);
    getCurrentUser()
      .then((user) => setState({ user, loading: false, error: null }))
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) { router.replace("/login"); return; }
        setState({ user: null, loading: false, error: error instanceof Error ? error.message : "Unable to verify session" });
      });
    return () => window.removeEventListener("editingtab:unauthorized", unauthorized);
  }, [router]);
  if (state.loading) return <main className="center-card"><p>Checking your session…</p></main>;
  if (state.error) return <main className="center-card"><div className="error-banner">{state.error}</div></main>;
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
