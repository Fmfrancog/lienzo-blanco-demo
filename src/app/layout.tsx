import type { Metadata } from "next";
import "./globals.css";
import { AccountProvider } from "@/components/shirt-store/AccountProvider";
import { CartProvider } from "@/components/shirt-store/CartProvider";

export const metadata: Metadata = {
  verification: { google: "yNr2znRxF9cc6N_4KoDbVh4lV4V-N7_Qj61RkXK6KzU" },
  title: "PLUR | Playeras con diseño",
  description: "Explora playeras PLUR, diseños y tallas por producto. Envío gratis a partir de 3 playeras. Prepara tu pedido en la bolsa y paga con Mercado Pago.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body><AccountProvider><CartProvider>{children}</CartProvider></AccountProvider></body>
    </html>
  );
}
