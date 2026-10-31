"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { authDiagnostic, clearAuthCallback } from "@/lib/auth-diagnostics";

// Share the SDK initialization result across React effect replays, not sessions.
let callbackInitialization: Promise<string> | undefined;
function initializeAccount() {
  if (!callbackInitialization) callbackInitialization = (async () => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.slice(1));
    const param = (key: string) => url.searchParams.get(key) || hash.get(key) || undefined;
    const hasError = ["error", "error_code", "error_description"].some(key => url.searchParams.has(key) || hash.has(key));
    const hasCode = !!param("code");
    let diagnostic = "";
    if (hasError) {
      diagnostic = authDiagnostic(param("error_code") || param("error"), param("error_description"));
      clearAuthCallback();
    }
    try {
      // initialize() reuses the constructor's promise: never exchange the code twice.
      const { error } = await authClient().auth.initialize();
      if (!diagnostic && error) diagnostic = authDiagnostic(error.code);
      // SDK skips PKCE detection without a verifier, returning no init error.
      if (!diagnostic && hasCode && new URL(window.location.href).searchParams.has("code")) {
        diagnostic = authDiagnostic("missing_verifier");
      }
      return diagnostic;
    } finally {
      if (hasCode || hasError) clearAuthCallback();
    }
  })();
  return callbackInitialization;
}

type Account = { session: Session | null; loading: boolean; error: string; login: () => Promise<void>; logout: () => Promise<void>; accessToken: () => Promise<string | null> };
const Context = createContext<Account | null>(null);
let client: SupabaseClient | undefined;
function authClient() {
  if (!client) client = createClient("https://zniawtkrdnbevyojewdi.supabase.co", "sb_publishable_oJjURxEmbAD_zkzxpEQl0w_vqpqqUbp", {
    auth: { flowType: "pkce", storage: window.sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    try {
      const initialization = initializeAccount();
      const auth = authClient().auth;
      const { data: { subscription } } = auth.onAuthStateChange((_event, next) => {
        if (active) { setSession(next); setLoading(false); }
      });
      initialization.then(async diagnostic => {
        const { data, error } = await auth.getSession();
        if (!active) return;
        setSession(data.session); setLoading(false);
        if (diagnostic) setError(diagnostic);
        else if (error) setError("No se pudo recuperar la sesión. Vuelve a iniciar sesión.");
      }).catch(() => { if (active) { setLoading(false); setError("No se pudo recuperar la sesión."); } });
      return () => { active = false; subscription.unsubscribe(); };
    } catch { setLoading(false); setError("Permite el almacenamiento de sesión para iniciar sesión con Google."); }
  }, []);
  async function login() {
    setError(""); setLoading(true);
    try {
      const { error } = await authClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/" } });
      if (error) throw error;
    } catch { setError("No se pudo iniciar sesión con Google. Inténtalo de nuevo."); setLoading(false); }
  }
  async function logout() {
    setLoading(true); setError("");
    try {
      const { error } = await authClient().auth.signOut({ scope: "local" });
      if (error) throw error;
      setSession(null);
    } catch { setError("No se pudo cerrar la sesión. Inténtalo de nuevo."); }
    finally { setLoading(false); }
  }
  async function accessToken() {
    const { data, error } = await authClient().auth.getSession();
    if (error) throw new Error("No se pudo validar la sesión. Vuelve a iniciar sesión antes de comprar.");
    if (session && !data.session) throw new Error("Tu sesión venció. Vuelve a iniciar sesión antes de comprar.");
    if ((session?.user.id ?? null) !== (data.session?.user.id ?? null)) throw new Error("La cuenta cambió. Recarga la página y revisa la sesión antes de comprar.");
    return data.session?.access_token ?? null;
  }
  return <Context.Provider value={{ session, loading, error, login, logout, accessToken }}>{children}</Context.Provider>;
}
export function useAccount() {
  const value = useContext(Context);
  if (!value) throw new Error("AccountProvider is required");
  return value;
}
