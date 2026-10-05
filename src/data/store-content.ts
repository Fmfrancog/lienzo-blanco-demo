import driveCatalog from "./drive-products.json";
import productTaxonomy from "./product-taxonomy.json";
import productCopy from "./product-copy.json";
const descriptionsById: Readonly<Record<string, string>> = productCopy;

export const thematicCategories = ["Calaveras", "Navidad y fiestas", "Raíces y símbolos", "Aliens y espacio", "Arte y frases", "Animales", "Música", "Naturaleza y hongos", "Deportes", "Bitcoin"] as const;
export type Collection = "Todos" | typeof thematicCategories[number];
const taxonomyById = new Map(productTaxonomy.map((item) => [item.id, item]));

export type Product = {
  id: string;
  name: string;
  collection: Exclude<Collection, "Todos">;
  tags: readonly string[];
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
  categories: ["Todos", ...thematicCategories] as Collection[],
  collections: [
    { name: "Calaveras", filter: "Calaveras" as Collection, number: "01", description: "Rosas, hongos y gráficas de otro mundo." },
    { name: "Aliens y espacio", filter: "Aliens y espacio" as Collection, number: "02", description: "Encuentros con aliens, planetas y astronautas." },
    { name: "Animales", filter: "Animales" as Collection, number: "03", description: "Felinos, caballos y criaturas con personalidad." },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  products: [
    { id: "gato-cosmico", name: "Gato Cósmico", collection: "Cósmico", price: 199, compareAtPrice: 299, sizes: ["CH", "M", "G", "EG"], description: "Playera blanca con gráfica felina en azul, magenta y negro.", story: "Un visitante felino cruza una órbita de color para observar el mundo desde otra frecuencia.", images: ["/catalogo/gato-cosmico/01.webp", "/catalogo/gato-cosmico/02.webp", "/catalogo/gato-cosmico/03.webp", "/catalogo/gato-cosmico/04.webp", "/catalogo/gato-cosmico/05.webp"] },
    ...driveCatalog,
  ].map((product): Product => {
    const taxonomy = taxonomyById.get(product.id);
    if (!taxonomy) throw new Error(`Falta clasificación para ${product.id}`);
    const description = descriptionsById[product.id];
    if (!description) throw new Error(`Falta descripción visual para ${product.id}`);
    return { ...product, description, story: "", collection: taxonomy.category as Product["collection"], tags: taxonomy.tags };
  }),
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
    { question: "¿Estas camisetas existen?", answer: "El catálogo contiene fotografías de los diseños proporcionados. Las categorías y etiquetas describen sus temas, no materiales, licencias ni existencias. La disponibilidad debe confirmarse; el carrito no realiza pedidos reales." },
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
