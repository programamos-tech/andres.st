import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "andres.backstage | Software a la medida",
  description: "Construyo la plataforma que tu marca necesita. Software a la medida, programado desde cero.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
