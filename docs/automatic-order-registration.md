# Registro automático PLUR — preparado, pendiente de Cloudflare

Frontend listo para usar /link-orders del Worker. NO publicar este commit hasta instalar backend, tablas y ENABLE_LINK_ORDERS=true y comprobar /link-orders/health version link-orders-v1 ready true. Después verificar un registro identificado como prueba SIN pagar, comprobarlo en D1 y publicar/validar navegador live. No sustituir verificación real por health.

Backend y guía: /opt/data/plur-payments/INSTALAR-REGISTRO.txt. Paquete: /opt/data/plur-auto-order-delivery/PLUR-registro-automatico.zip.

Mantiene enlaces exactos por cantidad; guarda en D1 diseños/nombres/tallas/unidades y nombre/correo/teléfono/dirección antes del enlace. El servidor valida precio y tallas. LocalStorage solo referencia/token/hash de intento, sin contacto/dirección. Lectura protegida retorna solo estado e importe. No usa API Mercado Pago, no resuelve webhook viejo, no envío automático email ni compra de guías. Revisión de pagos manual; recepción del pedido automática.

Pruebas: npm run lint, npm run typecheck, npm run build -- --webpack; scripts/test-auto-order.mjs (backend simulado); backend scripts/link-order-browser.mjs (D1+workerd real local con proveedor interceptado). Respuesta perdida tras insert + retry = una fila, no abre pago antes de confirmar guardado, retorno conserva folio sin pagar otra vez. scripts/test-cart-navigation.mjs sigue pasando.

Bloqueo confirmado: npx wrangler whoami -> You are not authenticated. Requiere instalación del usuario en Cloudflare. GitHub sí autorizado pero deliberadamente no publicado para evitar pagos sin registro operativo.
