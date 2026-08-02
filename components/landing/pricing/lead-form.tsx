"use client";

import { useState, type FormEvent } from "react";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Package,
  Zap,
  Bot,
} from "lucide-react";
import { leadSchema } from "@/lib/lead-schema";
import { computePrice, formatMxn, type Selection } from "@/lib/pricing";

type Status = "idle" | "sending" | "sent" | "error";

const fieldInput =
  "w-full rounded-[var(--radius-sm)] border border-line bg-surface pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-clinical/60 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function LeadForm({ selection }: { selection: Selection | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tier = selection?.tier;
  const config = selection?.config;
  const computed = tier && config ? computePrice(tier, config) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const parsed = leadSchema.safeParse({
      ...data,
      paquete: selection?.tier.id ?? "profesional",
      express: selection?.config.express ?? false,
      ia: (selection?.config.ia && selection.tier.allowsIa) ?? false,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-xl)] border border-accent/40 bg-accent-soft/30 p-8 shadow-lg backdrop-blur-xs animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-xs">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display text-2xl font-semibold text-foreground">Listo, ya nos llegó.</h4>
            <p className="text-xs text-clinical">Hemos recibido la información de tu consultorio.</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Te escribimos hoy mismo por WhatsApp o correo para pedirte tu audio de un minuto. Es lo único que necesitamos de ti para arrancar el proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] border border-line bg-surface/80 p-6 sm:p-8 shadow-xl backdrop-blur-xs">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground">Empecemos</h3>
        <p className="text-sm leading-relaxed text-muted">
          Déjanos tus datos y te contactamos hoy mismo para coordinar el inicio.
        </p>
      </div>

      {/* Dynamic Selection Card */}
      <div className="mt-6 rounded-[var(--radius-md)] border border-accent/30 bg-accent-soft/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Package className="h-4 w-4 text-accent" />
            <span>
              Paquete: {tier?.id === "deluxe" && config?.ia ? "Deluxe+" : tier ? tier.name : "Profesional"}
            </span>
          </div>
          {computed && computed.setup !== null && (
            <div className="text-xs font-medium text-accent">
              <span>{formatMxn(computed.setup)} setup</span> · <span>{formatMxn(computed.monthly)}/mes</span>
            </div>
          )}
        </div>

        {config && (config.express || (config.ia && tier?.allowsIa)) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-accent/20 pt-2 text-xs text-clinical">
            {config.express && (
              <span className="inline-flex items-center gap-1 font-medium text-accent">
                <Zap className="h-3 w-3" /> Entrega Express
              </span>
            )}
            {config.ia && tier?.allowsIa && (
              <span className="inline-flex items-center gap-1 font-medium text-accent">
                <Bot className="h-3 w-3" /> Asistente IA
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-xs font-medium text-foreground">
              Nombre completo
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-clinical/60" />
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                placeholder="Dra. María González"
                aria-invalid={errors.nombre ? true : undefined}
                aria-describedby={errors.nombre ? "nombre-error" : undefined}
                className={fieldInput}
              />
            </div>
            {errors.nombre && (
              <p id="nombre-error" className="mt-1 text-xs font-medium text-danger">
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-foreground">
              Correo electrónico
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-clinical/60" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="maria@consultorio.mx"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={fieldInput}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs font-medium text-danger">
                {errors.email}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-xs font-medium text-foreground">
              Teléfono (10 dígitos)
            </label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-clinical/60" />
              <input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                placeholder="55 1234 5678"
                aria-invalid={errors.telefono ? true : undefined}
                aria-describedby={errors.telefono ? "telefono-error" : undefined}
                className={fieldInput}
              />
            </div>
            {errors.telefono && (
              <p id="telefono-error" className="mt-1 text-xs font-medium text-danger">
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Especialidad */}
          <div>
            <label htmlFor="especialidad" className="block text-xs font-medium text-foreground">
              Especialidad médica
            </label>
            <div className="relative mt-1">
              <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-clinical/60" />
              <input
                id="especialidad"
                name="especialidad"
                type="text"
                autoComplete="off"
                placeholder="Pediatría, Dermatología..."
                aria-invalid={errors.especialidad ? true : undefined}
                aria-describedby={errors.especialidad ? "especialidad-error" : undefined}
                className={fieldInput}
              />
            </div>
            {errors.especialidad && (
              <p id="especialidad-error" className="mt-1 text-xs font-medium text-danger">
                {errors.especialidad}
              </p>
            )}
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="mensaje" className="block text-xs font-medium text-foreground">
            ¿Algo que debamos saber de tu consulta? (opcional)
          </label>
          <div className="relative mt-1">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-clinical/60" />
            <textarea
              id="mensaje"
              name="mensaje"
              rows={3}
              placeholder="Ej. Tengo dos consultorios o necesito migrar mi dominio existente..."
              className="w-full rounded-[var(--radius-sm)] border border-line bg-surface pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-clinical/60 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Honeypot anti-spam */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent-h hover:shadow-lg disabled:opacity-60 active:scale-[0.98] sm:w-auto"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando solicitud…</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Enviar mi información</span>
            </>
          )}
        </button>

        {status === "error" && (
          <p role="alert" className="mt-3 text-xs font-medium text-danger">
            No se pudo enviar la solicitud. Por favor inténtalo de nuevo o contáctanos por WhatsApp.
          </p>
        )}
      </form>
    </div>
  );
}

