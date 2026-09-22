# Convención para cargar productos reales en PLUR

Cada diseño debe entregarse en una carpeta independiente. El nombre de la carpeta será el identificador del producto: minúsculas, sin espacios ni acentos y separado con guiones.

## Estructura requerida

```text
catalogo/
└── gato-cosmico/
    ├── 01.jpg
    ├── 02.jpg
    ├── 03.jpg
    ├── 04.jpg
    └── 05.jpg
```

Las cinco imágenes deben numerarse exactamente del `01` al `05`. Pueden recibirse como JPG, PNG o WebP. Durante la incorporación se convierten a WebP optimizado y se publican en:

```text
public/catalogo/gato-cosmico/01.webp
public/catalogo/gato-cosmico/02.webp
public/catalogo/gato-cosmico/03.webp
public/catalogo/gato-cosmico/04.webp
public/catalogo/gato-cosmico/05.webp
```

## Orden sugerido de las imágenes

1. `01`: imagen principal para la tarjeta del catálogo.
2. `02`: vista limpia o mockup frontal.
3. `03`: segunda fotografía con modelo.
4. `04`: tercera fotografía o variación de ajuste.
5. `05`: fotografía complementaria o detalle.

## Datos que deben acompañar cada carpeta

- Nombre del producto.
- Precio en MXN.
- Descripción corta.
- Historia o concepto del diseño.
- Categoría o colección.
- Tallas disponibles.
- Inventario o disponibilidad.
- Indicador de producto destacado.

Si estos datos no se proporcionan, cualquier nombre, descripción, precio o categoría utilizado para montar la vista será provisional y deberá confirmarse antes de convertir el prototipo en una tienda real.

## Ejemplo en el catálogo

```ts
{
  id: "gato-cosmico",
  name: "Gato Cósmico",
  collection: "Cósmico",
  price: 199,
  compareAtPrice: 299,
  sizes: ["CH", "M", "G", "EG"],
  description: "Playera blanca con gráfica felina en azul, magenta y negro.",
  story: "Un visitante felino cruza una órbita de color para observar el mundo desde otra frecuencia.",
  images: [
    "/catalogo/gato-cosmico/01.webp",
    "/catalogo/gato-cosmico/02.webp",
    "/catalogo/gato-cosmico/03.webp",
    "/catalogo/gato-cosmico/04.webp",
    "/catalogo/gato-cosmico/05.webp",
  ],
}
```
