import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/shirt-store/CartProvider";

export const metadata: Metadata = {
  title: "PLUR | Playeras con diseño",
  description: "Explora playeras PLUR, diseños y tallas por producto. Envío gratis a partir de 3 playeras. Prepara tu pedido en la bolsa y paga con Mercado Pago.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
