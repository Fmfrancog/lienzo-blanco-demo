"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Menu, Minus, Plus, Search, ShoppingBag, User, X } from "lucide-react";
import { formatPrice, Product, storeContent, type Collection } from "@/data/store-content";

type DialogName = "product" | "cart" | "account" | "help" | "custom" | null;
type CartLine = { product: Product; size: string; quantity: number };

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function ProductArtwork({ product, large = false }: { product: Product; large?: boolean }) {
  if (product.images?.length) {
    return <div className={`artwork artwork--photo ${large ? "artwork--large" : ""}`}><Image src={product.images[0]} alt={`Playera ${product.name}`} width={619} height={800} loading={large || product.id === "gato-cosmico" ? "eager" : "lazy"} sizes={large ? "(max-width: 800px) 100vw, 50vw" : "(max-width: 520px) 100vw, (max-width: 1100px) 33vw, 25vw"} /></div>;
  }
  if (!product.art) return null;
  const { kind, ink, accent } = product.art;
  return (
    <div className={`artwork ${large ? "artwork--large" : ""}`} aria-label={`Mockup de camiseta ${product.name}`} role="img">
      <svg viewBox="0 0 420 480" aria-hidden="true">
        <path className="shirt-shadow" d="M91 82 153 48c17 25 97 25 114 0l62 34 60 69-54 47-26-31v264H111V167l-26 31-54-47 60-69Z" />
        <path className="shirt" d="M92 73 151 42c17 28 101 28 118 0l59 31 57 70-51 43-30-36v267H116V150l-30 36-51-43 57-70Z" />
        <path className="collar" d="M151 42c17 28 101 28 118 0-5 43-108 43-118 0Z" />
        <g transform="translate(135 148)">
          {kind === "sun" && <><circle cx="75" cy="72" r="45" fill={ink}/><path d="M75 8V0M75 144v-8M11 72H3m144 0h-8M29 26l-8-8m100 100 8 8m-8-100 8-8M29 118l-8 8" stroke={accent} strokeWidth="7" strokeLinecap="round"/></>}
          {kind === "orbit" && <><ellipse cx="75" cy="76" rx="68" ry="28" fill="none" stroke={ink} strokeWidth="6" transform="rotate(-22 75 76)"/><ellipse cx="75" cy="76" rx="28" ry="68" fill="none" stroke={accent} strokeWidth="5" transform="rotate(22 75 76)"/><circle cx="75" cy="76" r="12" fill={ink}/></>}
          {kind === "wave" && <>{[28,50,72,94,116].map((y)=><path key={y} d={`M5 ${y} C35 ${y-28},55 ${y+28},82 ${y} S128 ${y-28},148 ${y}`} fill="none" stroke={y===72?accent:ink} strokeWidth="7"/>)}</>}
          {kind === "flora" && <><path d="M78 140C72 105 75 65 76 10" stroke={ink} strokeWidth="6" fill="none"/><path d="M74 105C32 100 25 72 25 55 50 56 72 74 74 105ZM77 78c40-5 48-32 48-50-25 3-45 22-48 50ZM74 132c-34-2-44-21-46-39 23 0 42 13 46 39Z" fill={accent}/></>}
          {kind === "type" && <><text x="75" y="52" textAnchor="middle" fontSize="35" fontWeight="900" fill={ink}>HAZ</text><text x="75" y="92" textAnchor="middle" fontSize="35" fontWeight="900" fill={ink}>ESPA</text><text x="75" y="132" textAnchor="middle" fontSize="35" fontWeight="900" fill={accent}>CIO</text></>}
          {kind === "grid" && <>{Array.from({length:12}).map((_,i)=><rect key={i} x={(i%4)*34+8} y={Math.floor(i/4)*34+15} width="24" height="24" rx="3" fill={i===7?accent:ink} transform={i===7?"rotate(16 127 61)":undefined}/>)}</>}
          {kind === "eye" && <><path d="M5 74Q75 8 145 74Q75 140 5 74Z" fill="none" stroke={ink} strokeWidth="7"/><circle cx="75" cy="74" r="28" fill={accent}/><circle cx="75" cy="74" r="11" fill={ink}/></>}
          {kind === "mountain" && <><circle cx="106" cy="38" r="23" fill={accent}/><path d="m5 135 50-80 27 35 23-30 42 75Z" fill={ink}/><path d="m55 55 27 35-13 9Z" fill="#fff"/></>}
          {kind === "alien" && <><path d="M75 8c-43 0-60 35-53 72 7 39 34 61 53 68 19-7 46-29 53-68 7-37-10-72-53-72Z" fill={ink}/><ellipse cx="52" cy="72" rx="12" ry="24" transform="rotate(-28 52 72)" fill="#fff"/><ellipse cx="98" cy="72" rx="12" ry="24" transform="rotate(28 98 72)" fill="#fff"/><path d="M59 113q16 12 32 0" stroke={accent} strokeWidth="5" fill="none"/></>}
          {kind === "hand" && <><path d="M42 125V58c0-12 15-12 15 0V35c0-13 17-13 17 0v20-30c0-13 17-13 17 0v32-21c0-12 17-12 17 0v49l15-15c12-12 26 2 16 15l-36 47c-16 20-61 13-61-7Z" fill="none" stroke={ink} strokeWidth="7"/><circle cx="120" cy="28" r="9" fill={accent}/></>}
          {kind === "moon" && <><circle cx="75" cy="72" r="55" fill={ink}/><circle cx="99" cy="52" r="52" fill="#fff"/><circle cx="25" cy="25" r="5" fill={accent}/><circle cx="130" cy="110" r="7" fill={accent}/></>}
          {kind === "fruit" && <><path d="M76 50c-10-27 4-43 23-47" stroke={accent} strokeWidth="8" fill="none"/><path d="M94 13c20-8 35 1 40 15-20 8-35-1-40-15Z" fill={accent}/><path d="M75 45c45 0 68 31 58 68-10 34-106 34-116 0C7 76 30 45 75 45Z" fill={ink}/><circle cx="48" cy="89" r="5" fill="#fff"/><circle cx="97" cy="101" r="7" fill="#fff"/></>}
        </g>
      </svg>
    </div>
  );
}

