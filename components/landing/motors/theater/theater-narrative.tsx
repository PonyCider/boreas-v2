import type { ConversionTheaterAct } from "@/content/motor-theater";

type TheaterNarrativeProps = {
  acts: readonly ConversionTheaterAct[];
  activeAct?: number;
  mobile?: boolean;
};

export function TheaterNarrative({
  acts,
  activeAct = 0,
  mobile = false,
}: TheaterNarrativeProps) {
  return (
    <div className={mobile ? "space-y-5" : undefined}>
      {acts.map((act, index) => {
        const active = activeAct === index;
        return (
          <article
            key={act.id}
            data-theater-act={index}
            className={
              mobile
                ? "rounded-[22px] border border-border bg-surface p-5 sm:p-7"
                : "flex min-h-[72vh] items-center py-[12vh]"
            }
          >
            <div
              className={`relative max-w-md border-l pl-6 transition-colors duration-300 motion-reduce:transition-none ${
                active ? "border-accent" : "border-white/12"
              }`}
            >
              <span
                aria-hidden
                className={`absolute -left-[5px] top-1 size-2.5 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                  active ? "bg-accent" : "bg-clinical"
                }`}
              />
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold tracking-[0.2em] text-accent">
                  {act.position}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-clinical">
                  {act.eyebrow}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.025em] text-foreground">
                {act.title}
              </h3>
              <p className="mt-5 text-[15px] leading-7 text-muted">{act.body}</p>
              <p className="mt-6 text-xs font-medium uppercase leading-5 tracking-[0.12em] text-accent">
                {act.proof}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
