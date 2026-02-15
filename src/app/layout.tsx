import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "andresruss.st | Software a la medida",
  description: "Desarrollo de software a la medida para negocios que los sistemas genéricos no resuelven. Pagas una vez, es tuyo. DB individual, soporte local. Sincelejo, Colombia.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
