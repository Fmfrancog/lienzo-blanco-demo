import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLUR | Playeras con diseño",
  description: "Explora playeras PLUR, diseños y tallas por producto. Envío gratis a partir de 3 playeras. Prepara tu pedido en la bolsa y paga con Mercado Pago.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
