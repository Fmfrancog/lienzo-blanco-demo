"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "./AccountProvider";

type Order = { orderId: string; status: string; quantity: number; totalCents: number; createdAt: string; items: { id: string; name: string; size: string; quantity: number; unitPriceCents: number }[] };
const API = "https://plur-pagos.fmfrancog03.workers.dev/account";
function OrderHistory({ token }: { token: string }) {
  const [result, setResult] = useState<{ orders: Order[]; hasMore: boolean } | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const options = { cache: "no-store" as const, signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]) };
        const health = await fetch(API + "/health", options);
        const readiness = await health.json();
        if (!health.ok || readiness.version !== "accounts-v1" || readiness.ready !== true) throw new Error("El historial está temporalmente no disponible. Tu sesión de Google sigue activa.");
        const response = await fetch(API + "/orders", { ...options, headers: { Authorization: "Bearer " + token } });
        if (response.status === 401) throw new Error("Tu sesión no permite consultar el historial. Cierra sesión y vuelve a entrar.");
        if (!response.ok) throw new Error("No se pudo consultar el historial. Inténtalo de nuevo.");
        const data = await response.json();
        if (!Array.isArray(data.orders) || typeof data.hasMore !== "boolean") throw new Error("Respuesta de historial no válida.");
        if (!controller.signal.aborted) setResult(data);
      } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "El historial está temporalmente no disponible."); }
    }
    load();
    return () => controller.abort();
  }, [token, revision]);
  return <section aria-label="Historial de pedidos">
    <h3>Mis pedidos</h3>
    <p>Solo aparecen las compras vinculadas a esta cuenta al registrarlas. No asociamos pedidos anteriores por coincidencia de correo.</p>
    <p>Un pedido registrado no confirma el pago; PLUR verifica el pago antes del envío.</p>
    {error ? <p role="alert">{error}</p> : !result ? <p role="status">Cargando historial…</p> : <>
      {!result.orders.length && <p>Aún no tienes pedidos vinculados.</p>}
      {result.orders.map(order => <article key={order.orderId} className="cart-line"><div><strong>{order.orderId}</strong><p>{new Date(order.createdAt).toLocaleDateString("es-MX")} · {order.status === "paid" ? "Pago verificado" : order.status === "cancelled" ? "Cancelado" : order.status === "registered" ? "Registrado · pago pendiente de verificar" : order.status}</p><p>{order.quantity} playeras · ${(order.totalCents / 100).toFixed(2)} MXN</p><ul>{order.items.map((item, index) => <li key={`${item.id}-${item.size}-${index}`}>{item.name} · talla {item.size} · {item.quantity} × ${(item.unitPriceCents / 100).toFixed(2)} MXN</li>)}</ul></div></article>)}
      {result.hasMore && <p>Se muestran tus pedidos más recientes. Para consultar pedidos anteriores contacta a PLUR.</p>}
    </>}
    <button className="button button--line" onClick={() => { setResult(null); setError(""); setRevision(value => value + 1); }}>Actualizar historial</button>
  </section>;
}
export function AccountPanel() {
  const { session, loading, error, login, logout } = useAccount();
  return <div className="dialog-copy">
    {error && <p role="alert">{error}</p>}
    {loading && <p role="status">Consultando sesión…</p>}
    {session ? <><p>Sesión iniciada: {session.user.email || session.user.id}</p><button className="button button--line" disabled={loading} onClick={logout}>Cerrar sesión</button>{!loading && <OrderHistory key={session.user.id + session.access_token} token={session.access_token} />}</> : <><p>Inicia sesión para consultar tus compras vinculadas a esta cuenta.</p><button className="button button--dark button--wide" disabled={loading} onClick={login}>Continuar con Google</button><p>Usamos Google y Supabase para identificar tu cuenta y mantener tu sesión. Consulta el <Link href="/aviso-de-privacidad/">Aviso de privacidad</Link>. Iniciar sesión no te suscribe a publicidad.</p><small>Puedes seguir comprando como invitado. No solicitamos contraseña ni acceso a Gmail o Drive.</small></>}
  </div>;
}
