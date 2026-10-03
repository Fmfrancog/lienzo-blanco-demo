import driveCatalog from "./drive-products.json";

export type Collection = "Todos" | "Naturaleza" | "Cósmico" | "Tipográfico" | "Abstracto" | "Catálogo";

export type Product = {
  id: string;
  name: string;
  collection: Exclude<Collection, "Todos">;
  price: number;
  compareAtPrice?: number;
  sizes?: readonly string[];
  description: string;
  story: string;
  images?: readonly string[];
  art?: { kind: "sun" | "orbit" | "wave" | "flora" | "type" | "grid" | "eye" | "mountain" | "alien" | "hand" | "moon" | "fruit"; ink: string; accent: string };
};

export const storeContent = {
  brand: {
    name: "PLUR",
    mark: "PLUR",
    tagline: "Una camiseta blanca. Infinitas formas de decir algo.",
    description: "Catálogo fotográfico. El carrito es local y no procesa pagos; consulta disponibilidad antes de comprar.",
  },
  demoNotice: "CATÁLOGO FOTOGRÁFICO · SIN PAGOS REALES",
  announcements: [
    "Explora los diseños · encuentra el tuyo",
    "Catálogo fotográfico: CH · M · G · EG · consulta disponibilidad",
  ],
  navigation: ["Catálogo", "Colecciones", "Personaliza", "Nosotros", "Ayuda"],
  hero: {
    eyebrow: "PLUR / PLAYERAS CON DISEÑO",
    title: "No pases desapercibido.",
    body: "Gráficas que hablan por ti. Explora el catálogo, mira cada detalle y encuentra tu próxima playera.",
    primary: "Explorar diseños",
    secondary: "Cómo funciona",
  },
  categories: ["Todos", "Catálogo", "Cósmico"] as Collection[],
  collections: [
    { name: "Todos los diseños", filter: "Todos" as Collection, number: "01", description: "Tu siguiente playera empieza aquí." },
    { name: "Catálogo fotográfico", filter: "Catálogo" as Collection, number: "02", description: "Explora las fotos de cada diseño." },
    { name: "Gato Cósmico", filter: "Cósmico" as Collection, number: "03", description: "Una mirada a Gato Cósmico." },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  products: [
    { id: "gato-cosmico", name: "Gato Cósmico", collection: "Cósmico", price: 199, compareAtPrice: 299, sizes: ["CH", "M", "G", "EG"], description: "Playera blanca con gráfica felina en azul, magenta y negro.", story: "Un visitante felino cruza una órbita de color para observar el mundo desde otra frecuencia.", images: ["/catalogo/gato-cosmico/01.webp", "/catalogo/gato-cosmico/02.webp", "/catalogo/gato-cosmico/03.webp", "/catalogo/gato-cosmico/04.webp", "/catalogo/gato-cosmico/05.webp"] },
    ...driveCatalog.map((product): Product => ({ ...product, collection: "Catálogo" })),
  ] satisfies Product[],
  customizer: {
    eyebrow: "ESTUDIO ABIERTO",
    title: "Hazla únicamente tuya.",
    body: "Elige una frase, un color de tinta y una ubicación. Esta simulación prepara tu concepto sin procesar archivos ni pagos.",
    prompts: ["Una frase breve", "Un símbolo", "Una fecha importante"],
  },
  about: {
    eyebrow: "ACERCA DE PLUR",
    title: "El diseño es tuyo. La elección, también.",
    paragraphs: [
      "PLUR reúne este catálogo de playeras para que explores sus gráficas, fotografías y tallas en un solo lugar.",
      "Puedes probar la bolsa de compras, pero todavía no se generan pedidos ni se procesan pagos. Confirma disponibilidad y medidas antes de comprar.",
    ],
    facts: ["Catálogo fotográfico", "Tallas indicadas por producto", "0 transacciones reales"],
  },
  shipping: "Envíos aún no habilitados. Costos y tiempos por confirmar.",
  returns: "Las condiciones de devolución están por confirmar. No se generan guías ni reembolsos reales.",
  faq: [
    { question: "¿Estas camisetas existen?", answer: "La categoría Catálogo contiene fotografías del catálogo proporcionado. Las existencias no están conectadas y deben confirmarse; el carrito no realiza pedidos reales." },
    { question: "¿Puedo pagar?", answer: "No. El carrito es una simulación local y nunca solicita datos bancarios." },
    { question: "¿Cómo elijo talla?", answer: "Elige entre las tallas indicadas en cada producto. El catálogo fotográfico ofrece CH, M, G y EG; confirma medidas y disponibilidad antes de comprar." },
  ],
  account: { title: "Cuenta de demostración", body: "Aquí vivirían tus favoritos, pedidos y direcciones. No se crea ninguna cuenta real.", action: "Simular acceso" },
  footer: {
    columns: [
      { title: "Explora", links: ["Catálogo", "Colecciones", "Personaliza"] },
      { title: "Información", links: ["Envíos", "Devoluciones", "Preguntas frecuentes"] },
      { title: "Marca", links: ["Nosotros", "Proceso", "Contacto demo"] },
    ],
    legal: "© 2026 PLUR. Catálogo fotográfico; carrito de demostración sin pagos reales.",
  },
};

export const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price);
