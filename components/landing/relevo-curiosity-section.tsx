import { SectionFrame } from "./boreas-landing-sections";

export function RelevoCuriositySection() {
  return (
    <SectionFrame id="relevo" className="border-t border-line pb-24 sm:pb-28">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div className="flex flex-col items-start text-left">
            <p className="mb-4 text-sm font-medium text-accent">
              Siguiente capa
            </p>
            <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground">
              ¿Ya tienes tu página web?
            </h2>
            <span className="mt-4 block text-lg text-clinical">
              Descubre cómo automatizar tus mensajes y agenda.
            </span>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Relevo es el asistente de IA de Boreas para WhatsApp. Contesta, califica y agenda cuando tu consultorio ya tiene demanda y necesita menos trabajo manual.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://relevo.chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md border border-line px-6 py-3 text-base font-semibold text-foreground transition-all duration-300 hover:border-accent hover:text-accent active:translate-y-px"
              >
                Ir a Relevo.chat
              </a>
            </div>
          </div>

          <div className="w-full border-l border-accent/40 pl-6">
            <p className="text-sm font-medium text-accent">Ejemplo de WhatsApp</p>
            <div className="mt-6 space-y-5 text-base leading-relaxed">
              <p className="text-clinical">Paciente: ¿Tiene cita disponible mañana?</p>
              <p className="text-foreground">Relevo: Hay espacios a las 10:00 AM y 4:30 PM. ¿Cuál prefieres?</p>
              <p className="text-clinical">Paciente: A las 10:00 AM está perfecto.</p>
              <p className="text-foreground">Relevo: Listo. Te envié la confirmación por este medio.</p>
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
