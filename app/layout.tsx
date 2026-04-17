import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boreas | IA para responder y cerrar mejor",
  description:
    "Boreas ayuda a salud, belleza e inmobiliario a responder más rápido, atender mejor y llevar más conversaciones a citas, visitas y oportunidades.",
  openGraph: {
    title: "Boreas | IA para responder y cerrar mejor",
    description:
      "Relevo es la experiencia de Boreas que hoy ya responde, guía y ayuda a cerrar más conversaciones.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boreas | IA para responder y cerrar mejor",
    description:
      "Más respuestas a tiempo, mejor atención y más citas, visitas y oportunidades.",
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
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground selection:bg-[#d4c0a1]/20 selection:text-[#f7f1ea]">
        {children}
      </body>
    </html>
  );
}
