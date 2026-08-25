"use client";

import { useReducer } from "react";
import { contractDemoDomainRegistry } from "@/lib/motors/preview/contract-demo-domain";
import { evaluateMotorDomain } from "@/lib/motors/runtime/domain";
import { DemoMotorLeadTransport } from "@/lib/motors/runtime/demo-transport";
import {
  createInitialMotorState,
  transitionMotorState,
} from "@/lib/motors/runtime/state";
import type {
  LeadSubmission,
  MotorDefinition,
} from "@/lib/motors/runtime/types";

type ContractDemoViewProps = {
  definition: MotorDefinition;
};

const demoTransport = new DemoMotorLeadTransport();

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
      {status}
    </span>
  );
}

export function ContractDemoView({ definition }: ContractDemoViewProps) {
  const [state, dispatch] = useReducer(
    transitionMotorState,
    definition,
    createInitialMotorState,
  );

  const showResult =
    state.status === "resultado-paciente" ||
    state.status === "contacto" ||
    state.status === "enviando" ||
    state.status === "confirmado" ||
    state.status === "demo-completada" ||
    state.status === "pendiente" ||
    state.status === "reintentando" ||
    state.status === "error-recuperable";

  const produceResult = (valid: boolean) => {
    const evaluation = evaluateMotorDomain(
      contractDemoDomainRegistry,
      definition,
      valid ? { intent: "valuation" } : { intent: "unknown" },
    );

    if (!evaluation.valid) {
      dispatch({
        type: "CONFIG_INVALID",
        reason: evaluation.issues.join(" "),
      });
      return;
    }

    dispatch({
      type: "RESULT_READY",
      patientResult: evaluation.outcome.patientResult,
      specialistSummary: evaluation.outcome.specialistSummary,
    });
  };

  const runDemoTransport = async () => {
    if (state.status !== "contacto") return;

    const submission: LeadSubmission = {
      submissionId: `demo-${crypto.randomUUID()}`,
      motorId: definition.motorId,
      motorVersion: definition.version,
      contact: {
        name: "Paciente de demostración",
        channel: "email",
        value: "demo@example.invalid",
      },
      specialistSummary: state.specialistSummary,
      consent: {
        version: definition.consent.version,
        acceptedAt: new Date().toISOString(),
        purpose: definition.consent.purpose,
      },
    };

    dispatch({ type: "SUBMIT", submission });
    const result = await demoTransport.submitLead(submission);

    if (result.status === "demo-completada") {
      dispatch({ type: "DEMO_COMPLETED", message: result.message });
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-2xl shadow-black/20">
      <header className="flex flex-col gap-5 border-b border-border px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {definition.label}
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            Runtime aislado
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {definition.promise} Esta ruta no reemplaza todavía ningún motor público.
          </p>
        </div>
        <StatusBadge status={state.status} />
      </header>

      <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-border bg-elevated p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Estado y control
          </p>

          {state.status === "inicio" && (
            <div className="mt-5 space-y-4">
              <p className="text-sm leading-6 text-muted">
                Comienza con una fixture sintética. No hay campos para escribir datos reales.
              </p>
              <button className="btn btn-p w-full" onClick={() => dispatch({ type: "START" })}>
                Iniciar demo segura
              </button>
            </div>
          )}

          {state.status === "captura" && (
            <div className="mt-5 space-y-3">
              <p className="text-sm leading-6 text-muted">
                Fixture: intención simulada de solicitar una valoración.
              </p>
              <button className="btn btn-p w-full" onClick={() => produceResult(true)}>
                Derivar las dos caras
              </button>
              <button className="btn btn-s w-full" onClick={() => produceResult(false)}>
                Probar configuración inválida
              </button>
              <button
                className="btn btn-s w-full"
                onClick={() =>
                  dispatch({
                    type: "URGENT_RESULT",
                    patientResult: {
                      kind: "urgent-guidance",
                      title: "El flujo comercial se detiene",
                      summary:
                        "Una señal urgente debe mostrar recursos de atención antes que cualquier CTA.",
                    },
                    resources: [
                      "En un motor clínico real se mostraría el recurso local aprobado.",
                    ],
                  })
                }
              >
                Probar interrupción urgente
              </button>
            </div>
          )}

          {state.status === "resultado-paciente" && (
            <div className="mt-5 space-y-4">
              <p className="text-sm leading-6 text-muted">
                El valor ya fue entregado. El contacto es el siguiente paso, no el peaje de entrada.
              </p>
              <button
                className="btn btn-p w-full"
                onClick={() => dispatch({ type: "REQUEST_CONTACT" })}
              >
                Continuar con contacto sintético
              </button>
            </div>
          )}

          {state.status === "contacto" && (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-border bg-background p-4 text-sm leading-6">
                <p className="font-semibold text-foreground">Fixture no editable</p>
                <p className="text-muted">Paciente de demostración</p>
                <p className="text-muted">demo@example.invalid</p>
              </div>
              <p className="text-xs leading-5 text-muted">
                Consentimiento {definition.consent.version}: {definition.consent.purpose}
              </p>
              <button className="btn btn-p w-full" onClick={runDemoTransport}>
                Probar transporte demo
              </button>
            </div>
          )}

          {state.status === "enviando" && (
            <p className="mt-5 text-sm text-muted" role="status">
              Ejecutando el adaptador local…
            </p>
          )}

          {state.status === "demo-completada" && (
            <div className="mt-5 space-y-4" aria-live="polite">
              <p className="text-sm font-semibold text-mint">{state.message}</p>
              <button className="btn btn-s w-full" onClick={() => dispatch({ type: "RESET" })}>
                Reiniciar demo
              </button>
            </div>
          )}

          {state.status === "urgente" && (
            <div className="mt-5 space-y-4" role="alert">
              <p className="font-semibold text-danger">{state.patientResult.title}</p>
              <p className="text-sm leading-6 text-muted">{state.patientResult.summary}</p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
                {state.resources.map((resource) => <li key={resource}>{resource}</li>)}
              </ul>
              <button className="btn btn-s w-full" onClick={() => dispatch({ type: "RESET" })}>
                Reiniciar demo
              </button>
            </div>
          )}

          {state.status === "configuración-inválida" && (
            <div className="mt-5 space-y-4" role="alert">
              <p className="font-semibold text-danger">No se inventó un resultado</p>
              <p className="text-sm leading-6 text-muted">{state.reason}</p>
              <button className="btn btn-s w-full" onClick={() => dispatch({ type: "RESET" })}>
                Reiniciar demo
              </button>
            </div>
          )}

          {(state.status === "confirmado" ||
            state.status === "pendiente" ||
            state.status === "reintentando" ||
            state.status === "error-recuperable") && (
            <p className="mt-5 text-sm text-muted">
              Este estado pertenece al contrato de producción y no lo genera el adaptador demo.
            </p>
          )}
        </div>

        <div>
          {!showResult && state.status !== "urgente" && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-border bg-background p-8 text-center">
              <p className="max-w-sm text-sm leading-6 text-muted">
                Las dos caras aparecerán aquí después de que el dominio valide la fixture.
              </p>
            </div>
          )}

          {showResult && (
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-border bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Lo que ve el paciente
                </p>
                <h2 className="mt-4 font-display text-2xl text-foreground">
                  {state.patientResult.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {state.patientResult.summary}
                </p>
                {state.patientResult.disclaimer && (
                  <p className="mt-4 text-xs leading-5 text-clinical">
                    {state.patientResult.disclaimer}
                  </p>
                )}
              </article>

              <article className="rounded-2xl border border-accent/30 bg-accent-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Lo que recibe el especialista
                </p>
                <h2 className="mt-4 font-display text-2xl text-foreground">
                  {state.specialistSummary.title}
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                  {state.specialistSummary.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-semibold leading-6 text-foreground">
                  {state.specialistSummary.nextStep}
                </p>
              </article>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
