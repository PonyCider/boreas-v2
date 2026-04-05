"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { MacbookShowcase } from "@/components/hero/macbook-showcase";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const mechanismLines = [
  "No necesitas más mensajes.",
  "Necesitas alguien que los maneje.",
  "Alguien que responda al instante,",
  "califique al cliente,",
  "dé seguimiento,",
  "y cierre la cita sin que tú intervengas.",
];

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

const beautyLines = [
  "Diseñado para negocios donde cada mensaje importa.",
  "Salones.",
  "Lashistas.",
  "Spas.",
  "Clínicas estéticas.",
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/30">
      {children}
    </p>
  );
}

function SectionFrame({
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

function ProblemSection() {
  return (
    <SectionFrame className="pt-32 sm:pt-40">
      <div
        data-parallax
        data-depth="14"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.12),transparent_70%)] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-5xl text-center">
          <SectionEyebrow>Problema</SectionEyebrow>
          <h2 className="mt-8 text-balance text-[clamp(2.6rem,6vw,5.35rem)] font-medium leading-[1.03] tracking-[-0.06em] text-[#f7f1ea]">
            Tu agenda no está vacía por falta de clientes.
            <br />
            <br />
            Está vacía porque nadie responde a tiempo,
            <br />
            nadie da seguimiento,
            <br />
            y cada conversación se enfría antes de cerrar.
          </h2>
        </div>
      </div>
    </SectionFrame>
  );
}

function MechanismSection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="18"
        className="pointer-events-none absolute right-[-8rem] top-12 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_68%)] blur-[130px]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Mecanismo</SectionEyebrow>
        </div>

        <div
          data-line-group
          className="mx-auto mt-10 flex max-w-3xl flex-col items-center text-center"
        >
          {mechanismLines.map((line, index) => (
            <p
              key={line}
              data-line
              className={`text-balance ${
                index < 2
                  ? "text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.04] tracking-[-0.058em] text-[#f7f1ea]"
                  : "mt-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.14] tracking-[-0.042em] text-white/72"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </SectionFrame>
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

function BeautySection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="16"
        className="pointer-events-none absolute left-[8%] top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_68%)] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Beauty</SectionEyebrow>
        </div>

        <div
          data-line-group
          className="mx-auto mt-10 flex max-w-4xl flex-col items-center text-center"
        >
          {beautyLines.map((line, index) => (
            <p
              key={line}
              data-line
              className={`text-balance ${
                index === 0
                  ? "text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.08] tracking-[-0.05em] text-[#f7f1ea]"
                  : "mt-4 text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1.02] tracking-[-0.062em] text-white/80"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function ProofSection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="14"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div
            data-reveal
            className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-7 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/28">
              Impacto
            </p>
            <p className="mt-6 text-[clamp(5.2rem,11vw,8rem)] font-medium leading-none tracking-[-0.08em] text-[#d8ccb2]">
              3x
            </p>
            <p className="mt-4 max-w-[14rem] text-sm leading-6 text-white/44">
              Más posibilidades de convertir cuando alguien responde antes de que
              el interés se enfríe.
            </p>
          </div>

          <div data-reveal className="max-w-4xl">
            <SectionEyebrow>Prueba</SectionEyebrow>
            <h2 className="mt-6 text-balance text-[clamp(2.2rem,4.7vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.055em] text-[#f7f1ea]">
              Negocios que responden en menos de 1 minuto convierten hasta{" "}
              <span className="text-[#d8ccb2]">3x</span> más.
            </h2>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-white/56">
              La mayoría responde en más de 1 hora.
            </p>
            <p className="mt-3 max-w-2xl text-xl leading-8 text-white/56">
              Ahí es donde se pierde todo.
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function FinalCtaSection() {
  return (
    <SectionFrame className="pb-32 sm:pb-40">
      <div
        data-parallax
        data-depth="20"
        className="pointer-events-none absolute left-1/2 top-10 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.1),transparent_72%)] blur-[135px]"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-4xl">
          <SectionEyebrow>Cierre</SectionEyebrow>
          <h2 className="mt-8 text-balance text-[clamp(2.5rem,5.2vw,4.8rem)] font-medium leading-[1.04] tracking-[-0.06em] text-[#f7f1ea]">
            Deja de perseguir mensajes.
            <br />
            Empieza a cerrar citas automáticamente.
          </h2>

          <a
            href="mailto:hola@boreas.ai"
            className="mt-12 inline-flex items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(216,204,178,0.2)_0%,rgba(216,204,178,0.12)_100%)] px-9 py-4.5 text-base font-medium text-[#fbfcfd] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.08),0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-300"
          >
            Agendar llamada
          </a>
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

        ScrollTrigger.refresh();
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
      <MechanismSection />
      <HowItWorksSection />
      <VisualSection />
      <BeautySection />
      <ProofSection />
      <FinalCtaSection />
    </div>
  );
}
