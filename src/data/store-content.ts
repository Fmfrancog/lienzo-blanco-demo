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
    name: "Lienzo Blanco",
    mark: "LB/01",
    tagline: "Una camiseta blanca. Infinitas formas de decir algo.",
    description: "Catálogo fotográfico. El carrito es local y no procesa pagos; consulta disponibilidad antes de comprar.",
  },
  demoNotice: "CATÁLOGO FOTOGRÁFICO · SIN PAGOS REALES",
  announcements: [
    "Envío de demostración incluido desde $900 MXN",
    "Catálogo fotográfico: CH · M · G · EG · consulta disponibilidad",
  ],
  navigation: ["Catálogo", "Colecciones", "Personaliza", "Nosotros", "Ayuda"],
  hero: {
    eyebrow: "EDICIÓN 01 — EL BLANCO COMO PUNTO DE PARTIDA",
    title: "Tu idea, sobre blanco.",
    body: "Gráficas originales para una sola prenda esencial. Explora, elige tu talla o construye una versión propia.",
    primary: "Explorar diseños",
    secondary: "Crear la mía",
  },
  categories: ["Todos", "Catálogo", "Naturaleza", "Cósmico", "Tipográfico", "Abstracto"] as Collection[],
  collections: [
    { name: "Señales terrestres", filter: "Naturaleza" as Collection, number: "01", description: "Formas botánicas y horizontes imposibles." },
    { name: "Fuera de órbita", filter: "Cósmico" as Collection, number: "02", description: "Mensajes enviados desde otra coordenada." },
    { name: "Palabras en voz alta", filter: "Tipográfico" as Collection, number: "03", description: "Letras para vestir una postura." },
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
    eyebrow: "MANIFIESTO",
    title: "La camiseta como página en blanco.",
    paragraphs: [
      "Lienzo Blanco es una marca ficticia creada para demostrar una experiencia de comercio editable, accesible y local.",
      "Cada diseño parte de una camiseta blanca, una paleta breve y una historia que cabe en el pecho.",
    ],
    facts: ["Catálogo fotográfico", "Tallas indicadas por producto", "0 transacciones reales"],
  },
  shipping: "Envío simulado de 3 a 5 días hábiles en México. Gratis desde $900 MXN.",
  returns: "Devoluciones de demostración dentro de 30 días. No se generan guías ni reembolsos reales.",
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
    legal: "© 2026 Lienzo Blanco. Catálogo fotográfico; carrito de demostración sin pagos reales.",
  },
};

export const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price);
