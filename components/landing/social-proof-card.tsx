import {
  IconApple,
  IconBrain,
  IconDental,
  IconStethoscope,
  IconStretching,
} from "@tabler/icons-react";

import type { SocialProofCase, SocialProofSpecialty } from "@/content/social-proof";
import { cn } from "@/lib/utils";

const specialtyPresentation: Record<
  SocialProofSpecialty,
  {
    icon: typeof IconDental;
    borderClassName: string;
    surfaceClassName: string;
    textClassName: string;
  }
> = {
  "odontologia-integral": {
    icon: IconDental,
    borderClassName: "border-t-accent",
    surfaceClassName: "bg-accent-soft",
    textClassName: "text-accent",
  },
  psicologia: {
    icon: IconBrain,
    borderClassName: "border-t-[#C39ABD]/65",
    surfaceClassName: "bg-[#C39ABD]/12",
    textClassName: "text-[#C39ABD]",
  },
  implantologia: {
    icon: IconDental,
    borderClassName: "border-t-accent",
    surfaceClassName: "bg-accent-soft",
    textClassName: "text-accent",
  },
  nutricion: {
    icon: IconApple,
    borderClassName: "border-t-[#D5AA62]/65",
    surfaceClassName: "bg-[#D5AA62]/12",
    textClassName: "text-[#D5AA62]",
  },
  ortodoncia: {
    icon: IconDental,
    borderClassName: "border-t-accent",
    surfaceClassName: "bg-accent-soft",
    textClassName: "text-accent",
  },
  fisioterapia: {
    icon: IconStretching,
    borderClassName: "border-t-[#88AD91]/65",
    surfaceClassName: "bg-[#88AD91]/12",
    textClassName: "text-[#88AD91]",
  },
  odontopediatria: {
    icon: IconDental,
    borderClassName: "border-t-accent",
    surfaceClassName: "bg-accent-soft",
    textClassName: "text-accent",
  },
  "medicina-general": {
    icon: IconStethoscope,
    borderClassName: "border-t-[#78AAB0]/65",
    surfaceClassName: "bg-[#78AAB0]/12",
    textClassName: "text-[#78AAB0]",
  },
};

export function SocialProofCard({ item }: { item: SocialProofCase }) {
  const specialty = specialtyPresentation[item.specialty];
  const SpecialtyIcon = specialty.icon;

  return (
    <article
      className={cn(
        "flex min-h-[300px] w-[min(88vw,400px)] shrink-0 flex-col rounded-[var(--radius-xl)] border border-t-2 border-line bg-elevated p-5 sm:w-[520px] sm:p-6 lg:w-[560px]",
        specialty.borderClassName
      )}
    >
      <header className="flex items-center justify-between gap-5">
        <span
          className={cn(
            "font-mono text-xs font-semibold tracking-[0.16em]",
            specialty.textClassName
          )}
        >
          {item.index}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-10 items-center justify-center rounded-[var(--radius-md)]",
            specialty.surfaceClassName,
            specialty.textClassName
          )}
        >
          <SpecialtyIcon className="size-5" stroke={1.6} />
        </span>
      </header>

      <blockquote className="mt-5 font-display text-[1.32rem] font-normal leading-[1.2] tracking-[-0.01em] text-foreground sm:text-[1.48rem]">
        “{item.quote}”
      </blockquote>

      <div className="mt-6">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-accent">
          Proyecto realizado
        </p>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground sm:text-[0.95rem]">
          {item.project}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-relaxed text-clinical">
          {item.qualitySignals.map((signal, index) => (
            <li key={signal} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">·</span>}
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-auto pt-5 text-xs font-medium text-muted sm:text-sm">{item.role}</footer>
    </article>
  );
}
