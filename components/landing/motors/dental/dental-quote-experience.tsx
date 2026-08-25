"use client";

import { ArrowLeft, ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useReducer, useRef, useState } from "react";
import {
  boreasDentalQuoteV2Config,
  boreasDentalQuoteV2DemoContact,
  boreasDentalQuoteV2ExperienceCopy,
} from "@/content/cotizador-dental-v2";
import {
  createDentalQuoteV2Domain,
  type DentalPatientQuote,
  type DentalQuoteInput,
  type DentalUnavailableResult,
} from "@/lib/motors/cotizador-dental-v2";
import { DemoMotorLeadTransport } from "@/lib/motors/runtime/demo-transport";
import {
  createInitialMotorState,
  transitionMotorState,
} from "@/lib/motors/runtime/state";
import type { LeadSubmission, MotorDefinition, PatientResult } from "@/lib/motors/runtime/types";
import { DentalContactStep } from "./dental-contact-step";
import { DentalPatientResult } from "./dental-patient-result";
import { DentalSpecialistSummary } from "./dental-specialist-summary";

type DentalQuoteExperienceProps = { definition: MotorDefinition };
type CaptureStep = "treatment" | "context";

const demoTransport = new DemoMotorLeadTransport();
const motionEase = [0.16, 1, 0.3, 1] as const;

function stepMotion(reduceMotion: boolean, delay = 0) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.38,
      ease: motionEase,
      delay: reduceMotion ? 0 : delay,
    },
  } as const;
}

function isDentalResult(
  result: PatientResult,
): result is DentalPatientQuote | DentalUnavailableResult {
  return result.kind === "dental-quote" || result.kind === "dental-quote-unavailable";
}

function waitForDemoState() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, 550));
}

