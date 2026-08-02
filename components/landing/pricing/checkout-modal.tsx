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
        className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[1040px] gap-0 overflow-y-auto rounded-[calc(var(--radius-xl)+0.35rem)] border-white/70 bg-[#fbf7f0] p-0 shadow-[0_30px_100px_rgba(28,20,16,0.34)] sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:max-w-[1040px] lg:overflow-hidden"
      >
        <DialogTitle className="sr-only">
          {organization ? `Solicitar propuesta para ${displayName}` : `Pagar anticipo del plan ${displayName}`}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Confirma tus datos y revisa el resumen de la selección antes de continuar.
        </DialogDescription>

        <DialogClose className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/75 shadow-sm backdrop-blur-md transition-[transform,background-color,color] hover:rotate-3 hover:bg-black/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:right-4 lg:top-4 lg:border-line lg:bg-white/80 lg:text-clinical lg:hover:bg-white lg:hover:text-foreground lg:focus-visible:outline-accent">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>

        <div className="grid min-h-[600px] lg:grid-cols-[0.42fr_0.58fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -10 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[320px] overflow-hidden bg-[#171311] p-3 sm:p-4 lg:min-h-full"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(226,127,98,0.28),transparent_36%),radial-gradient(circle_at_88%_88%,rgba(226,163,60,0.13),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />

            <TiltedCard
              containerHeight="100%"
              containerWidth="100%"
              rotateAmplitude={1.7}
              scaleOnHover={1.006}
              glareEnable={!reduceMotion}
              className="relative z-10 h-full [&>div]:border-white/10 [&>div]:bg-transparent [&>div]:shadow-none"
            >
              <div className="flex h-full min-h-[292px] flex-col rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.055] p-5 text-[#fff8f2] backdrop-blur-[2px] sm:p-6 lg:min-h-[568px] lg:p-7">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f2b09b]">
                  <Package className="h-4 w-4" />
                  Tu selección
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-4xl font-semibold tracking-tight">{displayName}</h2>
                  {tier.recommended && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e27f62] px-2.5 py-1 text-[10px] font-semibold text-white">
                      <Sparkles className="h-3 w-3" /> Recomendado
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#cfc3ba]">{tier.tagline}</p>

                {(config.express || config.ia) && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {config.express && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f29a7e]/30 bg-[#f29a7e]/10 px-3 py-1.5 text-xs font-medium text-[#ffd2c3]">
                        <Zap className="h-3.5 w-3.5" /> Express
                      </span>
                    )}
                    {config.ia && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ebb45a]/30 bg-[#ebb45a]/10 px-3 py-1.5 text-xs font-medium text-[#ffe1a8]">
                        <Bot className="h-3.5 w-3.5" /> Asistente IA
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-6 rounded-[var(--radius-md)] border border-white/12 bg-black/20 p-4 shadow-inner shadow-black/10">
                  {organization ? (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#bfb2a9]">Inversión inicial</p>
                      <p className="mt-2 font-display text-3xl font-semibold">Cotización</p>
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
                          className="mt-2 font-display text-[clamp(2.35rem,5vw,3.5rem)] font-semibold leading-none tracking-tight"
                        >
                          {formatMxn(deposit!)}
                        </motion.p>
                      </AnimatePresence>
                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
                        <div>
                          <p className="text-[#aa9f98]">Inversión inicial</p>
                          <p className="mt-1 font-semibold text-[#fff8f2]">{formatMxn(price.setup!)}</p>
                        </div>
                        <div>
                          <p className="text-[#aa9f98]">Mensualidad posterior</p>
                          <p className="mt-1 font-semibold text-[#fff8f2]">{formatMxn(price.monthly)}</p>
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
                  <div className="flex items-center gap-2">
                    {organization ? <Check className="h-4 w-4 text-[#f29a7e]" /> : <LockKeyhole className="h-4 w-4 text-[#f29a7e]" />}
                    {organization ? "Propuesta ajustada a tu operación" : "Pago procesado en Mercado Pago"}
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
