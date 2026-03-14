import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // [cite: 83]
import "./globals.css";

// Configuración de la fuente Montserrat según el PDF [cite: 84]
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ubi Pets - Localización de Mascotas",
  description: "Tesis de Ingeniería y Ciberseguridad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos la fuente Montserrat a todo el cuerpo del sitio [cite: 85] */}
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}
