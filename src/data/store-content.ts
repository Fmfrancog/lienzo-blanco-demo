export type Collection = "Todos" | "Naturaleza" | "Cósmico" | "Tipográfico" | "Abstracto";

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
    description: "Tienda conceptual de camisetas blancas con gráfica independiente. Todo el contenido, inventario y proceso de compra es sintético.",
  },
  demoNotice: "PROTOTIPO EDITABLE · CATÁLOGO SINTÉTICO · SIN PAGOS REALES",
  announcements: [
    "Envío de demostración incluido desde $900 MXN",
    "Tallas XS—XXL · algodón sintético de muestra",
  ],
  navigation: ["Catálogo", "Colecciones", "Personaliza", "Nosotros", "Ayuda"],
  hero: {
    eyebrow: "EDICIÓN 01 — EL BLANCO COMO PUNTO DE PARTIDA",
    title: "Tu idea, sobre blanco.",
    body: "Gráficas originales para una sola prenda esencial. Explora, elige tu talla o construye una versión propia.",
    primary: "Explorar diseños",
    secondary: "Crear la mía",
  },
  categories: ["Todos", "Naturaleza", "Cósmico", "Tipográfico", "Abstracto"] as Collection[],
  collections: [
    { name: "Señales terrestres", filter: "Naturaleza" as Collection, number: "01", description: "Formas botánicas y horizontes imposibles." },
    { name: "Fuera de órbita", filter: "Cósmico" as Collection, number: "02", description: "Mensajes enviados desde otra coordenada." },
    { name: "Palabras en voz alta", filter: "Tipográfico" as Collection, number: "03", description: "Letras para vestir una postura." },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  products: [
    { id: "gato-cosmico", name: "Gato Cósmico", collection: "Cósmico", price: 199, compareAtPrice: 299, sizes: ["CH", "M", "G", "EG"], description: "Playera blanca con gráfica felina en azul, magenta y negro.", story: "Un visitante felino cruza una órbita de color para observar el mundo desde otra frecuencia.", images: ["/catalogo/gato-cosmico/01.webp", "/catalogo/gato-cosmico/02.webp", "/catalogo/gato-cosmico/03.webp", "/catalogo/gato-cosmico/04.webp", "/catalogo/gato-cosmico/05.webp"] },
    { id: "sol-lento", name: "Sol lento", collection: "Naturaleza", price: 620, description: "Corte relajado con sol coral al centro.", story: "Un recordatorio gráfico de que la luz también sabe esperar.", art: { kind: "sun", ink: "#ef6a5b", accent: "#161616" } },
    { id: "orbita-03", name: "Órbita 03", collection: "Cósmico", price: 680, description: "Gráfica orbital de líneas precisas.", story: "Tres recorridos que nunca se cruzan y aun así forman un sistema.", art: { kind: "orbit", ink: "#202b52", accent: "#ef6a5b" } },
    { id: "marea-interior", name: "Marea interior", collection: "Abstracto", price: 640, description: "Ondas cobalto en impresión frontal.", story: "El movimiento del agua traducido a una señal mínima.", art: { kind: "wave", ink: "#2460a7", accent: "#ef6a5b" } },
    { id: "herbario-nocturno", name: "Herbario nocturno", collection: "Naturaleza", price: 690, description: "Trazos botánicos en tinta profunda.", story: "Una planta imaginaria recolectada después de medianoche.", art: { kind: "flora", ink: "#173e35", accent: "#d5b65a" } },
    { id: "haz-espacio", name: "Haz espacio", collection: "Tipográfico", price: 610, description: "Mensaje tipográfico de gran formato.", story: "Menos ruido, más aire: una instrucción para todos los días.", art: { kind: "type", ink: "#161616", accent: "#ef6a5b" } },
    { id: "modulo-libre", name: "Módulo libre", collection: "Abstracto", price: 660, description: "Retícula rota con acento coral.", story: "La belleza aparece cuando una pieza decide salirse del sistema.", art: { kind: "grid", ink: "#161616", accent: "#ef6a5b" } },
    { id: "ojo-claro", name: "Ojo claro", collection: "Abstracto", price: 650, description: "Símbolo ocular de línea continua.", story: "Mirar de nuevo también es una forma de cambiar las cosas.", art: { kind: "eye", ink: "#3c2b64", accent: "#ef6a5b" } },
    { id: "cumbre-quieta", name: "Cumbre quieta", collection: "Naturaleza", price: 700, description: "Paisaje geométrico de alta montaña.", story: "La pausa exacta antes de que el sol cruce la cumbre.", art: { kind: "mountain", ink: "#243a35", accent: "#e8a852" } },
    { id: "alien-amable", name: "Alien amable", collection: "Cósmico", price: 720, description: "Visitante verde en edición amistosa.", story: "Una señal de bienvenida para quien llega de muy lejos.", art: { kind: "alien", ink: "#377b65", accent: "#ef6a5b" } },
    { id: "hecho-a-mano", name: "Hecho a mano", collection: "Tipográfico", price: 630, description: "Mano y lettering en tinta negra.", story: "Una celebración de las ideas que comienzan con lápiz y papel.", art: { kind: "hand", ink: "#151515", accent: "#ef6a5b" } },
    { id: "luna-nueva", name: "Luna nueva", collection: "Cósmico", price: 675, description: "Fases lunares en composición vertical.", story: "Cambiar de forma sin dejar de ser la misma materia.", art: { kind: "moon", ink: "#25254a", accent: "#c5a253" } },
    { id: "fruta-rara", name: "Fruta rara", collection: "Naturaleza", price: 695, description: "Bodegón cítrico de formas libres.", story: "Una cosecha imposible para quienes eligen lo inesperado.", art: { kind: "fruit", ink: "#dc5e4e", accent: "#32715f" } },
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
    facts: ["13 diseños de muestra", "6 tallas", "0 transacciones reales"],
  },
  shipping: "Envío simulado de 3 a 5 días hábiles en México. Gratis desde $900 MXN.",
  returns: "Devoluciones de demostración dentro de 30 días. No se generan guías ni reembolsos reales.",
  faq: [
    { question: "¿Estas camisetas existen?", answer: "No. Productos, disponibilidad, precios y pedidos son totalmente sintéticos." },
    { question: "¿Puedo pagar?", answer: "No. El carrito es una simulación local y nunca solicita datos bancarios." },
    { question: "¿Cómo elijo talla?", answer: "Elige XS a XXL en el detalle. La guía es ilustrativa: XS 46 cm, S 49, M 52, L 55, XL 58, XXL 61." },
  ],
  account: { title: "Cuenta de demostración", body: "Aquí vivirían tus favoritos, pedidos y direcciones. No se crea ninguna cuenta real.", action: "Simular acceso" },
  footer: {
    columns: [
      { title: "Explora", links: ["Catálogo", "Colecciones", "Personaliza"] },
      { title: "Información", links: ["Envíos", "Devoluciones", "Preguntas frecuentes"] },
      { title: "Marca", links: ["Nosotros", "Proceso", "Contacto demo"] },
    ],
    legal: "© 2026 Lienzo Blanco. Experiencia sintética de demostración; no vende productos reales.",
  },
};

export const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price);
