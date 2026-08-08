"use client";

import type { RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, Check, Clock3, LockKeyhole, Package, Sparkles, X, Zap } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TiltedCard } from "@/components/ui/tilted-card";
import { computePrice, formatMxn, type Selection } from "@/lib/pricing";
import { CheckoutForm } from "./checkout-form";
import { InfoTooltip } from "./info-tooltip";

export function CheckoutModal({
  selection,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  selection: Selection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const reduceMotion = !!useReducedMotion();

  if (!selection) return null;

  const { tier, config } = selection;
  const price = computePrice(tier, config);
  const organization = tier.id === "organizaciones";
  const displayName = tier.id === "deluxe" && config.ia ? "Deluxe+" : tier.name;
  const delivery = config.express && tier.delivery.express ? tier.delivery.express : tier.delivery.base;
  const deposit = price.setup === null ? null : price.setup / 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
        className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[1040px] gap-0 overflow-y-auto rounded-[calc(var(--radius-xl)+0.35rem)] border border-white/80 bg-[#fbf7f0] p-0 shadow-[0_32px_110px_rgba(23,19,17,0.36)] backdrop-blur-xl sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:max-w-[1040px] lg:overflow-hidden"
      >
        <DialogTitle className="sr-only">
          {organization ? `Solicitar propuesta para ${displayName}` : `Pagar anticipo del plan ${displayName}`}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Confirma tus datos y revisa el resumen de la selección antes de continuar.
        </DialogDescription>

        <DialogClose className="absolute right-3.5 top-3.5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/85 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:right-4 lg:top-4 lg:border-line/60 lg:bg-white/85 lg:text-clinical lg:shadow-sm lg:hover:border-clinical/30 lg:hover:bg-white lg:hover:text-foreground lg:focus-visible:outline-accent">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>

        <div className="grid min-h-[600px] lg:grid-cols-[0.43fr_0.57fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -10 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[320px] overflow-hidden bg-[#171311] p-3.5 sm:p-4.5 lg:min-h-full"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(226,127,98,0.32),transparent_38%),radial-gradient(circle_at_88%_88%,rgba(226,163,60,0.16),transparent_32%)]" />
            <div className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[#e27f62]/10 blur-3xl" />

            <TiltedCard
              containerHeight="100%"
              containerWidth="100%"
              rotateAmplitude={1.5}
              scaleOnHover={1.003}
              glareEnable={!reduceMotion}
              className="group relative z-10 h-full [&>div]:border-white/10 [&>div]:bg-transparent [&>div]:shadow-none"
            >
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ffc7b5]/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex h-full min-h-[292px] flex-col rounded-[var(--radius-xl)] border border-white/12 bg-gradient-to-b from-white/[0.075] to-white/[0.035] p-5.5 text-[#fff8f2] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 group-hover:border-[#f2b09b]/25 group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_22px_58px_rgba(0,0,0,0.24)] sm:p-6.5 lg:min-h-[568px] lg:p-7.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#f2b09b]">
                  <Package className="h-4 w-4 shrink-0 text-[#f29a7e]" />
                  Tu selección
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-4xl font-semibold tracking-tight text-[#fff8f2] drop-shadow-sm">{displayName}</h2>
                  {tier.recommended && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e27f62] to-[#c9633c] px-3 py-1 text-[10px] font-semibold text-white shadow-sm">
                      <Sparkles className="h-3 w-3" /> Recomendado
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#cfc3ba]">{tier.tagline}</p>

                {(config.express || config.ia) && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {config.express && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f29a7e]/35 bg-[#f29a7e]/12 px-3 py-1.5 text-xs font-medium text-[#ffd2c3] shadow-xs backdrop-blur-xs">
                        <Zap className="h-3.5 w-3.5 text-[#f29a7e]" /> Express
                      </span>
                    )}
                    {config.ia && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ebb45a]/35 bg-[#ebb45a]/12 px-3 py-1.5 text-xs font-medium text-[#ffe1a8] shadow-xs backdrop-blur-xs">
                        <Bot className="h-3.5 w-3.5 text-[#ebb45a]" /> Asistente IA
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-6 rounded-[var(--radius-md)] border border-white/14 bg-black/25 p-4.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                  {organization ? (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#bfb2a9]">Inversión inicial</p>
                      <p className="mt-2 font-display text-3xl font-semibold text-[#fff8f2]">Cotización</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f2b09b]">
                        Anticipo de hoy
                        <InfoTooltip
                          dark
                          summary="¿Qué estás pagando hoy?"
                          paragraphs={["Es el 50% de la inversión inicial, incluyendo Express e instalación de IA si los elegiste. La mensualidad no se cobra aquí."]}
                        />
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={deposit}
                          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                          className="mt-2 font-display text-[clamp(2.4rem,5.2vw,3.6rem)] font-semibold leading-none tabular-nums tracking-tight text-[#fff8f2] drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                        >
                          {formatMxn(deposit!)}
                        </motion.p>
                      </AnimatePresence>
                      <div className="mt-4.5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
                        <div>
                          <p className="text-[#aa9f98]">Inversión inicial</p>
                          <p className="mt-1 font-semibold tabular-nums text-[#fff8f2]">{formatMxn(price.setup!)}</p>
                        </div>
                        <div>
                          <p className="text-[#aa9f98]">Mensualidad posterior</p>
                          <p className="mt-1 font-semibold tabular-nums text-[#fff8f2]">{formatMxn(price.monthly)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-[#cfc3ba]">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#f29a7e]" />
                  <span>Entrega estimada: <strong className="font-semibold text-[#fff8f2]">{delivery}</strong></span>
                </div>

                <div className="mt-auto hidden border-t border-white/10 pt-5 text-xs text-[#bfb2a9] lg:block">
                  <div className="flex items-center gap-2.5">
                    {organization ? <Check className="h-4 w-4 shrink-0 text-[#f29a7e]" /> : <LockKeyhole className="h-4 w-4 shrink-0 text-[#f29a7e]" />}
                    <span>{organization ? "Propuesta ajustada a tu operación" : "Pago procesado en Mercado Pago"}</span>
                  </div>
                </div>
              </div>
            </TiltedCard>
          </motion.div>

          <CheckoutForm
            key={`${tier.id}-${config.express}-${config.ia}`}
            selection={selection}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
