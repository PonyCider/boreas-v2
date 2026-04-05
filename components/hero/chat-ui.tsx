function MessageBubble({
  align = "left",
  sender,
  text,
}: {
  align?: "left" | "right";
  sender: string;
  text: string;
}) {
  const isRight = align === "right";

  return (
    <div
      className={`flex ${isRight ? "justify-end" : "justify-start"} w-full`}
    >
      <div
        className={`max-w-[24rem] rounded-[1.5rem] px-4 py-3 ${
          isRight
            ? "rounded-br-md bg-[#d4c0a1] text-[#0f1215]"
            : "rounded-bl-md border border-white/8 bg-white/[0.04] text-[#f5f1ea]"
        }`}
      >
        <p
          className={`text-[0.68rem] uppercase tracking-[0.28em] ${
            isRight ? "text-black/55" : "text-white/35"
          }`}
        >
          {sender}
        </p>
        <p className="mt-2 text-sm leading-6">{text}</p>
      </div>
    </div>
  );
}

function QuickReply({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-left text-xs font-medium tracking-[0.08em] text-[#d8d0c4] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.08]"
    >
      {label}
    </button>
  );
}

export function ChatUI() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(24,28,33,0.98),rgba(11,13,16,0.98))]">
      <div className="flex items-center justify-between border-b border-white/6 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
            Boreas Flow
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#d4c0a1] shadow-[0_0_14px_rgba(212,192,161,0.5)]" />
            <span className="text-sm text-[#f5f1ea]">Concierge activo</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/28">
          <span className="rounded-full border border-white/8 px-3 py-1.5">
            WhatsApp
          </span>
          <span className="rounded-full border border-white/8 px-3 py-1.5">
            24/7
          </span>
        </div>
      </div>

      <div className="grid flex-1 gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col gap-4">
          <MessageBubble align="right" sender="Clienta" text="Hola, ¿tienen citas?" />
          <MessageBubble
            sender="Boreas"
            text="Sí, te muestro horarios disponibles para hoy y mañana."
          />

          <div className="flex flex-wrap gap-2 pl-1">
            <QuickReply label="Hoy 5:30 PM" />
            <QuickReply label="Mañana 11:00 AM" />
            <QuickReply label="Ver más horarios" />
          </div>

          <MessageBubble
            sender="Boreas"
            text="También puedo confirmar el servicio, enviar recordatorio y pedir anticipo si lo necesitas."
          />
        </div>

        <div className="rounded-[1.65rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
            Reserva sugerida
          </p>

          <div className="mt-4 rounded-[1.35rem] border border-[#d4c0a1]/12 bg-[#171b20] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#f5f1ea]">
                  Lifting de pestañas
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/28">
                  55 min · Confirmación automática
                </p>
              </div>
              <span className="rounded-full border border-[#d4c0a1]/18 px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#d4c0a1]">
                hoy
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "5:30 PM",
                "6:15 PM",
                "7:00 PM",
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-3.5 py-3 text-sm text-[#f5f1ea] transition-colors duration-300 hover:border-[#d4c0a1]/25 hover:bg-black/35"
                >
                  <span>{slot}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/30">
                    reservar
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/8 bg-black/18 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#f5f1ea]">Seguimiento post cita</p>
              <span className="rounded-full bg-[#d4c0a1]/12 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#d4c0a1]">
                activo
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/44">
              Mensaje automático 24 horas después para pedir reseña y ofrecer
              rebooking.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-[1.3rem] border border-white/8 bg-black/20 px-4 py-3">
          <p className="text-sm text-white/38">Responder como Boreas</p>
          <span className="rounded-full bg-[#d4c0a1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#0f1215]">
            Enviar horarios
          </span>
        </div>
      </div>
    </div>
  );
}