export function DentalQuoteExperience({ definition }: DentalQuoteExperienceProps) {
  const reduceMotion = !!useReducedMotion();
  const [state, dispatch] = useReducer(
    transitionMotorState,
    definition,
    createInitialMotorState,
  );
  const [captureStep, setCaptureStep] = useState<CaptureStep>("treatment");
  const [input, setInput] = useState<Partial<DentalQuoteInput>>({});
  const [asOf] = useState(() => new Date().toISOString().slice(0, 10));
  const introHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const contactHeadingRef = useRef<HTMLHeadingElement>(null);

  const copy = boreasDentalQuoteV2ExperienceCopy;
  const config = boreasDentalQuoteV2Config;
  const showResult =
    state.status === "resultado-paciente" ||
    state.status === "contacto" ||
    state.status === "enviando" ||
    state.status === "demo-completada" ||
    state.status === "error-recuperable" ||
    state.status === "confirmado" ||
    state.status === "pendiente" ||
    state.status === "reintentando";
  const dentalResult = showResult && isDentalResult(state.patientResult) ? state.patientResult : null;
  const selectedTreatment = config.treatments.find((item) => item.id === input.treatmentId);

  function focusAfterAction(ref: React.RefObject<HTMLElement | null>) {
    window.requestAnimationFrame(() => ref.current?.focus());
  }

  function start() {
    dispatch({ type: "START" });
    focusAfterAction(stepHeadingRef);
  }

  function updateInput(patch: Partial<DentalQuoteInput>) {
    const next = { ...input, ...patch };
    setInput(next);
    if (state.status === "captura") dispatch({ type: "CAPTURE_UPDATED", draft: next });
  }

  function continueToContext() {
    if (!input.treatmentId) return;
    setCaptureStep("context");
    focusAfterAction(stepHeadingRef);
  }

  function produceResult(candidate: Partial<DentalQuoteInput> = input) {
    if (!candidate.treatmentId || state.status !== "captura") return;
    const domain = createDentalQuoteV2Domain(config, asOf);
    const validation = domain.validate(candidate);
    if (!validation.valid) return;
    const outcome = domain.evaluate(validation.value);
    dispatch({
      type: "RESULT_READY",
      patientResult: outcome.patientResult,
      specialistSummary: outcome.specialistSummary,
    });
    focusAfterAction(resultHeadingRef);
  }

  function requestContact() {
    if (state.status !== "resultado-paciente") return;
    dispatch({ type: "REQUEST_CONTACT" });
    focusAfterAction(contactHeadingRef);
  }

  function createSubmission(): LeadSubmission | null {
    if (state.status !== "contacto") return null;
    return {
      submissionId: `demo-${crypto.randomUUID()}`,
      motorId: definition.motorId,
      motorVersion: definition.version,
      contact: {
        name: boreasDentalQuoteV2DemoContact.name,
        channel: "whatsapp",
        value: boreasDentalQuoteV2DemoContact.phone,
      },
      specialistSummary: state.specialistSummary,
      consent: {
        version: definition.consent.version,
        acceptedAt: new Date().toISOString(),
        purpose: definition.consent.purpose,
      },
    };
  }

  async function submitDemo(mode: "complete" | "error") {
    const submission = createSubmission();
    if (!submission) return;
    dispatch({ type: "SUBMIT", submission });
    focusAfterAction(contactHeadingRef);
    await waitForDemoState();
    if (mode === "error") {
      dispatch({ type: "SUBMIT_FAILED", message: copy.contact.error });
      focusAfterAction(contactHeadingRef);
      return;
    }
    const response = await demoTransport.submitLead(submission);
    if (response.status === "demo-completada") {
      dispatch({ type: "DEMO_COMPLETED", message: response.message });
      focusAfterAction(contactHeadingRef);
    }
  }

  function reset() {
    dispatch({ type: "RESET" });
    setCaptureStep("treatment");
    setInput({});
    focusAfterAction(introHeadingRef);
  }

  function retryContact() {
    if (state.status !== "error-recuperable") return;
    dispatch({ type: "RETURN_TO_CONTACT" });
    focusAfterAction(contactHeadingRef);
  }

  if (state.status === "inicio") {
    return (
      <motion.section key="intro" {...stepMotion(reduceMotion)} className="relative isolate overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-[0_28px_70px_-36px_rgb(0_0_0/0.9)] sm:p-9 lg:p-12">
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{copy.intro.eyebrow}</p>
          <h3 ref={introHeadingRef} tabIndex={-1} className="mt-4 font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.94] tracking-[-0.035em] text-foreground outline-none">
            {copy.intro.title}
          </h3>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted">{copy.intro.description}</p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2"><Clock3 aria-hidden className="size-4 text-accent" /> Menos de un minuto</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck aria-hidden className="size-4 text-mint" /> Resultado antes del contacto</span>
          </div>
          <p className="mt-6 rounded-xl border border-border bg-elevated/70 p-4 text-sm leading-6 text-foreground">{copy.intro.privacy}</p>
          <button type="button" className="btn btn-p mt-7 gap-2" onClick={start}>
            {copy.intro.cta}<ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </motion.section>
    );
  }

  if (state.status === "captura") {
    const onTreatment = captureStep === "treatment";
    return (
      <motion.section key={`capture-${captureStep}`} {...stepMotion(reduceMotion)} className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_28px_70px_-36px_rgb(0_0_0/0.9)]">
        <div className="border-b border-border px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3" aria-label={`Paso ${onTreatment ? 1 : 2} de 2`}>
            {[1, 2].map((step) => (
              <span key={step} className={`h-1.5 flex-1 rounded-full ${step <= (onTreatment ? 1 : 2) ? "bg-accent" : "bg-line"}`} />
            ))}
            <span className="text-xs tabular-nums text-clinical">{onTreatment ? "01" : "02"} / 02</span>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <h3 ref={stepHeadingRef} tabIndex={-1} className="font-display text-3xl leading-tight text-foreground outline-none sm:text-4xl">
            {onTreatment ? copy.treatment.title : copy.context.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            {onTreatment ? copy.treatment.description : copy.context.description}
          </p>

          {onTreatment ? (
            <fieldset className="mt-7">
              <legend className="sr-only">Tratamiento dental</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {config.treatments.map((treatment) => {
                  const selected = input.treatmentId === treatment.id;
                  return (
                    <label key={treatment.id} className={`group cursor-pointer rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${selected ? "border-accent bg-accent-soft" : "border-border bg-elevated hover:border-accent/40"}`}>
                      <input type="radio" name="dental-treatment" value={treatment.id} checked={selected} onChange={() => updateInput({ treatmentId: treatment.id })} className="sr-only" />
                      <span className="block font-medium leading-5 text-foreground">{treatment.label}</span>
                      <span className="mt-1.5 block text-xs leading-5 text-muted">{treatment.patientNeed}</span>
                    </label>
                  );
                })}
              </div>
              <button type="button" className="btn btn-p mt-7 w-full gap-2 sm:w-auto" disabled={!input.treatmentId} onClick={continueToContext}>
                {copy.treatment.cta}<ArrowRight aria-hidden className="size-4" />
              </button>
            </fieldset>
          ) : (
            <div className="mt-7 space-y-7">
              {config.contextFields.concern ? (
                <fieldset>
                  <legend className="text-sm font-medium text-foreground">{config.contextFields.concern.label} <span className="font-normal text-clinical">· Opcional</span></legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {config.contextFields.concern.options.map((option) => (
                      <label key={option.id} className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${input.concernId === option.id ? "border-accent bg-accent-soft text-foreground" : "border-border bg-elevated text-muted hover:text-foreground"}`}>
                        <input type="radio" name="dental-concern" value={option.id} checked={input.concernId === option.id} onChange={() => updateInput({ concernId: option.id })} className="sr-only" />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
              {config.contextFields.startHorizon ? (
                <fieldset>
                  <legend className="text-sm font-medium text-foreground">{config.contextFields.startHorizon.label} <span className="font-normal text-clinical">· Opcional</span></legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {config.contextFields.startHorizon.options.map((option) => (
                      <label key={option.id} className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${input.startHorizonId === option.id ? "border-accent bg-accent-soft text-foreground" : "border-border bg-elevated text-muted hover:text-foreground"}`}>
                        <input type="radio" name="dental-horizon" value={option.id} checked={input.startHorizonId === option.id} onChange={() => updateInput({ startHorizonId: option.id })} className="sr-only" />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="button" className="btn btn-s gap-2" onClick={() => { setCaptureStep("treatment"); focusAfterAction(stepHeadingRef); }}>
                  <ArrowLeft aria-hidden className="size-4" /> Volver
                </button>
                <button type="button" className="btn btn-s" onClick={() => { const withoutContext = { treatmentId: input.treatmentId }; setInput(withoutContext); dispatch({ type: "CAPTURE_UPDATED", draft: withoutContext }); produceResult(withoutContext); }}>{copy.context.skip}</button>
                <button type="button" className="btn btn-p flex-1 gap-2" onClick={() => produceResult()}>{copy.context.cta}<ArrowRight aria-hidden className="size-4" /></button>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    );
  }

  if (state.status === "configuración-inválida" || state.status === "urgente") return null;

  if (!dentalResult) return null;

  const contactVisible =
    state.status === "contacto" || state.status === "enviando" || state.status === "demo-completada" || state.status === "error-recuperable";

  return (
    <motion.section key="result" {...stepMotion(reduceMotion)}>
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div {...stepMotion(reduceMotion)}>
          <DentalPatientResult
            result={dentalResult}
            treatment={selectedTreatment}
            reviewedAt={config.reviewedAt}
            faceLabel={copy.faces.patient}
            onRequestContact={requestContact}
            showContactCta={state.status === "resultado-paciente"}
            headingRef={resultHeadingRef}
          />
        </motion.div>
        <motion.div {...stepMotion(reduceMotion, 0.16)}>
          <DentalSpecialistSummary
            summary={state.specialistSummary}
            faceLabel={copy.faces.specialist}
            description={copy.faces.specialistDescription}
            contactChannel={contactVisible ? boreasDentalQuoteV2DemoContact.preferredChannel : undefined}
            demoCompleted={state.status === "demo-completada"}
          />
        </motion.div>
      </div>

      {contactVisible ? (
        <div className="mt-4">
          <DentalContactStep
            state={state}
            copy={copy.contact}
            contact={boreasDentalQuoteV2DemoContact}
            consentVersion={definition.consent.version}
            onSubmit={() => void submitDemo("complete")}
            onSimulateError={() => void submitDemo("error")}
            onRetry={retryContact}
            onReset={reset}
            headingRef={contactHeadingRef}
          />
        </div>
      ) : null}
    </motion.section>
  );
}
