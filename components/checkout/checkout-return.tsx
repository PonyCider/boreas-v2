"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, CheckCircle2, Clock3, RotateCcw, ShieldCheck } from "lucide-react";

type ReturnStatus = "success" | "pending" | "error";

const content: Record<
  ReturnStatus,
  { eyebrow: string; title: string; body: string; note: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    eyebrow: "Pago enviado",
    title: "Estamos verificando tu anticipo.",
    body: "Mercado Pago nos notificará directamente. Cuando quede acreditado, te contactaremos para pedirte el audio de un minuto y coordinar el arranque.",
    note: "No necesitas enviar ningún comprobante.",
    Icon: CheckCircle2,
  },
  pending: {
    eyebrow: "Pago pendiente",
    title: "Tu operación sigue en proceso.",
    body: "Algunos medios de pago tardan en acreditarse. El proyecto comienza cuando Mercado Pago confirme el anticipo.",
    note: "Te contactaremos cuando cambie el estado.",
    Icon: Clock3,
  },
  error: {
    eyebrow: "Pago no completado",
    title: "No se realizó ningún cobro.",
    body: "Puedes regresar a los paquetes y volver a intentarlo. Tu selección de precio se recalculará antes de abrir un nuevo checkout.",
    note: "Si el problema continúa, contáctanos y te ayudamos.",
    Icon: RotateCcw,
  },
};

export function CheckoutReturn({ status }: { status: ReturnStatus }) {
  const reduceMotion = !!useReducedMotion();
  const item = content[status];
  const { Icon } = item;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#171311] px-4 py-12 text-[#fff8f2]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(226,127,98,0.24),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(226,163,60,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:32px_32px]" />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl rounded-[calc(var(--radius-xl)+0.4rem)] border border-white/12 bg-white/[0.06] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-10"
      >
        <div className="flex h-13 w-13 items-center justify-center rounded-full border border-[#f29a7e]/30 bg-[#f29a7e]/12 text-[#f29a7e] shadow-lg shadow-black/15">
          <Icon className="h-6 w-6" />
        </div>
        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f2b09b]">{item.eyebrow}</p>
        <h1 className="mt-3 max-w-xl font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.02] tracking-tight">
          {item.title}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[#cfc3ba] sm:text-base">{item.body}</p>

        <div className="mt-7 flex items-start gap-3 rounded-[var(--radius-md)] border border-white/10 bg-black/15 p-4 text-sm text-[#d9cec6]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#f29a7e]" />
          <span>{item.note}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#pricing"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#a94932] px-6 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] hover:-translate-y-px hover:bg-[#c45f44] hover:shadow-lg hover:shadow-black/20"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Volver a los paquetes
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-[#fff8f2] transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            Ir al inicio
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
