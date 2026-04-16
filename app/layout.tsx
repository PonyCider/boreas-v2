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
  title: "Boreas | Sistema operativo de revenue con IA",
  description:
    "Boreas organiza revenue con IA. Relevo, su módulo activo de conversión, responde, califica y empuja leads a acciones concretas para salud, belleza e inmobiliario.",
  openGraph: {
    title: "Boreas | Sistema operativo de revenue con IA",
    description:
      "Relevo es el módulo de conversión de Boreas: playbooks por industria para responder, calificar y cerrar acciones medibles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boreas | Sistema operativo de revenue con IA",
    description:
      "Playbooks por industria para convertir conversaciones en acciones medibles en salud, belleza e inmobiliario.",
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
