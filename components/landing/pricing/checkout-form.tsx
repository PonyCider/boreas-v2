"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import ClickSpark from "@/components/ClickSpark";
import { WordRotate } from "@/components/magicui/word-rotate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkoutSchema } from "@/lib/checkout-schema";
import { leadSchema } from "@/lib/lead-schema";
import { computeCheckoutPrice, formatMxn, type Selection } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { InfoTooltip } from "./info-tooltip";

type Status = "idle" | "sending" | "sent" | "error";

const fields = [
  { name: "nombre", label: "Nombre completo", type: "text", autoComplete: "name", enterKeyHint: "next", maxLength: 80, placeholder: "Dra. María González", Icon: User },
  { name: "telefono", label: "WhatsApp", type: "tel", autoComplete: "tel", inputMode: "tel", enterKeyHint: "next", maxLength: 20, placeholder: "55 1234 5678", Icon: Phone },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", inputMode: "email", enterKeyHint: "next", maxLength: 120, placeholder: "maria@consultorio.mx", Icon: Mail },
  { name: "especialidad", label: "Especialidad médica", type: "text", enterKeyHint: "done", maxLength: 80, placeholder: "Dermatología", Icon: Stethoscope },
] as const;

type FieldName = (typeof fields)[number]["name"];
type FieldValues = Record<FieldName, string>;

const emptyValues: FieldValues = {
  nombre: "",
  telefono: "",
  email: "",
  especialidad: "",
};

const countryCodes = [
  { code: "+52", country: "México", flag: "🇲🇽" },
  { code: "+1", country: "Estados Unidos y Canadá", flag: "🇺🇸" },
  { code: "+34", country: "España", flag: "🇪🇸" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
] as const;

const specialtyExamples = [
  "Dermatología",
  "Psicología",
  "Nutrición",
  "Odontología",
  "Fisioterapia",
  "Cardiología",
];

function getContactErrors(values: FieldValues, selection: Selection, countryCode: string) {
  const contactValues = {
    ...values,
    telefono: `${countryCode}${values.telefono}`,
  };
  const organization = selection.tier.id === "organizaciones";
  const parsed = organization
    ? leadSchema.safeParse({
        ...contactValues,
        mensaje: "",
        paquete: "organizaciones",
        express: false,
        ia: selection.config.ia,
        website: "",
      })
    : checkoutSchema.safeParse({
        ...contactValues,
        attemptId: "00000000-0000-4000-8000-000000000000",
        tierId: selection.tier.id,
        express: selection.config.express,
        ia: selection.config.ia,
        website: "",
      });

  if (parsed.success) return {};

  const next: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0]);
    next[key] ??= issue.message;
  }
  return next;
}

