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
  title: "Boreas | Consultorio digital 24/7 para médicos",
  description:
    "Diseñamos tu consultorio digital profesional en 48 a 72 horas con reseñas de Google Maps, redacción médica y conexión directa a WhatsApp.",
  openGraph: {
    title: "Boreas | Consultorio digital 24/7 para médicos",
    description:
      "Diseñamos tu consultorio digital profesional en 48 a 72 horas con reseñas de Google Maps, redacción médica y conexión directa a WhatsApp.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boreas | Consultorio digital 24/7 para médicos",
    description:
      "Diseñamos tu consultorio digital profesional en 48 a 72 horas con reseñas de Google Maps, redacción médica y conexión directa a WhatsApp.",
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
