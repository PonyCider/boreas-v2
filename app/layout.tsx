import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const newsreader = localFont({
  src: [
    {
      path: "./fonts/newsreader-latin.woff2",
      weight: "300 600",
      style: "normal",
    },
    {
      path: "./fonts/newsreader-latin-italic.woff2",
      weight: "300 600",
      style: "italic",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const figtree = localFont({
  src: [
    {
      path: "./fonts/figtree-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boreas | Presencia digital para especialistas de la salud",
  description:
    "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
  icons: {
    icon: "/brand/boreas-mark.png",
  },
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
