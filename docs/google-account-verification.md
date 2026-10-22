# Cuenta Google y compras PLUR

## Implementación

- Supabase OAuth Google, PKCE; callback en `/` compatible con exportación estática. Clave publishable pública, sin secretos de servidor.
- Sesión en sessionStorage de la pestaña, cierre local; historial solicitado con Bearer y `cache: no-store`, cancelado y desmontado al cambiar identidad/token o cerrar sesión.
- Checkout opcional como invitado. Con sesión, POST `/link-orders` incorpora Bearer sin sustituir `X-Order-Token` ni `Idempotency-Key`. La identidad integra la huella del intento; se conservan las huellas anteriores para invitados. No se reintenta silenciosamente como invitado si falla la sesión.
- Recuperación local no muestra ni consulta recibos de otra cuenta. No se borran intentos pendientes automáticamente para evitar duplicados.
- El carrito guarda solamente IDs, tallas y cantidades en sessionStorage; rehidrata productos/precios desde el catálogo, no desde almacenamiento del usuario.
- Aviso de privacidad, cookies y términos actualizados. Registro no equivale a pago; verificación de pago manual sin cambios.

## Verificación reproducible

Servir `out/` en `127.0.0.1:3044` después de `npm run build -- --webpack`.

```
npm run lint
npm run typecheck
npm run build -- --webpack
node scripts/test-account.mjs
node scripts/test-account-session.mjs
node scripts/test-account-callback.mjs
node scripts/test-account-checkout.mjs
node scripts/test-account-isolation.mjs
node scripts/test-account-ui.mjs
node scripts/test-auto-order.mjs
node scripts/test-payment-links.mjs
node scripts/test-cart-navigation.mjs
node scripts/test-info-pages.mjs
```

Las pruebas de autenticación/checkout interceptan explícitamente los servicios y usan identidades sintéticas de prueba: no acreditan un inicio de sesión real con Google ni crean pedidos/cargos. Cubren PKCE, cancelación OAuth, carrito tras recarga, historial privado, logout, respuesta tardía, protección entre cuentas, Bearer, invitado, reintentos antiguos e identidad cambiada antes de enviar.

`test-account-ui.mjs` verifica escritorio/móvil, catálogo completo, precio/total, ausencia de errores de consola y capturas. En localhost intercepta solo health porque producción no permite ese origen. Con `BASE_URL=https://plur.com.mx` no intercepta nada; no envía formularios ni inicia pagos.

## Límites explícitos

- Para verificar el recorrido Google completo hace falta que el usuario inicie sesión personalmente. Nunca se suplanta ese consentimiento ni se declara éxito basándose en mocks.
- `test-drive-catalog.mjs` heredado falla por selector ambiguo `.cart-total strong` (ahora hay productos, envío y total); no es una regresión de OAuth. La prueba UI nueva cuenta el catálogo completo y consulta el total por test ID.
- El build local con Node 26 emite advertencia DEP0205 desde webpack/Next; CI utiliza Node 24.
- Revisar la aplicación con una cuenta real no requiere generar una compra. No crear pedidos de prueba en producción.
