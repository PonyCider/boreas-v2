"use client";

import {
  conversionTheaterActs,
  conversionTheaterCopy,
} from "@/content/motor-theater";
import { TheaterNarrative } from "./theater-narrative";
import { TheaterPreview } from "./theater-preview";
import { TheaterScene } from "./theater-scene";
import { useTheaterProgress } from "./use-theater-progress";

export function ConversionTheater() {
  const { trackRef, activeAct } = useTheaterProgress(conversionTheaterActs.length);
  const active = conversionTheaterActs[activeAct];

  return (
    <section aria-labelledby="conversion-theater-title">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#171713] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        <div aria-hidden className="absolute -right-32 -top-36 size-[30rem] rounded-full bg-accent/10 blur-[110px]" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{conversionTheaterCopy.eyebrow}</p>
          <h2 id="conversion-theater-title" className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-[-0.045em] text-foreground">
            {conversionTheaterCopy.title}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{conversionTheaterCopy.description}</p>
        </div>
      </header>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-[#171713] p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{conversionTheaterCopy.stageLabel}</p>
          <p className="hidden text-xs text-clinical sm:block">Desplázate. La página nunca captura la rueda.</p>
        </div>

        <div ref={trackRef} className="hidden lg:grid lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-10 xl:gap-14">
          <TheaterNarrative acts={conversionTheaterActs} activeAct={activeAct} />
          <div className="relative">
            <div data-theater-sticky className="sticky top-6 flex min-h-[calc(100vh-3rem)] items-center py-6">
              <div className="w-full">
                <div className="mb-3 flex items-center gap-2" aria-hidden>
                  {conversionTheaterActs.map((act, index) => (
                    <span key={act.id} className={`h-1 flex-1 rounded-full ${index <= activeAct ? "bg-accent" : "bg-white/10"}`} />
                  ))}
                </div>
                <TheaterScene act={active} actIndex={activeAct} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10 lg:hidden">
          {conversionTheaterActs.map((act, index) => (
            <div key={act.id}>
              <TheaterNarrative acts={[act]} mobile />
              <TheaterScene act={act} actIndex={index} compact />
            </div>
          ))}
        </div>
      </div>

      <div id="theater-control" className="scroll-mt-6 pt-6">
        <TheaterPreview />
      </div>
    </section>
  );
}
