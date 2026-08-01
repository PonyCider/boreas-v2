"use client";

import { useState, type FormEvent } from "react";
import { leadSchema } from "@/lib/lead-schema";
import type { Selection } from "@/lib/pricing";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1 w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function LeadForm({ selection }: { selection: Selection | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        className="rounded-[var(--radius-xl)] border border-accent bg-accent-soft p-8"
      >
        <p className="font-display text-2xl text-foreground">Listo, ya nos llegó.</p>
        <p className="mt-2 text-sm text-muted">
          Te escribimos hoy mismo para pedirte tu audio de un minuto. Es lo único que
          necesitamos de ti para arrancar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <h3 className="font-display text-2xl font-normal text-foreground">Empecemos</h3>
      <p className="mt-2 text-sm text-muted">
        {selection
          ? `Elegiste ${selection.tier.name}${selection.config.express ? " con Entrega Express" : ""}${
              selection.config.ia && selection.tier.allowsIa ? " y Chatbot IA" : ""
            }.`
          : "Déjanos tus datos y te contactamos hoy mismo."}
      </p>

      <div className="mt-6 space-y-4">
        {(
          [
            { name: "nombre", label: "Nombre", type: "text", autoComplete: "name" },
            { name: "email", label: "Correo", type: "email", autoComplete: "email" },
            { name: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel" },
            {
              name: "especialidad",
              label: "Tu especialidad",
              type: "text",
              autoComplete: "off",
            },
          ] as const
        ).map((input) => (
          <div key={input.name}>
            <label htmlFor={input.name} className="text-sm font-medium text-foreground">
              {input.label}
            </label>
            <input
              id={input.name}
              name={input.name}
              type={input.type}
              autoComplete={input.autoComplete}
              aria-invalid={errors[input.name] ? true : undefined}
              aria-describedby={errors[input.name] ? `${input.name}-error` : undefined}
              className={field}
            />
            {errors[input.name] && (
              <p id={`${input.name}-error`} className="mt-1 text-sm text-danger">
                {errors[input.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="mensaje" className="text-sm font-medium text-foreground">
            ¿Algo que debamos saber? (opcional)
          </label>
          <textarea id="mensaje" name="mensaje" rows={3} className={field} />
        </div>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-[var(--radius-pill)] bg-accent px-5 py-3 text-sm font-medium text-[var(--bg-surface)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Enviando…" : "Enviar"}
      </button>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-danger">
          No se pudo enviar. Inténtalo otra vez en un momento.
        </p>
      )}
    </form>
  );
}
