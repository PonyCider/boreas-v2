import type { Metadata } from "next";
import { Newsreader, Figtree } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boreas | Presencia digital para especialistas de la salud",
  description:
    "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
  openGraph: {
    title: "Boreas | Presencia digital para especialistas de la salud",
    description:
      "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boreas | Presencia digital para especialistas de la salud",
    description:
      "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground selection:bg-[var(--accent-soft)] selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
