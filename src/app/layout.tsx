import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andrés Russ | Software Engineer",
  description:
    "Desarrollo de software freelancer en Sincelejo: sitios web, sistemas de gestión con licencia anual e implementación, y software a la medida. Hablamos de tu proyecto sin costo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
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