const fieldInput =
  "peer h-12 w-full rounded-[var(--radius-sm)] border border-line bg-white/90 pl-10 pr-10 text-sm text-foreground shadow-[0_1px_2px_rgba(30,27,24,0.04)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-clinical/55 hover:border-clinical/35 hover:bg-white focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/12 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/70 aria-invalid:border-danger aria-invalid:ring-danger/12 aria-invalid:bg-danger/5";

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
  const [values, setValues] = useState<FieldValues>(emptyValues);
  const [validFields, setValidFields] = useState<Record<FieldName, boolean>>({
    nombre: false,
    telefono: false,
    email: false,
    especialidad: false,
  });
  const [countryCode, setCountryCode] = useState("+52");
  const [submitError, setSubmitError] = useState("");
  const attemptIdRef = useRef<string | null>(null);
  const reduceMotion = !!useReducedMotion();
  const organization = selection.tier.id === "organizaciones";
  const checkoutPrice = organization ? null : computeCheckoutPrice(selection.tier, selection.config);
  const completedCount = fields.filter(({ name }) => validFields[name]).length;
  const allComplete = completedCount === fields.length;
  const selectedCountry = countryCodes.find((country) => country.code === countryCode) ?? countryCodes[0];

  useEffect(() => {
    attemptIdRef.current = null;
  }, [selection.tier.id, selection.config.express, selection.config.ia]);

  function handleFieldChange(name: FieldName, value: string) {
    attemptIdRef.current = null;
    setValues((current) => ({ ...current, [name]: value }));
    setValidFields((current) =>
      current[name] ? { ...current, [name]: false } : current,
    );
    if (status === "error") setStatus("idle");
    setSubmitError("");
  }

  function handleFieldBlur(name: FieldName, value: string) {
    const nextValues = { ...values, [name]: value };
    const nextErrors = getContactErrors(nextValues, selection, countryCode);
    const message = nextErrors[name];

    setValues(nextValues);
    setValidFields((current) => ({ ...current, [name]: !message }));
    setErrors((current) => {
      const next = { ...current };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const common = {
      nombre: data.nombre,
      email: data.email,
      telefono: `${countryCode}${String(data.telefono ?? "")}`,
      especialidad: data.especialidad,
      website: data.website,
    };
    attemptIdRef.current ??= crypto.randomUUID();

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
          attemptId: attemptIdRef.current,
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
      setValidFields({
        nombre: !next.nombre,
        telefono: !next.telefono,
        email: !next.email,
        especialidad: !next.especialidad,
      });
      const firstInvalid = fields.find(({ name }) => next[name]);
      if (firstInvalid) {
        const field = form.elements.namedItem(firstInvalid.name);
        if (field instanceof HTMLElement) field.focus();
      }
      return;
    }

    setErrors({});
    setSubmitError("");
    setStatus("sending");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(organization ? "/api/lead" : "/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: controller.signal,
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
        const fallback =
          response.status === 429
            ? "Demasiados intentos seguidos. Espera un minuto y vuelve a probar."
            : response.status === 503
              ? "El pago está temporalmente en mantenimiento. Inténtalo en unos minutos."
              : response.status === 502
                ? "Mercado Pago no respondió. Tus datos siguen aquí; vuelve a intentarlo."
                : response.status === 409
                  ? "La selección cambió. Cierra este modal, vuelve a elegir el paquete e inténtalo de nuevo."
                  : "No se pudo continuar.";
        throw new Error(result?.message || fallback);
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
      const offline = !navigator.onLine;
      const timeoutError = error instanceof DOMException && error.name === "AbortError";
      setSubmitError(
        offline
          ? "No hay conexión a internet. Revisa tu red y vuelve a intentarlo."
          : timeoutError
            ? "La respuesta tardó demasiado. Vuelve a intentarlo; no se generará un cobro doble."
            : error instanceof Error
              ? error.message
              : "No pudimos continuar. Inténtalo otra vez.",
      );
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
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
        <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-[#e27f62] to-[#a94932] text-white shadow-lg shadow-accent/25">
          <CheckCircle2 className="h-6.5 w-6.5" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-accent">Solicitud recibida</p>
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
          {organization ? "Solicita una propuesta" : "Un último paso"}
        </p>
        <h3 className="mt-2 max-w-md font-display text-[clamp(1.85rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-tight text-foreground">
          {organization ? "Cuéntanos sobre tu operación." : "Coordina el inicio de tu proyecto."}
        </h3>
        <div className="mt-3 flex max-w-lg items-start gap-1.5 text-sm leading-relaxed text-muted">
          <p>
            {organization
              ? "Te contactamos hoy para entender sedes, equipo e integraciones."
              : "Estos datos nos permiten localizarte después de confirmar el anticipo."}
          </p>
          <InfoTooltip
            summary="¿Por qué pedimos estos datos?"
            paragraphs={[
              "Los usamos para identificar tu proyecto, confirmar el anticipo y contactarte para solicitar el audio inicial. No compartimos esta información.",
            ]}
          />
        </div>
      </motion.div>

      <motion.div
        variants={reduceMotion ? undefined : itemVariants}
        className="relative mt-7 rounded-[22px] bg-gradient-to-br from-white via-[#fffdfa] to-[#f7f0e9] p-px shadow-[0_22px_55px_rgba(52,39,31,0.11)]"
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={status === "sending"}
          className="relative rounded-[21px] border border-line/75 bg-white/82 p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-md sm:p-5"
        >
          <motion.div
            variants={reduceMotion ? undefined : itemVariants}
            className="mb-4 flex items-center gap-3"
          >
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eadfd7]" aria-hidden="true">
              <motion.div
                animate={{ width: `${(completedCount / fields.length) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#ba4d36] via-[#dc7659] to-[#e5a05c] shadow-[0_0_14px_rgba(210,103,76,0.4)]"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 24 }}
              />
            </div>
            <p className="min-w-[106px] text-right text-[11px] font-semibold tabular-nums text-clinical" aria-live="polite">
              {completedCount} de {fields.length} datos listos
            </p>
          </motion.div>

          <motion.div
            variants={reduceMotion ? undefined : containerVariants}
            className="grid gap-x-4 gap-y-4 sm:grid-cols-2"
          >
            {fields.map(({ name, label, Icon, ...inputProps }) => {
              const valid = validFields[name];

              return (
                <motion.div key={name} variants={reduceMotion ? undefined : itemVariants}>
                  <label htmlFor={`checkout-${name}`} className="block text-xs font-semibold text-foreground">
                    {label}
                    <span aria-hidden="true" className="ml-0.5 text-accent">*</span>
                    <span className="sr-only"> (requerido)</span>
                  </label>
                  <div className="group relative mt-1.5">
                    {name !== "telefono" && <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={valid ? "valid" : "idle"}
                        initial={reduceMotion ? false : { opacity: 0, rotate: -16, scale: 0.65 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, rotate: 12, scale: 0.65 }}
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 25 }}
                        className={cn(
                          "pointer-events-none absolute left-3.5 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center",
                          valid ? "text-[#2c7a58]" : "text-clinical/55 group-focus-within:text-accent",
                        )}
                      >
                        {valid ? <Check className="h-4 w-4 stroke-[2.5]" /> : <Icon className="h-4 w-4" />}
                      </motion.span>
                    </AnimatePresence>}

                    <AnimatePresence>
                      {valid && !reduceMotion && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ opacity: 0.65, scale: 0.92 }}
                          animate={{ opacity: 0, scale: 1.08 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                          className="pointer-events-none absolute inset-0 rounded-[var(--radius-sm)] border border-[#4d9a73]"
                        />
                      )}
                    </AnimatePresence>

                    {name === "telefono" && (
                      <Select
                        value={countryCode}
                        disabled={status === "sending"}
                        onValueChange={(value) => {
                          attemptIdRef.current = null;
                          setCountryCode(value);
                          setValidFields((current) => ({ ...current, telefono: false }));
                          setErrors((current) => {
                            const next = { ...current };
                            delete next.telefono;
                            return next;
                          });
                          setSubmitError("");
                        }}
                      >
                        <SelectTrigger
                          aria-label="Código de país"
                          className="absolute inset-y-px left-px z-20 h-[46px] w-[82px] gap-1 rounded-l-[calc(var(--radius-sm)-1px)] rounded-r-none border-0 border-r border-line/80 bg-[#faf6f1] px-2 text-xs font-semibold shadow-none hover:border-line focus-visible:z-30 focus-visible:outline-accent [&>svg]:size-3"
                        >
                          <SelectValue>
                            <span aria-hidden="true" className="text-base">{selectedCountry.flag}</span>
                            <span className="tabular-nums">{selectedCountry.code}</span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent position="popper" align="start" className="min-w-[248px] border-[#daccc1] bg-[#fffdf9]">
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <span aria-hidden="true" className="text-base">{country.flag}</span>
                              <span className="flex-1">{country.country}</span>
                              <span className="font-semibold tabular-nums text-foreground">{country.code}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {name === "especialidad" && !values.especialidad && (
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-10 z-10 flex items-center text-sm text-clinical/55">
                        <WordRotate words={specialtyExamples} />
                      </span>
                    )}

                    <input
                      id={`checkout-${name}`}
                      name={name}
                      {...inputProps}
                      placeholder={name === "especialidad" ? "" : inputProps.placeholder}
                      value={values[name]}
                      required
                      aria-invalid={errors[name] ? true : undefined}
                      aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
                      disabled={status === "sending"}
                      onChange={(event) => handleFieldChange(name, event.currentTarget.value)}
                      onBlur={(event) => handleFieldBlur(name, event.currentTarget.value)}
                      className={cn(
                        fieldInput,
                        name === "telefono" && "pl-[94px]",
                        valid && "border-[#6da88a]/70 bg-[#f7fcf9] pr-10",
                      )}
                    />

                    {name === "telefono" && (
                      <AnimatePresence initial={false}>
                        {valid && (
                          <motion.span
                            initial={reduceMotion ? false : { opacity: 0, rotate: -16, scale: 0.65 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={reduceMotion ? undefined : { opacity: 0, rotate: 12, scale: 0.65 }}
                            className="pointer-events-none absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-[#2c7a58]"
                          >
                            <Check className="h-4 w-4 stroke-[2.5]" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    )}

                    <AnimatePresence>
                      {valid && name !== "telefono" && (
                        <motion.span
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
                          className="pointer-events-none absolute right-3.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#3d8a65] shadow-[0_0_0_4px_rgba(61,138,101,0.12)]"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="mt-1.5 min-h-4">
                    <AnimatePresence mode="wait">
                      {errors[name] && (
                        <motion.p
                          id={`checkout-${name}-error`}
                          role="alert"
                          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                          className="text-xs font-medium text-danger"
                        >
                          {errors[name]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
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
                maxLength={1000}
                disabled={status === "sending"}
                placeholder="Ej. 3 sedes, 8 especialistas y conexión con nuestro CRM…"
                className="mt-1.5 w-full resize-none rounded-[var(--radius-sm)] border border-line bg-white/90 px-3.5 py-3 text-sm text-foreground shadow-[0_1px_2px_rgba(30,27,24,0.04)] transition-all duration-200 placeholder:text-clinical/50 hover:border-clinical/30 hover:bg-white focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/12 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/70"
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
            <ClickSpark
              enabled={allComplete && status === "idle" && !reduceMotion}
              sparkColor="#f6b49b"
              sparkCount={10}
              sparkRadius={28}
              sparkSize={9}
              className="rounded-[var(--radius-pill)]"
            >
              <motion.button
                type="submit"
                disabled={status === "sending"}
                aria-busy={status === "sending"}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.006 }}
                whileTap={reduceMotion ? undefined : { y: 0, scale: 0.985 }}
                className="group relative min-h-14 w-full overflow-hidden rounded-[var(--radius-pill)] border border-[#7d3023] bg-[linear-gradient(110deg,#321914_0%,#8f3828_45%,#bf543b_72%,#6d271d_100%)] px-5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(108,43,31,0.32),inset_0_1px_0_rgba(255,231,219,0.34),inset_0_-1px_0_rgba(52,15,10,0.35)] outline-none transition-[box-shadow,filter] duration-300 hover:brightness-[1.06] hover:shadow-[0_20px_46px_rgba(108,43,31,0.4),inset_0_1px_0_rgba(255,235,224,0.45)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60"
              >
                <span aria-hidden="true" className="absolute inset-px rounded-[inherit] bg-[radial-gradient(circle_at_20%_0%,rgba(255,226,211,0.22),transparent_38%)]" />
                {!reduceMotion && (
                  <span
                    aria-hidden="true"
                    className="checkout-button-sheen absolute inset-y-0 w-24 -skew-x-20 bg-gradient-to-r from-transparent via-white/24 to-transparent blur-sm"
                  />
                )}
                <span className="relative flex items-center justify-center gap-3" aria-live="polite">
                  {status === "sending" ? (
                    <>
                      <Loader2 className={cn("h-4 w-4", !reduceMotion && "animate-spin")} />
                      {organization ? "Enviando solicitud…" : "Preparando pago seguro…"}
                    </>
                  ) : (
                    <>
                      {organization
                        ? "Solicitar propuesta"
                        : `Pagar anticipo de ${formatMxn(checkoutPrice!.deposit)}`}
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/24 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </>
                  )}
                </span>
              </motion.button>
            </ClickSpark>

            <div className="mt-3.5 flex flex-col items-center gap-1 text-center text-[11px] leading-relaxed text-clinical sm:flex-row sm:justify-center sm:gap-2">
              <span>
                {organization
                  ? "Sin compromiso. Respondemos hoy."
                  : "Serás llevado al sitio seguro de Mercado Pago."}
              </span>
              <span className="hidden text-line sm:inline" aria-hidden="true">•</span>
              <Link
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-6 items-center gap-1 underline decoration-line underline-offset-2 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Aviso de privacidad
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </Link>
            </div>

            {status === "error" && (
              <p role="alert" className="mt-3.5 rounded-[var(--radius-sm)] border border-danger/20 bg-danger/8 px-3.5 py-2.5 text-center text-xs font-medium text-danger shadow-xs animate-in fade-in-0 duration-150">
                {submitError || "No pudimos continuar. Tus datos siguen aquí; inténtalo otra vez."}
              </p>
            )}
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
