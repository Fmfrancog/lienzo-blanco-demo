"use client";

import { useRef, useState } from "react";

export type Receipt = { orderId: string; status: string; quantity: number; totalCents: number; paymentUrl?: string };

/** Render only the recovered server receipt, never mutable cart or return-URL data. */
export function OrderReceipt({ receipt, onNewOrder, onViewOrders }: {
  receipt: Receipt;
  onNewOrder: () => void;
  onViewOrders?: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const folio = useRef<HTMLTextAreaElement>(null);
  async function copyFolio() {
    try {
      await navigator.clipboard.writeText(receipt.orderId);
      setCopyStatus("Folio copiado.");
    } catch {
      folio.current?.focus();
      folio.current?.select();
      setCopyStatus("Selecciona y copia el folio con el menú de tu dispositivo o Ctrl/Cmd+C.");
    }
  }
  return <section className="order-receipt" data-testid="order-receipt" aria-label="Resumen del pedido registrado">
    <header><span className="kicker">TU PEDIDO EN PLUR</span><h3>{receipt.status === "paid" ? "Pago verificado por PLUR" : receipt.status === "cancelled" ? "Pedido cancelado" : "Pedido registrado"}</h3><p>{receipt.status === "registered" ? "Tus datos ya están guardados. Conserva este folio y tu comprobante de Mercado Pago." : receipt.status === "paid" ? "PLUR confirmó el pago de este pedido. Conserva tu folio para cualquier consulta." : "Este pedido está cancelado. Si realizaste un pago, contacta a PLUR con tu comprobante."}</p></header>
    <div className="receipt-folio"><label htmlFor="receipt-folio">Folio del pedido</label><textarea ref={folio} id="receipt-folio" rows={2} readOnly value={receipt.orderId} onFocus={e => e.currentTarget.select()} /><button type="button" className="button button--line" onClick={copyFolio}>Copiar folio</button><span className="receipt-copy-status" role="status" aria-live="polite" aria-atomic="true">{copyStatus}</span></div>
    <dl className="receipt-totals"><div><dt>Playeras registradas</dt><dd>{receipt.quantity}</dd></div><div><dt>Total del pedido · MXN</dt><dd>${(receipt.totalCents / 100).toFixed(2)}</dd></div></dl>
    {receipt.status === "registered" && <div className="receipt-payment"><p id="receipt-payment-warning"><strong>El registro no es una confirmación de pago.</strong> Si ya pagaste, no vuelvas a hacerlo. PLUR verificará el movimiento antes de preparar el envío.</p><a className="button button--coral button--wide" href={receipt.paymentUrl} aria-describedby="receipt-payment-warning" rel="noreferrer">Continuar al pago solo si aún no has pagado</a></div>}
    <div className="receipt-actions">{onViewOrders && <button type="button" className="button button--dark button--wide" onClick={onViewOrders}>Ver mis pedidos</button>}<button type="button" className="button button--line button--wide" onClick={onNewOrder}>Preparar un pedido diferente</button></div>
    <p className="receipt-help">¿Necesitas ayuda? <a href="mailto:atencion@plur.com.mx">atencion@plur.com.mx</a><br/>Incluye tu folio. No envíes datos de tarjeta.</p>
  </section>;
}
