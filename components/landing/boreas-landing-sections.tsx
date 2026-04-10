"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { MacbookShowcase } from "@/components/hero/macbook-showcase";

// Import modules (EPIC 4 & 5 & Re-designs)
import { ProblemSection } from "./problem-section";
import { MechanismSectionB } from "./mechanism-section-b";
import { ComparisonSection } from "./comparison-section";
import { BentoGridSection } from "./bento-grid-section";
import { FaqSection } from "./faq-section";
import { GuaranteeSection } from "./guarantee-section";
import { TrustAndProofSection } from "./trust-proof-section";
import { FinalCtaSection } from "./final-cta-section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Un cliente escribe",
    description: "Desde WhatsApp, Instagram o cualquier canal donde llegue la intención.",
  },
  {
    number: "02",
    title: "Boreas responde",
    description: "Aclara dudas, filtra al prospecto y propone horarios sin fricción.",
  },
  {
    number: "03",
    title: "La cita se agenda",
    description: "La conversación avanza sola hasta la reserva, confirmación y seguimiento.",
  },
];

const useCases = [
  {
    vertical: "Salud y Clínicas",
    lead: "Pacientes con dudas o buscando agendar",
    value: "Pacientes atendidos 24/7 sin colapsar la recepción. Boreas responde, filtra y agenda.",
  },
  {
    vertical: "Inmobiliario y Construcción",
    lead: "Prospectos interesados en propiedades o presupuestos",
    value: "Calificación inmediata de leads fríos vs calientes. Captura de datos clave al instante.",
  },
  {
    vertical: "Belleza y Bienestar",
    lead: "Clientes buscando servicios y disponibilidad",
    value: "Un recepcionista digital que no descansa. Cierra reservas mientras tú atiendes el negocio.",
  },
];

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/30">
      {children}
    </p>
  );
}

export function SectionFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-parallax-section
      className={`relative overflow-hidden py-28 sm:py-36 ${className}`}
    >
      {children}
    </section>
  );
}

function HowItWorksSection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="12"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Cómo funciona</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            Tres movimientos precisos para que una conversación termine en cita.
          </h2>
        </div>

        <div
          data-step-group
          className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5"
        >
          {steps.map((step) => (
            <article
              key={step.number}
              data-step-card
              className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.035] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/28">
                {step.number}
              </p>
              <h3 className="mt-10 text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#f7f1ea]">
                {step.title}
              </h3>
              <p className="mt-6 max-w-[24rem] text-base leading-7 text-white/56">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function VisualSection() {
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const secondaryShowcase = visualRef.current?.querySelector<HTMLElement>("#demo");
      const previousId = secondaryShowcase?.id;

      if (secondaryShowcase) {
        secondaryShowcase.id = "demo-visual";
      }

      return () => {
        if (secondaryShowcase && previousId) {
          secondaryShowcase.id = previousId;
        }
      };
    },
    { scope: visualRef },
  );

  return (
    <SectionFrame className="pb-20 sm:pb-28">
      <div
        data-parallax
        data-depth="18"
        className="pointer-events-none absolute left-1/2 top-20 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.08),transparent_68%)] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-4xl text-center">
          <SectionEyebrow>En acción</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.2rem,4.9vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.055em] text-[#f7f1ea]">
            Así se ve cuando alguien sí está trabajando por ti 24/7.
          </h2>
        </div>

        <div
          ref={visualRef}
          data-reveal
          data-visual-device
          className="mt-16 sm:mt-20"
        >
          <MacbookShowcase mode="simulator" />
        </div>
      </div>
    </SectionFrame>
  );
}

function UseCasesSection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="16"
        className="pointer-events-none absolute left-[8%] top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_68%)] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Casos de uso</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            Diseñado para negocios donde cada mensaje importa.
          </h2>
        </div>

        <div
          data-step-group
          className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5"
        >
          {useCases.map((useCase) => (
            <article
              key={useCase.vertical}
              data-step-card
              className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.035] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/28">
                {useCase.vertical}
              </p>
              <div className="mt-8 flex flex-col gap-5">
                <div>
                  <h4 className="text-sm font-medium tracking-wide text-[#d8ccb2]">Escenario</h4>
                  <p className="mt-1 text-base leading-snug text-[#f7f1ea]">{useCase.lead}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium tracking-wide text-[#d8ccb2]">Boreas</h4>
                  <p className="mt-1 text-base leading-snug text-white/56">{useCase.value}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export function BoreasLandingSections() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scopeRef.current) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            "[data-reveal]",
            "[data-line]",
            "[data-step-card]",
            "[data-parallax]",
            "[data-visual-device]",
          ],
          {
            clearProps: "all",
            opacity: 1,
            y: 0,
          },
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const revealTargets = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          scopeRef.current,
        );
        const lineGroups = gsap.utils.toArray<HTMLElement>(
          "[data-line-group]",
          scopeRef.current,
        );
        const stepGroups = gsap.utils.toArray<HTMLElement>(
          "[data-step-group]",
          scopeRef.current,
        );
        const parallaxTargets = gsap.utils.toArray<HTMLElement>(
          "[data-parallax]",
          scopeRef.current,
        );
        const visualDevice = scopeRef.current?.querySelector<HTMLElement>(
          "[data-visual-device]",
        );

        revealTargets.forEach((target) => {
          gsap.fromTo(
            target,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        lineGroups.forEach((group) => {
          const lines = group.querySelectorAll<HTMLElement>("[data-line]");
          gsap.fromTo(
            lines,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: group,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        stepGroups.forEach((group) => {
          const cards = group.querySelectorAll<HTMLElement>("[data-step-card]");
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.14,
              scrollTrigger: {
                trigger: group,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        parallaxTargets.forEach((target) => {
          const depth = Number(target.dataset.depth ?? 14);
          const section = target.closest<HTMLElement>("[data-parallax-section]");
          gsap.fromTo(
            target,
            { y: -depth * 0.35 },
            {
              y: depth,
              ease: "none",
              scrollTrigger: {
                trigger: section ?? target,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });

        if (visualDevice) {
           gsap.to(visualDevice, {
             y: 18,
             ease: "none",
             scrollTrigger: {
               trigger: visualDevice,
               start: "top bottom",
               end: "bottom top",
               scrub: 1,
             },
           });
        }

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500); // Give motion components time to mount
      });

      return () => {
        mm.revert();
      };
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="relative overflow-clip bg-[#0e1114] text-[#f5f1ea]">
      <ProblemSection />
      <MechanismSectionB />
      <ComparisonSection />
      <BentoGridSection />
      <HowItWorksSection />
      <VisualSection />
      <UseCasesSection />
      <TrustAndProofSection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
