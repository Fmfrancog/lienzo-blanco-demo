import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLUR | Playeras con diseño",
  description: "Explora el catálogo fotográfico de playeras PLUR. Diseños, galerías y tallas por producto. Bolsa de demostración, sin pagos reales.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
