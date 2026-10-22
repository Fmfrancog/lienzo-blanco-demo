"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

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
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.slice(1));
      if (url.searchParams.has("error") || hash.has("error")) {
        setError("No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
        for (const key of ["error", "error_code", "error_description"]) { url.searchParams.delete(key); hash.delete(key); }
        url.hash = hash.toString();
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
      const auth = authClient().auth;
      const { data: { subscription } } = auth.onAuthStateChange((_event, next) => {
        if (active) { setSession(next); setLoading(false); }
      });
      auth.getSession().then(({ data, error }) => {
        if (!active) return;
        setSession(data.session); setLoading(false);
        if (error) setError("No se pudo recuperar la sesión. Vuelve a iniciar sesión.");
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