function ProductGallery({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  if (!product.images?.length) return <ProductArtwork product={product} large />;
  return <div className="product-gallery">
    <div className="gallery-main"><Image data-testid="gallery-main-image" src={product.images[activeImage]} alt={`${product.name}, vista ${activeImage + 1}`} width={619} height={800} sizes="(max-width: 800px) 100vw, 50vw" /></div>
    <div className="gallery-thumbnails" aria-label={`Galería de ${product.name}`}>
      {product.images.map((image, index) => <button data-testid="gallery-thumbnail" aria-label={`Ver imagen ${index + 1} de ${product.name}`} aria-pressed={activeImage === index} key={image} onClick={() => setActiveImage(index)}><Image src={image} alt="" width={120} height={155} sizes="90px" /></button>)}
    </div>
  </div>;
}

function Modal({ name, title, onClose, children, className = "" }: { name: string; title: string; onClose: () => void; children: React.ReactNode; className?: string }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={`${name}: ${title}`}>
      <div className="modal__head"><div><span className="kicker">{name}</span><h2>{title}</h2></div><button data-action="close-dialog" className="icon-button" onClick={onClose} aria-label="Cerrar diálogo"><X /></button></div>
      {children}
    </section>
  </div>;
}

export function ShirtStore() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<Collection>("Todos");
  const [dialog, setDialog] = useState<DialogName>(null);
  const [selected, setSelected] = useState<Product>(storeContent.products[0]);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => storeContent.products.filter((product) => {
    const matchesCollection = collection === "Todos" || product.collection === collection;
    const haystack = `${product.name} ${product.collection} ${product.description} ${product.story}`.toLowerCase();
    return matchesCollection && haystack.includes(query.trim().toLowerCase());
  }), [collection, query]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setDialog(null); setMobileOpen(false); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2600); return () => window.clearTimeout(timer); }, [toast]);

  const openProduct = (product: Product) => { setSelected(product); setSize("M"); setQuantity(1); setDialog("product"); };
  const navigate = (label: string) => {
    setMobileOpen(false);
    if (label === "Ayuda") return setDialog("help");
    if (label === "Personaliza") return scrollToId("personaliza");
    if (label === "Nosotros") return scrollToId("nosotros");
    scrollToId(label === "Colecciones" ? "colecciones" : "catalogo");
  };
  const addToCart = () => {
    setCart((current) => {
      const existing = current.findIndex((line) => line.product.id === selected.id && line.size === size);
      if (existing < 0) return [...current, { product: selected, size, quantity }];
      return current.map((line, index) => index === existing ? { ...line, quantity: line.quantity + quantity } : line);
    });
    setDialog(null); setToast(`${selected.name} · talla ${size} agregada a tu bolsa`);
  };
  const updateLine = (index: number, delta: number) => setCart((current) => current.flatMap((line, i) => i !== index ? [line] : line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []));
  const submitNewsletter = (event: FormEvent) => { event.preventDefault(); setToast(`Gracias. ${newsletter} quedó en la lista demo.`); setNewsletter(""); };
  const footerAction = (link: string) => {
    if (["Catálogo", "Colecciones", "Personaliza", "Nosotros"].includes(link)) return navigate(link);
    setDialog("help"); setToast(`Abriendo información: ${link}`);
  };

  return <>
    <header className="site-header">
      <div className="demo-bar">{storeContent.demoNotice}</div>
      <div className="header-main shell">
        <button data-action="home" className="brand" onClick={() => scrollToId("inicio")} aria-label="Lienzo Blanco, ir al inicio"><span className="brand-mark">{storeContent.brand.mark}</span><span>{storeContent.brand.name}</span></button>
        <nav className={`main-nav ${mobileOpen ? "main-nav--open" : ""}`} aria-label="Navegación principal">{storeContent.navigation.map((label) => <button data-action={`nav-${label.toLowerCase()}`} key={label} onClick={() => navigate(label)}>{label}</button>)}</nav>
        <div className="header-tools">
          <label className="search"><Search aria-hidden="true"/><input type="search" aria-label="Buscar diseños" placeholder="Buscar diseños" value={query} onChange={(e)=>{setQuery(e.target.value); scrollToId("catalogo");}}/></label>
          <button data-action="open-account" className="tool-button" onClick={() => setDialog("account")} aria-label="Mi cuenta"><User/><span>Mi cuenta</span></button>
          <button data-action="open-cart" className="tool-button cart-button" onClick={() => setDialog("cart")} aria-label={`Bolsa de compras, ${cartCount} artículos`}><ShoppingBag/><span>Bolsa de compras</span><b>{cartCount}</b></button>
          <button data-action="toggle-mobile-menu" className="mobile-button" onClick={() => setMobileOpen((open)=>!open)} aria-label="Abrir menú"><Menu/></button>
        </div>
      </div>
    </header>

    <main id="inicio">
      <section className="hero shell">
        <div className="hero-copy"><span className="kicker">{storeContent.hero.eyebrow}</span><h1>{storeContent.hero.title}</h1><p>{storeContent.hero.body}</p><div className="button-row"><button data-action="hero-explore" className="button button--dark" onClick={() => scrollToId("catalogo")}>{storeContent.hero.primary}<ArrowDown/></button><button data-action="hero-customize" className="button button--line" onClick={() => scrollToId("personaliza")}>{storeContent.hero.secondary}<ArrowRight/></button></div></div>
        <div className="hero-stage"><span className="stage-note">CAMISETA / BLANCO ÓPTICO</span><ProductArtwork product={storeContent.products[0]} large/><span className="stage-edition">01<br/>/{storeContent.products.length}</span></div>
      </section>

      <div className="ticker" aria-label="Anuncios"><div>{[...storeContent.announcements,...storeContent.announcements].map((item,i)=><span key={`${item}-${i}`}>✦ {item}</span>)}</div></div>

      <section id="colecciones" className="section shell"><header className="section-head"><div><span className="kicker">TRES FORMAS DE EMPEZAR</span><h2>Colecciones</h2></div><p>Selecciona un universo visual y salta al catálogo filtrado.</p></header><div className="collection-grid">{storeContent.collections.map((item)=><button data-action={`filter-collection-${item.number}`} className="collection-card" key={item.name} onClick={()=>{setCollection(item.filter); scrollToId("catalogo");}}><span>{item.number}</span><div><h3>{item.name}</h3><p>{item.description}</p></div><ArrowRight/></button>)}</div></section>

      <section id="catalogo" className="section catalog shell"><header className="section-head"><div><span className="kicker">CATÁLOGO COMPLETO</span><h2>Diseños sobre blanco</h2></div><p>{filtered.length} {filtered.length === 1 ? "diseño" : "diseños"} · precios MXN</p></header>
        <div className="filters" role="group" aria-label="Filtrar por colección">{storeContent.categories.map((item)=><button data-action={`filter-${item.toLowerCase()}`} aria-pressed={collection===item} className={collection===item?"active":""} key={item} onClick={()=>setCollection(item)}>{item}</button>)}</div>
        {filtered.length ? <div className="product-grid">{filtered.map((product)=><article className="product-card" data-testid="product-card" key={product.id}><button data-action={`open-product-art-${product.id}`} className="product-art-button" onClick={()=>openProduct(product)} aria-label={`Vista de camiseta ${product.name}`}><ProductArtwork product={product}/><span className="product-number">{String(storeContent.products.indexOf(product)+1).padStart(2,"0")}</span></button><div className="product-info"><div><span>{product.collection}</span><h3>{product.name}</h3></div><strong>{formatPrice(product.price)}</strong></div><p>{product.description}</p><button data-action={`open-product-${product.id}`} className="card-action" onClick={()=>openProduct(product)}>Ver diseño <ArrowRight/></button></article>)}</div> : <div className="empty-state"><h3>No encontramos esa gráfica.</h3><p>Prueba otra palabra o vuelve a ver todos los diseños.</p><button data-action="clear-search" className="button button--dark" onClick={()=>{setQuery("");setCollection("Todos");}}>Restablecer catálogo</button></div>}
      </section>

      <section id="personaliza" className="custom-section"><div className="shell custom-grid"><div><span className="kicker">{storeContent.customizer.eyebrow}</span><h2>{storeContent.customizer.title}</h2><p>{storeContent.customizer.body}</p><button data-action="open-customizer" className="button button--light" onClick={()=>setDialog("custom")}>Abrir simulador <ArrowRight/></button></div><div className="custom-poster"><span>TU MENSAJE</span><strong>AQUÍ</strong><small>tinta coral / frente / 18 × 12 cm</small></div></div></section>

      <section id="nosotros" className="section about shell"><div className="about-copy"><span className="kicker">{storeContent.about.eyebrow}</span><h2>{storeContent.about.title}</h2>{storeContent.about.paragraphs.map((p)=><p key={p}>{p}</p>)}</div><div className="facts">{storeContent.about.facts.map((fact,i)=><div key={fact}><strong>0{i+1}</strong><span>{fact}</span></div>)}</div></section>

      <section className="newsletter shell"><div><span className="kicker">CORREO DE MUESTRA</span><h2>Noticias que no saturan.</h2><p>Recibe lanzamientos ficticios y notas de diseño. Sin envío real.</p></div><form onSubmit={submitNewsletter}><label><span>Correo electrónico</span><input required type="email" aria-label="Correo para novedades" placeholder="tu@correo.mx" value={newsletter} onChange={(e)=>setNewsletter(e.target.value)}/></label><button data-action="submit-newsletter" className="button button--dark" type="submit">Suscribirme</button></form></section>
    </main>

    <footer><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark">{storeContent.brand.mark}</span><h2>{storeContent.brand.name}</h2><p>{storeContent.brand.description}</p></div>{storeContent.footer.columns.map((column)=><div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map((link)=><button data-action={`footer-${link.toLowerCase().replaceAll(" ","-")}`} key={link} onClick={()=>footerAction(link)}>{link}</button>)}</div>)}</div><div className="shell footer-bottom"><span>{storeContent.footer.legal}</span><button data-action="back-to-top" onClick={()=>scrollToId("inicio")}>Volver arriba ↑</button></div></footer>

    {dialog === "product" && <Modal name="Detalle de producto" title={selected.name} onClose={()=>setDialog(null)} className="product-modal"><div className="detail-grid"><ProductGallery key={selected.id} product={selected}/><div className="detail-copy"><span className="kicker">{selected.collection} · {selected.id.toUpperCase()}</span><p className="detail-price">{formatPrice(selected.price)}</p><p>{selected.description}</p><blockquote>“{selected.story}”</blockquote><fieldset><legend>Talla</legend><div className="size-grid">{storeContent.sizes.map((item)=><button data-action={`select-size-${item}`} aria-pressed={size===item} key={item} onClick={()=>setSize(item)}>{item}</button>)}</div></fieldset><div className="quantity"><span>Cantidad</span><div><button data-action="decrease-product-quantity" aria-label="Reducir cantidad" onClick={()=>setQuantity((n)=>Math.max(1,n-1))}><Minus/></button><b>{quantity}</b><button data-action="increase-product-quantity" aria-label="Aumentar cantidad" onClick={()=>setQuantity((n)=>n+1)}><Plus/></button></div></div><button data-action="add-to-cart" className="button button--coral button--wide" onClick={addToCart}>Agregar a la bolsa · {formatPrice(selected.price*quantity)}</button><small>{storeContent.shipping} Compra de demostración, sin cobro.</small></div></div></Modal>}

    {dialog === "cart" && <Modal name="Tu bolsa" title={`${cartCount} ${cartCount===1?"artículo":"artículos"}`} onClose={()=>setDialog(null)}>{cart.length ? <><div className="cart-lines">{cart.map((line,index)=><div className="cart-line" key={`${line.product.id}-${line.size}`}><ProductArtwork product={line.product}/><div><h3>{line.product.name}</h3><span>Talla {line.size}</span><strong>{formatPrice(line.product.price*line.quantity)}</strong></div><div className="line-quantity"><button data-action={`decrease-cart-${line.product.id}`} aria-label={`Reducir ${line.product.name}`} onClick={()=>updateLine(index,-1)}><Minus/></button><b>{line.quantity}</b><button data-action={`increase-cart-${line.product.id}`} aria-label={`Aumentar ${line.product.name}`} onClick={()=>updateLine(index,1)}><Plus/></button></div></div>)}</div><div className="cart-total"><span>Total de demostración</span><strong>{formatPrice(cartTotal)}</strong></div><button data-action="simulate-checkout" className="button button--coral button--wide" onClick={()=>setToast("Checkout simulado: no se realizó ningún cobro.")}>Simular checkout</button></> : <div className="empty-state"><ShoppingBag/><h3>Tu bolsa está vacía</h3><p>Agrega un diseño para probar el flujo local.</p><button data-action="cart-go-catalog" className="button button--dark" onClick={()=>{setDialog(null);scrollToId("catalogo");}}>Ir al catálogo</button></div>}</Modal>}

    {dialog === "account" && <Modal name="Cuenta de demostración" title="Tu espacio, sin registro real" onClose={()=>setDialog(null)}><div className="dialog-copy"><User/><p>{storeContent.account.body}</p><button data-action="simulate-login" className="button button--dark button--wide" onClick={()=>setToast("Acceso simulado correctamente.")}><Check/> {storeContent.account.action}</button><small>No guardamos correo, contraseña ni datos personales.</small></div></Modal>}

    {dialog === "help" && <Modal name="Centro de ayuda" title="¿Qué necesitas saber?" onClose={()=>setDialog(null)}><div className="help-copy"><details><summary>Envíos</summary><p>{storeContent.shipping}</p></details><details><summary>Devoluciones</summary><p>{storeContent.returns}</p></details>{storeContent.faq.map((item)=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}<button data-action="help-contact" className="button button--dark button--wide" onClick={()=>setToast("Mensaje demo recibido. No se envió información.")}>Simular contacto</button></div></Modal>}

    {dialog === "custom" && <Modal name="Personalizador de demostración" title="Boceta tu camiseta" onClose={()=>setDialog(null)}><Customizer onDone={(message)=>{setDialog(null);setToast(message);}}/></Modal>}
    {toast && <div className="toast" role="status"><Check/>{toast}</div>}
  </>;
}

