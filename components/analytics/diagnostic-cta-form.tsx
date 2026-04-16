'use client';

import { useActionState, useMemo, useRef, useState } from "react";

import { generateDiagnosticRecommendation } from "@/app/actions/diagnostic";
import {
  type BookingFlowBand,
  type DiagnosticVertical,
  type LeadVolumeBand,
  type ResponseTimeBand,
  bookingFlowOptions,
  initialDiagnosticActionState,
  leadVolumeOptions,
  responseTimeOptions,
  verticalOptions,
} from "@/app/actions/diagnostic.shared";
import { DiagnosticResultTracker, trackDiagnosticCtaClick, trackDiagnosticSubmit } from "@/components/analytics/diagnostic-analytics";
import { DiagnosticSubmitButton } from "@/components/analytics/diagnostic-submit-button";

const SOURCE = "landing-diagnostic-cta";

type DraftState = {
  vertical: DiagnosticVertical | "";
  leadVolume: LeadVolumeBand | "";
  responseTime: ResponseTimeBand | "";
  bookingFlow: BookingFlowBand | "";
};

const initialDraftState: DraftState = {
  vertical: "",
  leadVolume: "",
  responseTime: "",
  bookingFlow: "",
};

export function DiagnosticCtaForm() {
  const [state, formAction] = useActionState(generateDiagnosticRecommendation, initialDiagnosticActionState);
  const [draft, setDraft] = useState<DraftState>(initialDraftState);
  const formRef = useRef<HTMLFormElement>(null);

  const isReadyToSubmit = useMemo(() => {
    return Boolean(draft.vertical && draft.leadVolume && draft.responseTime && draft.bookingFlow);
  }, [draft.bookingFlow, draft.leadVolume, draft.responseTime, draft.vertical]);

  function updateDraft<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handlePrimaryCtaClick() {
    trackDiagnosticCtaClick();
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    formRef.current?.querySelector<HTMLInputElement>("input[name='vertical']")?.focus();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    trackDiagnosticSubmit(new FormData(event.currentTarget));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
      <div className="max-w-xl">
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/30">CTA de diagnóstico</p>
        <h2 className="mt-6 text-balance text-[clamp(2.35rem,4.8vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.05em] text-[#f7f1ea]">
          Recibe una recomendación útil antes de hablar con nosotros.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/56 sm:text-lg">
          Responde cuatro preguntas y Boreas te devuelve cuál es el cuello de botella más urgente, qué tipo de playbook debería arrancar primero y qué ajustar para que Relevo convierta mejor.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/45">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">Sin correo obligatorio</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">Menos de 30 segundos</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">Recomendación inmediata</span>
        </div>

        <button
          type="button"
          onClick={handlePrimaryCtaClick}
          className="mt-10 inline-flex items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(216,204,178,0.22)_0%,rgba(216,204,178,0.12)_100%)] px-8 py-4 text-[1rem] font-medium text-[#fbfcfd] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.08),0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#d8ccb2]/30"
        >
          Quiero mi diagnóstico express
        </button>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-7">
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit}
          className="space-y-6"
          id="boreas-diagnostic-form"
        >
          <input type="hidden" name="source" value={SOURCE} />

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium tracking-wide text-[#d8ccb2]">1. ¿En qué vertical vendes?</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {verticalOptions.map((option) => {
                const checked = draft.vertical === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer flex-col rounded-[1.4rem] border p-4 transition-colors ${
                      checked
                        ? "border-[#d8ccb2]/55 bg-[rgba(216,204,178,0.12)] text-[#f7f1ea]"
                        : "border-white/10 bg-white/[0.02] text-white/62 hover:border-white/18 hover:bg-white/[0.05]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="vertical"
                      value={option.value}
                      checked={checked}
                      onChange={() => updateDraft("vertical", option.value)}
                      className="sr-only"
                      required
                    />
                    <span className="text-base font-medium">{option.label}</span>
                    <span className="mt-2 text-sm leading-6">{option.hint}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-white/64">
              <span className="font-medium tracking-wide text-[#d8ccb2]">2. ¿Cuántos leads entran?</span>
              <select
                name="leadVolume"
                value={draft.leadVolume}
                onChange={(event) => updateDraft("leadVolume", event.target.value as LeadVolumeBand)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-4 text-sm text-[#f7f1ea] outline-none transition-colors focus:border-[#d8ccb2]/45"
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {leadVolumeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/64">
              <span className="font-medium tracking-wide text-[#d8ccb2]">3. ¿Qué tan rápido responden?</span>
              <select
                name="responseTime"
                value={draft.responseTime}
                onChange={(event) => updateDraft("responseTime", event.target.value as ResponseTimeBand)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-4 text-sm text-[#f7f1ea] outline-none transition-colors focus:border-[#d8ccb2]/45"
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {responseTimeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/64">
              <span className="font-medium tracking-wide text-[#d8ccb2]">4. ¿Cómo operan hoy?</span>
              <select
                name="bookingFlow"
                value={draft.bookingFlow}
                onChange={(event) => updateDraft("bookingFlow", event.target.value as BookingFlowBand)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#0f0f10] px-4 text-sm text-[#f7f1ea] outline-none transition-colors focus:border-[#d8ccb2]/45"
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {bookingFlowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-white/45">
              Esta base no guarda datos ni dispara integraciones externas. Solo calcula una recomendación inicial y deja eventos listos para enganchar analytics después.
            </p>
            <DiagnosticSubmitButton disabled={!isReadyToSubmit} />
          </div>

          {state.message && state.status === "error" ? (
            <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {state.message}
            </p>
          ) : null}
        </form>

        <DiagnosticResultTracker recommendation={state.recommendation} source={SOURCE} />

        {state.recommendation ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-[1.75rem] border border-[#d8ccb2]/20 bg-[linear-gradient(180deg,rgba(216,204,178,0.12)_0%,rgba(255,255,255,0.02)_100%)] p-5 text-left shadow-[0_20px_80px_rgba(0,0,0,0.18)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white/42">
                Prioridad {state.recommendation.priority}
              </span>
              <span className="rounded-full border border-[#d8ccb2]/20 bg-[rgba(216,204,178,0.08)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-[#d8ccb2]">
                {state.recommendation.focusLabel}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em] text-[#f7f1ea]">
              {state.recommendation.headline}
            </h3>
            <p className="mt-3 text-base leading-7 text-white/62">{state.recommendation.summary}</p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/32">Playbook recomendado</p>
              <p className="mt-2 text-base font-medium text-[#f7f1ea]">{state.recommendation.playbookTitle}</p>
            </div>

            <div className="mt-5">
              <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/32">Qué haría Boreas primero</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-white/58">
                {state.recommendation.nextSteps.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#d8ccb2]" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
