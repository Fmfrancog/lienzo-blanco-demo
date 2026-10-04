# PLUR: clasificación temática del catálogo

## Alcance y criterio

Se revisaron individualmente los nombres y las portadas actuales de los **197 productos** (196 importados y Gato Cósmico), sin renombrarlos ni alterar precios, tallas, galerías, orden o selección de portada 05 → 04. La matriz auditable está en `src/data/product-taxonomy.json`; las matrices CSV/JSON, checklist individual y hojas de contacto se guardan en `/opt/data/plur-taxonomy/`.

El objetivo es reducir el esfuerzo de encontrar un diseño, no prometer ventas. Se sustituyó la agrupación técnica “Catálogo” por diez categorías temáticas. Cada producto tiene una sola categoría primaria; las etiquetas permiten encontrar motivos que cruzan categorías. Se priorizan Navidad/fiestas cuando el diseño es festivo, referencias simbólicas expresas cuando son el tema y, en los demás casos, el motivo central. Por ejemplo, un gato cósmico está en Animales y puede encontrarse por sus motivos espaciales; las calaveras con hongos permanecen en Calaveras y se encuentran buscando hongos.

## Distribución revisada

| Categoría | Productos |
|---|---:|
| Calaveras | 48 |
| Navidad y fiestas | 34 |
| Raíces y símbolos | 29 |
| Aliens y espacio | 28 |
| Arte y frases | 19 |
| Animales | 15 |
| Música | 8 |
| Naturaleza y hongos | 7 |
| Deportes | 5 |
| Bitcoin | 4 |
| **Total** | **197** |

La matriz contiene **598 asignaciones de etiquetas**, de tres a cuatro por producto en esta revisión. No se añadió una quinta etiqueta para llenar espacio. Dos etiquetas se muestran en cada tarjeta; la ficha muestra todas. Los filtros tienen conteos calculados desde los productos, no números escritos a mano. Elegir una categoría limpia la consulta anterior para que su conteo sea inequívoco; escribir una búsqueda vuelve a todo el catálogo. Se mantienen foco al escribir, normalización de acentos, Enter, botón de búsqueda y limpiar.

## Evidencia y límites

- `evidence.name`: nombre original exacto, sin corregir grafías ni sufijos.
- `evidence.photo`: URL de la portada que ya utilizaba el catálogo.
- `evidence.contactSheet`: lote inspeccionado; 10 hojas cubren todos los productos y cuatro ampliaciones revisan 16 casos.
- `evidence.observation`: observación visual específica del diseño.
- `tagEvidence`: procedencia de cada etiqueta (`nombre`, `foto`, `nombre y foto`). Una referencia cultural, artística o musical tomada del nombre no acredita autenticidad, autoría, origen artesanal o licencia.
- `confidence`: alta o media; media para discrepancias o detalles menos concluyentes. No es una probabilidad estadística.
- `reviewed`: revisión individual realizada; checklist adicional de 197 filas.

No se infieren materiales, calidad, género, medidas, licencias, inventario, popularidad ni urgencia. Los colores se refieren a la gráfica, no a variantes disponibles. Los nombres que incluyen Hombre/Mujer se conservan, pero no se convierten en segmentación inferida de las fotografías. Tampoco se añadieron categorías de marcas oficiales.

Casos resueltos con ampliaciones: `Playera Blanca Tocando` muestra un esqueleto con batería y murciélagos; se clasifica en Música. `CHE FC` se trata como retrato y tipografía, no como equipo deportivo. `Diamantes en el Cielo` muestra ojo, flores y psicodelia, no joyería. `Arte de Edicion Limitada` conserva su nombre original y la frase impresa en la foto, pero **no** recibe una etiqueta promocional “edición limitada”. `Calavera Hongos` muestra hojas de cannabis; el nombre se conserva y la discrepancia queda documentada con confianza media.

## Conservación y verificación

Los datos de origen `drive-products.json` permanecen byte a byte intactos; una prueba SHA-256 fija el original y una fixture conserva Gato Cósmico. No se reintroducen productos de demostración. El carrito continúa siendo simulado, sin pagos reales.

TDD: `test-product-taxonomy.mjs` falló al faltar la matriz y luego pasó. `test-taxonomy-discovery.mjs` falló al encontrar solo tres filtros en lugar de once; verifica conjuntos exactos por filtro, etiquetas en tarjetas/fichas, búsquedas por todas las etiquetas, 197 precios/portadas/tallas/galerías y vistas responsivas. Se mantienen las suites previas de importación, ausencia de demos, galerías, precios, diseño PLUR y buscador prominente. La expectativa obsoleta del filtro técnico Catálogo se reemplaza por comparación exacta con la matriz, no por una aserción más débil.

La publicación solo se da por completa tras `npm run check`, suites locales, revisión visual móvil/escritorio, GitHub Actions exitoso y repetición en `https://plur.com.mx`.
