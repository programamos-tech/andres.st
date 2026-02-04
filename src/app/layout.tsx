import type { Metadata } from "next";
import { Alegreya } from "next/font/google";
import "./globals.css";

const alegreya = Alegreya({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alegreya",
});

export const metadata: Metadata = {
  title: "andres.backstage | Software a la medida",
  description: "Construyo la plataforma que tu marca necesita. Software a la medida, programado desde cero.",
  icons: {
    icon: "/andrew.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={alegreya.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
