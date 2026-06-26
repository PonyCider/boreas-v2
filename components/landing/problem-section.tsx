"use client";

import Image from "next/image";
import { SectionFrame } from "./boreas-landing-sections";
import { painPoints, problemStats } from "@/content/boreas-home";

export function ProblemSection() {
  return (
    <SectionFrame id="problema" className="border-t border-line bg-background">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <h2 className="text-balance text-[clamp(2.2rem,5vw,4.75rem)] font-semibold leading-none text-foreground">
              Tus pacientes ya están buscando.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-clinical">
              La pregunta no es si necesitan encontrarte. Es si llegan a un lugar que les da confianza suficiente para escribirte hoy.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {problemStats.map((stat) => (
              <div key={stat.value} className="border-t border-line pt-5">
                <span className="block font-mono text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none text-accent">
                  {stat.value}
                </span>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid items-center gap-10 border-t border-line pt-14 lg:grid-cols-[1fr_0.78fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <h3 className="text-balance text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-tight text-foreground">
              Tu agenda no está vacía por falta de pacientes.
            </h3>
            <p className="mt-6 max-w-2xl border-l-2 border-danger pl-5 text-lg leading-relaxed text-clinical">
              Está vacía porque los pacientes llegan, preguntan por WhatsApp y mueren esperando mientras tu asistente contesta mensajes de curiosos.
            </p>

            <div className="mt-9 divide-y divide-line border-y border-line">
              {painPoints.map((point) => (
                <p key={point} className="py-5 text-base leading-relaxed text-muted">
                  {point}
                </p>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-lg border border-line">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=85&w=1200&auto=format&fit=crop"
                alt="Consultorio médico privado preparado para recibir pacientes"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
