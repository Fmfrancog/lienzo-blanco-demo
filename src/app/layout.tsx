import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lienzo Blanco | Playeras blancas de diseño",
  description: "Prototipo editable de una tienda de playeras blancas con diseños originales y contenido sintético.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
