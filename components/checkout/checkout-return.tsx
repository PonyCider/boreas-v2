"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, CheckCircle2, Clock3, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
    note: "No vuelvas a pagar mientras Mercado Pago procesa esta operación.",
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

const statusThemes: Record<
  ReturnStatus,
  {
    bgGlow: string;
    iconBorder: string;
    iconBg: string;
    iconColor: string;
    iconHalo: string;
    eyebrowColor: string;
    noteIconColor: string;
  }
> = {
  success: {
    bgGlow:
      "bg-[radial-gradient(circle_at_50%_18%,rgba(39,108,91,0.25),transparent_46%),radial-gradient(circle_at_18%_15%,rgba(226,127,98,0.22),transparent_38%),radial-gradient(circle_at_82%_78%,rgba(226,163,60,0.14),transparent_34%)]",
    iconBorder: "border-[#5FC4AA]/35",
    iconBg: "bg-[#276C5B]/22",
    iconColor: "text-[#5FC4AA]",
    iconHalo: "shadow-[0_0_40px_rgba(95,196,170,0.35)]",
    eyebrowColor: "text-[#5FC4AA]",
    noteIconColor: "text-[#5FC4AA]",
  },
  pending: {
    bgGlow:
      "bg-[radial-gradient(circle_at_50%_18%,rgba(226,163,60,0.24),transparent_46%),radial-gradient(circle_at_18%_15%,rgba(226,127,98,0.18),transparent_38%),radial-gradient(circle_at_82%_78%,rgba(226,163,60,0.14),transparent_34%)]",
    iconBorder: "border-[#EBB45A]/35",
    iconBg: "bg-[#E2A33C]/22",
    iconColor: "text-[#EBB45A]",
    iconHalo: "shadow-[0_0_40px_rgba(235,180,90,0.35)]",
    eyebrowColor: "text-[#EBB45A]",
    noteIconColor: "text-[#EBB45A]",
  },
  error: {
    bgGlow:
      "bg-[radial-gradient(circle_at_17%_14%,rgba(226,127,98,0.34),transparent_38%),radial-gradient(circle_at_82%_82%,rgba(226,163,60,0.16),transparent_34%),radial-gradient(circle_at_52%_48%,rgba(111,63,48,0.11),transparent_48%)]",
    iconBorder: "border-[#c86045]/28",
    iconBg: "bg-[#c86045]/10",
    iconColor: "text-[#ad4832]",
    iconHalo: "shadow-[0_14px_34px_rgba(169,73,50,0.16)]",
    eyebrowColor: "text-[#ad4832]",
    noteIconColor: "text-[#b44b35]",
  },
};

