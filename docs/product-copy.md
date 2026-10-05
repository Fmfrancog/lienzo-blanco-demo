# Descripciones visuales PLUR

197 descripciones únicas de 96–120 caracteres, vinculadas por ID inmutable en `src/data/product-copy.json`. El overlay reemplaza únicamente `description` y elimina las historias genéricas no sustentadas (`story: ""`); no cambia nombres, precios, tallas, orden, imágenes, categorías ni etiquetas. El modal omite citas vacías.

La revisión visual previa recorrió diez hojas de contacto (197 cubiertas) de `/opt/data/plur-taxonomy/` y tres ampliaciones de detalles ambiguos. Su ejecución está registrada en `/opt/data/cache/delegation/live/deleg_ef6c0a6c/task-0.log`. Al retomar se conservaron esos textos; se verificaron 197 correspondencias ID/texto, archivos de evidencia y hashes de cubierta. No se atribuye una segunda inspección individual completa a la reanudación.

Auditoría externa: `/opt/data/plur-descriptions/audit.json`, `audit.csv`, `checklist.json` y `checklist.md`. Incluyen antes/después, cubierta, SHA-256 y hoja de contacto por producto. El JSON de Drive permanece byte-identical, SHA-256 `0217f1b95a91996539a0795a9942db8883494982a26d3a25493152ea27a2a792`.

## Alcance SEO

Son descripciones visibles en tarjetas y detalles de producto. El sitio sigue siendo una sola página con modales: no se crearon 197 rutas ni 197 meta descriptions indexables independientes. La metadata global no cambia. Tampoco se añaden claims de materiales, calidad, licencia, disponibilidad o procedencia.

## Verificación reproducible

- `node scripts/test-product-copy.mjs`: cobertura y unicidad exactas, límites de longitud, integridad de la fuente, metadata comercial, galerías y clasificación.
- `npm run check`: lint, TypeScript y exportación estática.
- `EVIDENCE_DIR=/opt/data/plur-descriptions/local node scripts/test-taxonomy-discovery.mjs`: compara texto exacto en las 197 tarjetas y 197 modales; precios, tallas, cubiertas 05→04, galerías, filtros, búsqueda por etiquetas y layout 2/4 columnas.
- `node scripts/test-audience-discovery.mjs` y `node scripts/test-prominent-search.mjs`: audiencias, intersecciones, reinicio y búsqueda móvil.
- Repetir navegador con `BASE_URL=https://plur.com.mx` y directorios de evidencia live.

El harness transpila con `esModuleInterop` para que imports JSON default coincidan con el `require` real; no se retiraron aserciones para sortear el error de interoperabilidad.
