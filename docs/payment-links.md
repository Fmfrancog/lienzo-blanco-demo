# PLUR — checkout manual con Links de pago

El storefront estático usa los cinco Links autorizados, sin llamar al Worker ni modificar Cloudflare, D1 o secretos.

| Playeras | Productos MXN | Envío MXN | Total MXN | Link |
|---|---:|---:|---:|---|
| 1 | 199 | 199 | 398 | https://mpago.la/2xwcTmy |
| 2 | 398 | 199 | 597 | https://mpago.la/2SpociY |
| 3 | 597 | 0 | 597 | https://mpago.la/1tGZvcR |
| 4 | 796 | 0 | 796 | https://mpago.la/2BeYgHo |
| 5 | 995 | 0 | 995 | https://mpago.la/26aMKHf |

Promoción: **Envío gratis a partir de 3 playeras**. Más de cinco no muestra un Link: solicita atención por correo.

## Entrega del pedido

1. El cliente captura nombre y dirección y descarga un TXT con referencia local, diseños, IDs, tallas, cantidades, productos, envío y total.
2. Abre el borrador de correo a `fmfrancog03@gmail.com`, **adjunta manualmente** el TXT y envía. Si no tiene cliente de correo, usa su correo web y la dirección visible. El sitio anterior tenía únicamente contacto demo; el correo fue indicado como autorizado en la instrucción de coordinación. No se ha probado recepción de un correo comercial ni enviado correo de prueba.
3. Confirma con la tienda disponibilidad y entrega. Marca que ya envió el resumen y confirmó esos datos para mostrar el Link correspondiente.
4. Paga en Mercado Pago, en otra pestaña. El sitio nunca declara pagado al retorno. La tienda relaciona manualmente el resumen y su referencia con el comprobante del cliente y verifica el pago en Mercado Pago antes de confirmar.

**Límites explícitos:** no hay persistencia de pedidos en servidor, envío automático, adjunto automático, conciliación automática ni comprobación de la declaración del cliente. El navegador prepara una descarga pero no puede garantizar que el usuario guardó el archivo. Los datos se mantienen en el formulario mientras está abierto; el archivo descargado es la copia durable del cliente. Cambiar carrito o datos invalida la habilitación del Link. No se envía dirección en URL de Mercado Pago ni en el borrador mailto (solo referencia e instrucciones).

## Verificación

- `node scripts/test-payment-links.mjs`: cantidades 1–5, URLs exactas, totales, inválidos/>5 y precio unitario del catálogo.
- `node scripts/test-mercadopago-cart.mjs`: checkout móvil/escritorio, archivo descargado, datos, mailto, gate manual, envío y total, bloqueo >5, ausencia de llamadas Worker. Nunca pulsa el Link ni realiza cobros.
- `BASE_URL=https://plur.com.mx EVIDENCE_DIR=/opt/data/plur-links-evidence/live node scripts/test-mercadopago-cart.mjs`: misma prueba live sin pagar.
- `npm run lint`, `npm run typecheck`, `npm run build -- --webpack`.
- Regresiones de descripciones, clasificación, portadas, catálogo sin demos, dos columnas móviles, buscador, galería y aceptación general.

Los cinco Links se verificaron alcanzables mediante HTTP en la coordinación; HTTP 200 no valida importes de la página de pago ni prueba un cobro.
