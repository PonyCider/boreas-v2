"use client";

import { sectionIds } from "@/content/site";
import Particles from "@/components/ui/particles";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { VariableProximity } from "@/components/ui/variable-proximity";
import { InteractiveHoverButton } from "@/components/landing/interactive-hover-button";
import { Dock, DockIcon } from "@/components/ui/dock";

export function SiteFooter() {
  const scrollToPricing = () => {
    const el = document.getElementById(sectionIds.pricing);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      data-theme="dark"
      className="relative border-t border-[#373129] bg-[#131210] py-14 text-[#F5F1E8] overflow-hidden"
    >
      {/* Reactbits Particles Background */}
      <Particles
        particleColors={["#ffffff", "#E27F62"]}
        particleCount={120}
        particleSpread={12}
        speed={0.1}
        particleBaseSize={180}
        moveParticlesOnHover={true}
        alphaParticles={true}
        disableRotation={false}
        pixelRatio={1}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* 2. Badge de disponibilidad más grande */}
          <div className="mb-5">
            <AnimatedShinyText className="text-sm px-4 py-1.5">
              Disponible para 3 consultorios este mes
            </AnimatedShinyText>
          </div>

          {/* 3. Logo Responsivo: VariableProximity en Desktop, Estático elegante en Mobile */}
          <div className="mb-6">
            <div className="hidden sm:block">
              <VariableProximity
                label="Boreas"
                className="font-display italic text-[38px] font-medium tracking-tight"
              />
            </div>
            <div className="block sm:hidden">
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "32px",
                  color: "#F5F1E8",
                }}
              >
                Boreas
              </span>
            </div>
          </div>

          {/* Enlaces de navegación + 3 & 4. Botón "Contáctanos" (Interactive en Desktop, Estándar Touch en Mobile) */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-8 text-sm font-medium text-[#A8A192]">
            <a
              href={`#${sectionIds.hero}`}
              className="transition-colors hover:text-[#F5F1E8]"
            >
              Inicio
            </a>
            <a
              href={`#${sectionIds.problema}`}
              className="transition-colors hover:text-[#F5F1E8]"
            >
              Problema
            </a>
            <a
              href={`#${sectionIds.motores}`}
              className="transition-colors hover:text-[#F5F1E8]"
            >
              Motores
            </a>
            <a
              href={`#${sectionIds.socialProof}`}
              className="transition-colors hover:text-[#F5F1E8]"
            >
              Resultados
            </a>

            {/* Desktop: Interactive Hover Button */}
            <div className="hidden sm:inline-block">
              <InteractiveHoverButton
                onClick={scrollToPricing}
                className="text-xs py-1.5 px-5 text-[#F5F1E8] border-[#373129]"
              >
                Contáctanos
              </InteractiveHoverButton>
            </div>

            {/* Mobile: Clean Touch-Friendly Button */}
            <button
              onClick={scrollToPricing}
              className="inline-block sm:hidden rounded-full border border-[#373129] bg-[#252119] px-5 py-2 text-xs font-semibold text-[#F5F1E8] active:scale-95 transition-transform"
            >
              Contáctanos
            </button>
          </nav>
        </div>

        {/* Horizontal Divider Line */}
        <div className="w-full border-t border-[#373129] my-8" />

        {/* 1. Bottom Section: Copyright & Social Links Dock (X, Instagram, Facebook, WhatsApp - TODO notas) */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-xs text-[#A8A192]">
          <p>© {new Date().getFullYear()} Boreas. Todos los derechos reservados.</p>

          <Dock>
            {/* TODO: Conectar URL oficial de X (Twitter) */}
            <DockIcon href="#" ariaLabel="X (Twitter)">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </DockIcon>

            {/* TODO: Conectar URL oficial de Instagram */}
            <DockIcon href="#" ariaLabel="Instagram">
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </DockIcon>

            {/* TODO: Conectar URL oficial de Facebook */}
            <DockIcon href="#" ariaLabel="Facebook">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </DockIcon>

            {/* TODO: Conectar enlace directo a WhatsApp */}
            <DockIcon href="#" ariaLabel="WhatsApp">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.006 3.674 3.749-.982z" />
              </svg>
            </DockIcon>
          </Dock>
        </div>
      </div>
    </footer>
  );
}