export function CheckoutReturn({ status, reference }: { status: ReturnStatus; reference?: string }) {
  const reduceMotion = !!useReducedMotion();
  const item = content[status];
  const theme = statusThemes[status];
  const { Icon } = item;
  const isError = status === "error";

  return (
    <main
      className={cn(
        "relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12",
        isError ? "bg-[#171311] text-[#211b17]" : "bg-[#171311] text-[#fff8f2]",
      )}
    >
      <div className={`pointer-events-none absolute inset-0 ${theme.bgGlow}`} />
      {!isError && (
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:32px_32px]" />
      )}
      {isError && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-[12%] h-[28rem] w-[28rem] rounded-full bg-[#e27f62]/18 blur-[90px]"
            animate={reduceMotion ? undefined : { x: [0, 54, 18, 0], y: [0, -26, 34, 0], scale: [1, 1.12, 0.96, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 right-[-9rem] h-[34rem] w-[34rem] rounded-full bg-[#e2a33c]/12 blur-[110px]"
            animate={reduceMotion ? undefined : { x: [0, -46, -12, 0], y: [0, 30, -18, 0], scale: [1, 0.94, 1.1, 1] }}
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(78vw,48rem)] w-[min(78vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f0b19e]/10"
            animate={reduceMotion ? undefined : { rotate: 360, scale: [1, 1.035, 1] }}
            transition={{ rotate: { duration: 36, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span className="absolute left-[12%] top-[12%] h-2 w-2 rounded-full bg-[#e27f62]/65 shadow-[0_0_22px_rgba(226,127,98,0.7)]" />
            <span className="absolute bottom-[8%] right-[19%] h-1.5 w-1.5 rounded-full bg-[#e2a33c]/55 shadow-[0_0_18px_rgba(226,163,60,0.65)]" />
          </motion.div>
        </>
      )}

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={isError && !reduceMotion ? { y: -4, scale: 1.003 } : undefined}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative z-10 w-full max-w-2xl rounded-[calc(var(--radius-xl)+0.4rem)] p-6.5 backdrop-blur-xl sm:p-10.5",
          isError
            ? "overflow-hidden border border-white/75 bg-[linear-gradient(135deg,rgba(255,253,249,0.98)_0%,rgba(251,247,240,0.97)_52%,rgba(243,232,221,0.96)_100%)] shadow-[0_38px_130px_rgba(23,19,17,0.44),0_0_0_1px_rgba(226,127,98,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] transition-[transform,box-shadow] duration-500 hover:shadow-[0_44px_145px_rgba(23,19,17,0.48),0_0_0_1px_rgba(226,127,98,0.13),inset_0_1px_0_rgba(255,255,255,0.98)]"
            : "border border-white/14 bg-white/[0.065] shadow-[0_32px_100px_rgba(0,0,0,0.42)]",
        )}
      >
        {isError && (
          <>
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d97559]/55 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e27f62]/8 blur-3xl" />
            <div className="pointer-events-none absolute inset-2 rounded-[calc(var(--radius-xl)+0.05rem)] border border-[#ad4832]/[0.055]" />
            {!reduceMotion && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 h-40 w-48 rotate-12 bg-gradient-to-r from-transparent via-white/55 to-transparent blur-xl"
                animate={{ left: ["-16rem", "calc(100% + 16rem)"] }}
                transition={{ duration: 5.8, repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }}
              />
            )}
          </>
        )}
        <div className="relative h-14 w-14">
          {isError && (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute -inset-2 rounded-full border border-dashed border-[#c86045]/25"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-[#c86045]/20"
                animate={reduceMotion ? undefined : { opacity: [0.55, 0, 0.55], scale: [1, 1.42, 1] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut" }}
              />
            </>
          )}
          <motion.div
            animate={isError && !reduceMotion ? { rotate: [0, -12, 0] } : undefined}
            transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex h-14 w-14 items-center justify-center rounded-full border ${theme.iconBorder} ${theme.iconBg} ${theme.iconColor} ${theme.iconHalo} backdrop-blur-sm`}
          >
            <Icon className="h-6.5 w-6.5" />
          </motion.div>
        </div>
        <p className={`mt-7 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${theme.eyebrowColor}`}>
          {isError && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c86045] shadow-[0_0_0_5px_rgba(200,96,69,0.1)]" />}
          {item.eyebrow}
        </p>
        <h1 className={cn(
          "mt-3 max-w-xl font-display text-[clamp(2.25rem,5.8vw,3.85rem)] font-semibold leading-[1.03] tracking-tight drop-shadow-sm",
          isError ? "text-[#211b17]" : "text-[#fff8f2]",
        )}>
          {item.title}
        </h1>
        <p className={cn(
          "mt-5 max-w-xl text-sm leading-7 sm:text-base",
          isError ? "text-[#6f645d]" : "text-[#cfc3ba]",
        )}>{item.body}</p>

        <div className={cn(
          "mt-7 flex items-start gap-3 rounded-[var(--radius-md)] p-4.5 text-sm backdrop-blur-xs",
          isError
            ? "border border-[#ddcfc4] bg-[#f4ece5] text-[#554b45] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
            : "border border-white/12 bg-black/25 text-[#d9cec6] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]",
        )}>
          <ShieldCheck className={`mt-0.5 h-5 w-5 shrink-0 ${theme.noteIconColor}`} />
          <span className="leading-relaxed">{item.note}</span>
        </div>

        {reference && (
          <div className={cn(
            "mt-3 flex flex-col gap-1 rounded-[var(--radius-sm)] px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between",
            isError ? "bg-[#211b17]/[0.045] text-[#6f645d]" : "bg-white/[0.045] text-[#bfb2a9]",
          )}>
            <span>Referencia para soporte</span>
            <code className={cn("break-all font-mono font-semibold", isError ? "text-[#332a25]" : "text-[#fff8f2]")}>{reference}</code>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
          <Link
            href="/#pricing"
            className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-[#b85038] to-[#993e28] px-6.5 text-sm font-semibold !text-[#fff8f2] shadow-lg shadow-black/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#c5583f] hover:to-[#a3432b] hover:shadow-xl hover:shadow-black/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isError && <span aria-hidden="true" className="checkout-button-sheen absolute inset-y-0 w-20 -skew-x-20 bg-gradient-to-r from-transparent via-white/22 to-transparent blur-sm" />}
            <span className="relative flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Volver a los paquetes
            </span>
          </Link>
          <Link
            href="/"
            className={cn(
              "inline-flex min-h-12 items-center justify-center rounded-full px-6.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
              isError
                ? "border border-[#cfc0b5] bg-white/55 text-[#332a25] hover:border-[#a99182] hover:bg-white focus-visible:outline-accent"
                : "border border-white/18 bg-white/[0.04] text-[#fff8f2] hover:border-white/35 hover:bg-white/[0.09] focus-visible:outline-white",
            )}
          >
            Ir al inicio
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
