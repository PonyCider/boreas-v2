import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
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
      className={`${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground selection:bg-accent/20 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