function Customizer({ onDone }: { onDone: (message: string) => void }) {
  const [phrase, setPhrase] = useState("MI IDEA");
  const [color, setColor] = useState("#ef6a5b");
  const [position, setPosition] = useState("Centro");
  return <div className="customizer"><div className="custom-preview"><div className="mini-shirt"><strong style={{color}}>{phrase || "TU IDEA"}</strong></div><span>{position} · vista frontal</span></div><div className="custom-form"><label>Frase<input maxLength={18} value={phrase} onChange={(e)=>setPhrase(e.target.value.toUpperCase())}/></label><fieldset><legend>Color de tinta</legend><div className="swatches">{["#ef6a5b","#171717","#2460a7","#377b65"].map((item)=><button data-action={`custom-color-${item.slice(1)}`} aria-label={`Tinta ${item}`} aria-pressed={color===item} key={item} style={{background:item}} onClick={()=>setColor(item)}/>)}</div></fieldset><fieldset><legend>Ubicación</legend><div className="position-buttons">{["Centro","Bolsillo","Espalda"].map((item)=><button data-action={`custom-position-${item.toLowerCase()}`} aria-pressed={position===item} key={item} onClick={()=>setPosition(item)}>{item}</button>)}</div></fieldset><button data-action="save-custom-concept" className="button button--coral button--wide" disabled={!phrase.trim()} onClick={()=>onDone(`Concepto “${phrase}” guardado localmente.`)}>Guardar concepto demo</button></div></div>;
}
