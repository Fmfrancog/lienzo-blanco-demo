import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { infoPages } from "@/data/info-pages";
import "./info.css";
export const dynamicParams = false;
export function generateStaticParams() { return infoPages.map(page => ({ info: page.slug })); }
type Props = { params: Promise<{ info: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { info } = await params;
  const page = infoPages.find(page => page.slug === info);
  return { title: `${page?.title ?? "Información"} | PLUR MX`, description: page?.intro, alternates: { canonical: `https://plur.com.mx/${info}/` } };
}
export default async function InfoPage({ params }: Props) {
  const { info } = await params;
  const page = infoPages.find(page => page.slug === info);
  if (!page) notFound();
  return <div className="info-site">
    <div className="demo-bar"><strong>Envío gratis a partir de 3 playeras</strong><span>Entrega de 2 a 5 días hábiles a partir de tu compra</span></div>
    <header className="info-header"><Link href="/" className="brand-wordmark" aria-label="PLUR, volver a la tienda">PLUR</Link><Link href="/">Volver a la tienda ↗</Link></header>
    <main className="info-layout"><nav aria-label="Información de PLUR" className="info-nav"><span className="kicker">CONOCE PLUR</span>{infoPages.map(item => <Link key={item.slug} href={`/${item.slug}/`} aria-current={item.slug === info ? "page" : undefined}>{item.title}</Link>)}</nav>
      <article className="info-article"><span className="kicker">PLUR MX / INFORMACIÓN</span><h1>{page.title}</h1><p className="info-intro">{page.intro}</p>{page.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <aside className="info-contact"><h2>Estamos para ayudarte</h2><a href="mailto:atencion@plur.com.mx">atencion@plur.com.mx</a><a href="https://wa.me/525574615455" target="_blank" rel="noopener noreferrer">WhatsApp: 55 7461 5455 ↗</a><small>El correo y WhatsApp se abren en servicios externos; debes enviar tu mensaje.</small></aside></article>
    </main><footer className="info-footer"><p>© PLUR MX · Precios en MXN · Diseños para expresarte con libertad.</p><Link href="/">Explorar el catálogo</Link></footer>
  </div>;
}
