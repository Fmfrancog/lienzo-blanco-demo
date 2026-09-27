# Importación Drive PLUR (preparada localmente, no publicada)

Fuente: carpeta Drive `1DLK4vd6S414tuHO1nHZpKzAgZUNXbs0z`.
Destino autorizado: https://plur.com.mx — repositorio `Fmfrancog/lienzo-blanco-demo`.

## Alcance

- Inventario paginado completo: 199 carpetas de diseños, 965 PNG y 10 archivos `desktop.ini` ignorados; 201 respuestas API, sin páginas pendientes.
- 172 diseños con cinco vistas inequívocas: 860 derivados WebP.
- 27 diseños excluidos: 23 con menos de cinco vistas y cuatro con sufijos numéricos ambiguos. No se han reconstruido nombres ni imágenes faltantes.
- Los 13 productos previamente existentes se conservan sin modificar sus registros. Total local esperado: 185.
- No se fusiona «Gato Cósmico» existente con «Playera Blanca para Hombre de Gato Cosmico»: sus imágenes muestran diseños diferentes.
- Cada nuevo producto: $199 MXN, precio anterior $299 MXN, tallas CH/M/G/EG, categoría técnica «Catálogo». Sin afirmaciones de material o inventario.
- El nombre conserva las letras y errores del stem original; se presenta con espacios en vez de guiones. Se eliminan la extensión, el marcador técnico de dimensiones `768x993` y la secuencia final 1–5. Sufijos extra como `-4-1-768x993` quedan pendientes de confirmación.
- Solo derivados WebP con orientación EXIF aplicada, sin escalar, sin metadatos EXIF y conservando transparencia. Ningún original maestro ni credencial entra en el repositorio.

## Verificación reproducible

```sh
npm run lint
npm run typecheck
npm run build -- --webpack
python3 -m http.server 3011 --bind 127.0.0.1 --directory out
# En otra terminal:
BASE_URL=http://127.0.0.1:3011 REPORT_DIR=/tmp/plur-verification node scripts/test-drive-catalog.mjs
```

El test recorre todos los productos importados: tarjeta única, nombre y portada, cinco miniaturas y última vista, ambos precios, tallas exactas, carrito con EG y total $199, retirada del carrito y HTTP 200 de cada imagen. También comprueba búsqueda, categoría y capturas desktop/móvil.

Se mantienen los tests anteriores de galería, precios y aceptación, que usan el puerto 3010.

## Bloqueos

La autenticación inicial faltaba. Se restableció mediante autorización del usuario en GitHub y se verificó permiso de escritura. La publicación del primer lote está autorizada; las 27 carpetas excluidas requieren corrección o confirmación antes de afirmar que todo Drive está publicado.

El informe de pruebas local final aprobó 172 productos, 860 URLs de imagen y cero errores de navegador. La prueba móvil filtra en escritorio antes de reducir el viewport, porque el buscador de la interfaz existente está oculto en móvil. Galería y controles de compra móviles están verificados; no se afirma que exista búsqueda móvil.

Informes privados de inventario, incidencias, checklist por producto, conversiones, TDD y capturas: `/opt/data/plur-import/`. No se incluyen en el repositorio los identificadores Drive de cada archivo ni los archivos fuente.

La tienda conserva su funcionamiento de demostración: esta importación no añade cobros, checkout real ni gestión de existencias.
