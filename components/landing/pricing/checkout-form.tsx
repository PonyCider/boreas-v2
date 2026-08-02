"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import { checkoutSchema } from "@/lib/checkout-schema";
import { leadSchema } from "@/lib/lead-schema";
import { computeCheckoutPrice, formatMxn, type Selection } from "@/lib/pricing";

type Status = "idle" | "sending" | "sent" | "error";

const fields = [
  { name: "nombre", label: "Nombre completo", type: "text", autoComplete: "name", placeholder: "Dra. María González", Icon: User },
  { name: "telefono", label: "WhatsApp", type: "tel", autoComplete: "tel", placeholder: "55 1234 5678", Icon: Phone },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", placeholder: "maria@consultorio.mx", Icon: Mail },
  { name: "especialidad", label: "Especialidad médica", type: "text", autoComplete: "organization-title", placeholder: "Dermatología", Icon: Stethoscope },
] as const;

const fieldInput =
  "h-12 w-full rounded-[var(--radius-sm)] border border-line bg-white pl-10 pr-3 text-sm text-foreground shadow-[0_1px_0_rgba(30,27,24,0.03)] transition-[border-color,box-shadow,background-color] placeholder:text-clinical/50 hover:border-clinical/25 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 aria-invalid:border-danger aria-invalid:ring-danger/10";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
};

export function CheckoutForm({ selection }: { selection: Selection }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const reduceMotion = !!useReducedMotion();
  const organization = selection.tier.id === "organizaciones";
  const checkoutPrice = organization ? null : computeCheckoutPrice(selection.tier, selection.config);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const common = {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      especialidad: data.especialidad,
      website: data.website,
    };

    const parsed = organization
      ? leadSchema.safeParse({
          ...common,
          mensaje: data.mensaje,
          paquete: "organizaciones",
          express: false,
          ia: selection.config.ia,
        })
      : checkoutSchema.safeParse({
          ...common,
          tierId: selection.tier.id,
          express: selection.config.express,
          ia: selection.config.ia,
        });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch(organization ? "/api/lead" : "/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (result?.issues) {
          const next = Object.fromEntries(
            Object.entries(result.issues).flatMap(([key, messages]) =>
              Array.isArray(messages) && messages[0] ? [[key, messages[0]]] : [],
            ),
          );
          setErrors(next);
        }
        throw new Error(result?.message || "No se pudo continuar");
      }

      if (organization) {
        setStatus("sent");
        form.reset();
        return;
      }

      if (!result?.checkoutUrl) throw new Error("La respuesta no incluyó el checkout");
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        role="status"
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex min-h-[430px] flex-col justify-center p-7 sm:p-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Solicitud recibida</p>
        <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
          Hablemos de tu organización.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Revisaremos tus sedes, especialistas e integraciones. Te contactamos hoy para preparar una propuesta clara.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={reduceMotion ? undefined : containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      className="p-6 sm:p-8 lg:flex lg:h-full lg:flex-col lg:justify-center lg:p-10"
    >
      <motion.div variants={reduceMotion ? undefined : itemVariants}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
          {organization ? "Solicita una propuesta" : "Un último paso"}
        </p>
        <h3 className="mt-2 max-w-md font-display text-[clamp(1.8rem,3vw,2.45rem)] font-semibold leading-[1.06] tracking-tight text-foreground">
          {organization ? "Cuéntanos sobre tu operación." : "Coordina el inicio de tu proyecto."}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          {organization
            ? "Te contactamos hoy para entender sedes, equipo e integraciones."
            : "Estos datos nos permiten localizarte después de confirmar el anticipo."}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className="mt-7">
        <motion.div
          variants={reduceMotion ? undefined : containerVariants}
          className="grid gap-x-4 gap-y-4 sm:grid-cols-2"
        >
          {fields.map(({ name, label, Icon, ...inputProps }) => (
            <motion.div key={name} variants={reduceMotion ? undefined : itemVariants}>
              <label htmlFor={`checkout-${name}`} className="block text-xs font-semibold text-foreground">
                {label}
              </label>
              <div className="relative mt-1.5">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clinical/55" />
                <input
                  id={`checkout-${name}`}
                  name={name}
                  {...inputProps}
                  aria-invalid={errors[name] ? true : undefined}
                  aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
                  disabled={status === "sending"}
                  className={fieldInput}
                />
              </div>
              {errors[name] && (
                <p id={`checkout-${name}-error`} className="mt-1.5 text-xs font-medium text-danger">
                  {errors[name]}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {organization && (
          <motion.div variants={reduceMotion ? undefined : itemVariants} className="mt-4">
            <label htmlFor="checkout-mensaje" className="block text-xs font-semibold text-foreground">
              Sedes, especialistas o integraciones necesarias (opcional)
            </label>
            <textarea
              id="checkout-mensaje"
              name="mensaje"
              rows={3}
              disabled={status === "sending"}
              placeholder="Ej. 3 sedes, 8 especialistas y conexión con nuestro CRM…"
              className="mt-1.5 w-full resize-none rounded-[var(--radius-sm)] border border-line bg-white px-3 py-3 text-sm text-foreground transition-[border-color,box-shadow] placeholder:text-clinical/50 hover:border-clinical/25 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
          </motion.div>
        )}

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />

        <motion.div variants={reduceMotion ? undefined : itemVariants} className="mt-6">
          <button
            type="submit"
            disabled={status === "sending"}
            className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(169,73,50,0.22)] transition-[transform,background-color,box-shadow] hover:-translate-y-px hover:bg-accent-h hover:shadow-[0_16px_34px_rgba(169,73,50,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-65 active:translate-y-0"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {organization ? "Enviando solicitud…" : "Preparando pago seguro…"}
              </>
            ) : (
              <>
                {organization
                  ? "Solicitar propuesta"
                  : `Pagar anticipo de ${formatMxn(checkoutPrice!.deposit)}`}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>

          <div className="mt-3 flex flex-col items-center gap-1 text-center text-[11px] leading-relaxed text-clinical sm:flex-row sm:justify-center sm:gap-2">
            <span>
              {organization
                ? "Sin compromiso. Respondemos hoy."
                : "Serás llevado al sitio seguro de Mercado Pago."}
            </span>
            <span className="hidden text-line sm:inline">•</span>
            <Link href="/privacidad" target="_blank" className="underline decoration-line underline-offset-2 hover:text-accent">
              Aviso de privacidad
            </Link>
          </div>

          {status === "error" && (
            <p role="alert" className="mt-3 rounded-[var(--radius-sm)] bg-danger/8 px-3 py-2 text-center text-xs font-medium text-danger">
              No pudimos continuar. Revisa tu conexión e inténtalo otra vez.
            </p>
          )}
        </motion.div>
      </form>
    </motion.div>
  );
}
