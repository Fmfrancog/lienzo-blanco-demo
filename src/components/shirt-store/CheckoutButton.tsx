"use client";

import { useState, type FormEvent } from "react";
import { paymentQuote } from "@/lib/payment-links";
import "./checkout.css";

export type CheckoutItem = { id: string; name: string; size: string; quantity: number };

export function CheckoutButton({ items }: { items: CheckoutItem[] }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const quote = paymentQuote(quantity);
  const contact = "fmfrancog03@gmail.com";
  const invalidate = () => { setSaved(false); setSent(false); };

  function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quote || !name.trim() || !address.trim()) return;
    setError("");
    try {
      const id = reference || `PLUR-${crypto.randomUUID()}`;
      const text = [
        "PLUR — RESUMEN DEL PEDIDO (NO ES COMPROBANTE DE PAGO)",
        `Referencia local: ${id}`, `Nombre: ${name.trim()}`,
        `Dirección de entrega: ${address.trim()}`, "",
        ...items.map(item => `${item.name} | Talla ${item.size} | Cantidad ${item.quantity} | $199 MXN c/u | ID ${item.id}`),
        "", `Productos: $${quote.subtotal} MXN`, `Envío: $${quote.shipping} MXN`, `Total: $${quote.total} MXN`,
        "", `Envía este archivo a ${contact} y confirma disponibilidad y entrega antes de pagar.`,
        "La tienda confirma manualmente el pedido y el pago. Este archivo no acredita un pago ni crea un pedido en un servidor.",
        "Conserva esta referencia y el comprobante de Mercado Pago para que la tienda pueda relacionarlos.",
      ].join("\n");
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${id}.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setReference(id);
      setSaved(true);
    } catch {
      setError("No se pudo preparar la descarga. Intenta de nuevo antes de pagar.");
      invalidate();
    }
  }

  if (!quote) return <div data-testid="checkout-limit"><p>Para más de 5 playeras necesitas atención de PLUR. No hay un enlace de pago automático para esta cantidad.</p><a href={`mailto:${contact}`}>Solicitar atención: {contact}</a><p>No dividas el pedido ni pagues un importe diferente sin confirmar con la tienda.</p></div>;

  return <div className="checkout-manual">
    <p><strong>1. Prepara y descarga tu pedido</strong></p>
    <p>Envío gratis a partir de 3 playeras. La descarga contiene tus diseños, tallas, cantidades y dirección. Tus datos no se guardan en un servidor de PLUR ni se envían al enlace de pago. Conserva el archivo en un lugar seguro; al cerrar este formulario tendrás que volver a capturar tus datos.</p>
    <form className="custom-form" onSubmit={download}>
      <label>Nombre completo<input autoComplete="name" required maxLength={120} value={name} onChange={event => { setName(event.target.value); invalidate(); }}/></label>
      <label>Dirección de entrega<textarea autoComplete="street-address" required minLength={15} maxLength={700} rows={4} placeholder="Calle, número, colonia, ciudad, estado y código postal de México" value={address} onChange={event => { setAddress(event.target.value); invalidate(); }}/></label>
      <button type="submit" className="button button--dark button--wide">Descargar resumen del pedido</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {saved && <div>
      <p><strong>2. Envía el resumen a PLUR antes de pagar</strong></p>
      <p>Revisa que el archivo se descargó. Abre tu correo, adjunta el archivo y envíalo a <strong>{contact}</strong>. Si no tienes una app de correo, usa tu correo web. Este botón solo abre un borrador: no adjunta ni envía nada automáticamente.</p>
      <a data-action="send-order" className="button button--dark button--wide" href={`mailto:${contact}?subject=${encodeURIComponent(`Pedido ${reference}`)}&body=${encodeURIComponent(`Adjunta el resumen ${reference}.txt antes de enviar. Quiero confirmar disponibilidad, tallas y entrega antes de pagar.`)}`}>Abrir correo para enviar pedido</a>
      <label className="checkout-confirm"><input type="checkbox" checked={sent} onChange={event => setSent(event.target.checked)}/>Ya envié el resumen del pedido a PLUR y confirmé disponibilidad y entrega con la tienda.</label>
      {sent && <a data-action="checkout" className="button button--coral button--wide" href={quote.href} target="_blank" rel="noopener noreferrer">Pagar ${quote.total} MXN en Mercado Pago</a>}
    </div>}
    <p data-testid="checkout-status"><strong>Confirmación manual.</strong> Abrir Mercado Pago o volver a PLUR no confirma un pago. PLUR no consulta el estado automáticamente. No pagues otra vez si ya lo hiciste; conserva tu resumen y el comprobante de Mercado Pago y comunícate con la tienda usando la misma referencia. La tienda debe verificar el pago antes de confirmar el pedido.</p>
  </div>;
}
