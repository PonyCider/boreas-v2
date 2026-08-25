import { AlertTriangle, Check, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode, RefObject } from "react";
import type { MotorRuntimeState } from "@/lib/motors/runtime/state";

type ContactCopy = {
  title: string;
  description: string;
  demoNotice: string;
  consent: string;
  submit: string;
  submitting: string;
  completed: string;
  completedDescription: string;
  error: string;
  retry: string;
};

type DemoContact = {
  name: string;
  phone: string;
  email: string;
  preferredChannel: string;
};

type DentalContactStepProps = {
  state: Extract<
    MotorRuntimeState,
    { status: "contacto" | "enviando" | "demo-completada" | "error-recuperable" }
  >;
  copy: ContactCopy;
  contact: DemoContact;
  consentVersion: string;
  onSubmit: () => void;
  onSimulateError: () => void;
  onRetry: () => void;
  onReset: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

const ease = [0.16, 1, 0.3, 1] as const;

function contactMotion(reduceMotion: boolean) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.32, ease },
  } as const;
}

function DemoField({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-clinical">
        {icon}
        <span>{label}</span>
        <span className="ml-auto rounded-full bg-elevated px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em]">
          Dato de ejemplo
        </span>
      </div>
      <p className="mt-2 break-words text-sm text-foreground">{value}</p>
    </div>
  );
}

export function DentalContactStep({
  state,
  copy,
  contact,
  consentVersion,
  onSubmit,
  onSimulateError,
  onRetry,
  onReset,
  headingRef,
}: DentalContactStepProps) {
  const reduceMotion = !!useReducedMotion();

  if (state.status === "enviando") {
    return (
      <motion.section key="sending" {...contactMotion(reduceMotion)} className="rounded-[22px] border border-border bg-elevated p-6 text-center sm:p-8" aria-live="polite">
        <span aria-hidden className="mx-auto block size-8 animate-spin rounded-full border-2 border-accent/25 border-t-accent motion-reduce:animate-none" />
        <h3 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-2xl text-foreground outline-none">{copy.submitting}</h3>
        <p className="mt-2 text-sm text-muted">Adaptador local. Sin red y sin persistencia.</p>
      </motion.section>
    );
  }

  if (state.status === "demo-completada") {
    return (
      <motion.section key="complete" {...contactMotion(reduceMotion)} className="rounded-[22px] border border-mint/30 bg-mint/10 p-6 text-center sm:p-8" aria-live="polite">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-mint text-background">
          <Check aria-hidden className="size-6" />
        </span>
        <h3 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-3xl text-foreground outline-none">
          {copy.completed}
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{copy.completedDescription}</p>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-clinical">{state.message}</p>
        <button type="button" className="btn btn-s mt-6" onClick={onReset}>
          Reiniciar cotizador
        </button>
      </motion.section>
    );
  }

  if (state.status === "error-recuperable") {
    return (
      <motion.section key="error" {...contactMotion(reduceMotion)} className="rounded-[22px] border border-danger/30 bg-danger/10 p-6 sm:p-8" role="alert">
        <div className="flex gap-4">
          <AlertTriangle aria-hidden className="mt-1 size-6 shrink-0 text-danger" />
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl text-foreground outline-none">{copy.error}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">No se perdió el rango ni el resumen preparado.</p>
          </div>
        </div>
        <button type="button" className="btn btn-s mt-6 w-full sm:w-auto" onClick={onRetry}>
          {copy.retry}
        </button>
      </motion.section>
    );
  }

  return (
    <motion.section key="contact" {...contactMotion(reduceMotion)} className="rounded-[22px] border border-border bg-elevated p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Contacto después del resultado</p>
          <h3 ref={headingRef} tabIndex={-1} className="mt-3 font-display text-3xl leading-tight text-foreground outline-none">
            {copy.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{copy.description}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-2 text-xs font-medium text-mint">
          <ShieldCheck aria-hidden className="size-4" /> Demo sin envío
        </span>
      </div>

      <p className="mt-5 rounded-xl border border-accent/20 bg-accent-soft p-4 text-sm leading-6 text-foreground">
        {copy.demoNotice}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <DemoField label="Nombre" value={contact.name} icon={<MessageCircle aria-hidden className="size-4" />} />
        <DemoField label="Teléfono" value={contact.phone} icon={<Phone aria-hidden className="size-4" />} />
        <DemoField label="Correo" value={contact.email} icon={<Mail aria-hidden className="size-4" />} />
        <DemoField label="Canal preferido" value={contact.preferredChannel} icon={<MessageCircle aria-hidden className="size-4" />} />
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-border bg-background p-4">
        <span aria-hidden className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-mint bg-mint text-background">
          <Check className="size-3.5" />
        </span>
        <div>
          <p className="text-sm leading-6 text-foreground">{copy.consent}</p>
          <p className="mt-1 text-xs text-clinical">Consentimiento de demostración · versión {consentVersion}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn btn-p flex-1" onClick={onSubmit}>{copy.submit}</button>
        <button type="button" className="btn btn-s" onClick={onSimulateError}>Probar error recuperable</button>
      </div>
    </motion.section>
  );
}
