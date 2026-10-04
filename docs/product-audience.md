# Filtros Hombre / Mujer

Dimensión adicional e independiente de las diez categorías temáticas. Derivada por `src/lib/product-audience.ts`, sin modificar los registros comerciales ni las imágenes.

## Evidencia y cobertura

Solo se admite la palabra completa `hombre` o `mujer`, sin distinguir mayúsculas, en el nombre original. No se infiere por modelo, corte, fotografía ni estilo. No se inventa una categoría Unisex.

- Todos: 197 productos.
- Hombre: 90.
- Mujer: 79.
- Sin indicación: 28; permanecen en Todos (incluye Gato Cósmico original).

`node scripts/report-product-audience.mjs` genera JSON y CSV de los 197 IDs con nombre, clasificación y procedencia en `/opt/data/plur-audience/`. Comprueba unicidad, ambigüedad y SHA-256 de `drive-products.json` contra el fixture de integridad existente.

## Comportamiento

- Hombre/Mujer se combinan mediante intersección con el tema elegido.
- Cada fila tiene su propio Todos: borra solo esa dimensión; seleccionar un filtro limpia la búsqueda anterior.
- Las cantidades en los botones son del catálogo completo, no de la intersección. El encabezado del catálogo muestra los resultados actuales.
- Escribir en la búsqueda general limpia **ambas** dimensiones para no ocultar resultados; conserva normalización de acentos, foco y navegación con Enter.
- Limpiar búsqueda, Restablecer filtros y Restablecer catálogo (sin resultados) restauran los 197 productos.
- `aria-pressed`, agrupaciones etiquetadas y controles de al menos 44px identifican estados y facilitan el uso móvil.

## Verificación

`node scripts/test-audience-discovery.mjs`: RED observado antes de implementación (Hombre inexistente); GREEN verifica conjuntos exactos, las 20 intersecciones, casos vacíos Mujer/Bitcoin y Mujer/Música, resets, búsqueda y columnas 2/4 sin overflow. Admite `BASE_URL` y `EVIDENCE_DIR` para producción.

Regresiones: `npm run check`, taxonomía/fuente, descubrimiento de 197 productos y 180 tags, búsqueda prominente, columnas móviles, portada 05→04, galería y precios. Se conserva el diseño publicado, sin cambios en pagos ni envíos.
