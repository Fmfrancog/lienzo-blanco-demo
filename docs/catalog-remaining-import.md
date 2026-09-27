# Importación de carpetas pendientes

Se revisaron las 27 carpetas de incidencias mediante Drive autenticado de solo lectura. Se incorporan 24 productos y 99 imágenes disponibles, sin exigir cinco vistas. Tres carpetas siguen bloqueadas porque no contienen ni 04 ni 05.

## Numeración y nombres

Los nombres visibles se conservan exactamente de las carpetas. Las URL normalizan únicamente el nombre para usar slugs y la vista a dos dígitos; los huecos de numeración se conservan.

En Blanca Calavera Remolinos, Playera Blanca Bosque Calavera, Playera Blanca Calavera Luna y Playera Blanca Calavera Dj, la coincidencia exacta entre carpeta y prefijo permite identificar la vista como el primer número posterior al nombre. Los sufijos adicionales `-1` o `-2` antes de las dimensiones no son vistas nuevas. Se verificó visualmente que las cinco imágenes de cada carpeta muestran el mismo diseño. No se renumeran vistas; el inventario privado conserva cada nombre fuente y su mapeo.

La portada sigue siendo la vista 05, o 04 cuando falta 05. No se modifica `src/lib/product-cover.ts`.

## Bloqueados

- Playera Blanca de Santa Fuerte para Hombre: solo 01 y 02.
- Playera Blanca Hombre de Bitcoin: solo 01, 02 y 03.
- Playera Blanca para Hombre de Bitcoin Retro: solo 01.

Cada carpeta requiere al menos una imagen fuente identificable 04 o 05; no se inventan imágenes ni se reasignan números.

## Verificación

`docs/catalog-remaining-manifest.json` documenta las 24 galerías y sus secuencias exactas. `node scripts/test-remaining-catalog.mjs` exige 196 productos Drive (197 con Gato Cósmico), precios 199/299, tallas CH/M/G/EG, portadas correctas y 99 assets existentes. El test falló antes de importar (172 != 196).

`node scripts/test-drive-catalog.mjs` verifica todos los productos Drive en navegador, portada de tarjeta y modal, longitud variable de galería, última miniatura, precio/tallas/carrito y cada URL. Se ejecuta contra exportación local y sitio publicado. `npm run check` valida lint, TypeScript y build.

Evidencias completas, checklist individual de 27 carpetas, originales y conversiones: `/opt/data/plur-remaining/` (fuera del repositorio).
