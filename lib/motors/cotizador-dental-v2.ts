import type {
  DomainValidationResult,
  MotorDomain,
} from "./runtime/domain";
import type {
  MotorIdentity,
  PatientResult,
  SpecialistSummary,
} from "./runtime/types";

export const dentalQuoteV2Identity = {
  motorId: "cotizador-dental",
  version: "2.0.0",
} as const satisfies MotorIdentity;

export type DentalQuoteOption = {
  id: string;
  label: string;
};

export type DentalQuoteContextField = {
  label: string;
  options: readonly DentalQuoteOption[];
};

export type DentalTreatmentV2 = {
  id: string;
  label: string;
  patientNeed: string;
  range: {
    min: number;
    max: number;
  };
  visits: string;
  inclusions: readonly string[];
  priceFactors: readonly string[];
  note?: string;
};

export type DentalQuoteConfig = {
  clientId: string;
  locale: string;
  currency: string;
  reviewedAt: string;
  validUntil: string;
  copy: {
    resultEyebrow: string;
    ctaLabel: string;
    disclaimer: string;
    specialistNextStep: string;
  };
  contextFields: {
    concern?: DentalQuoteContextField;
    startHorizon?: DentalQuoteContextField;
  };
  treatments: readonly DentalTreatmentV2[];
};

export type DentalQuoteInput = {
  treatmentId: string;
  concernId?: string;
  startHorizonId?: string;
};

export type DentalQuoteConfigValidation =
  | {
      valid: true;
      status: "valid";
      value: DentalQuoteConfig;
    }
  | {
      valid: false;
      status: "invalid" | "expired";
      issues: readonly string[];
    };

export type DentalPatientQuote = PatientResult & {
  kind: "dental-quote";
  quote: {
    treatmentId: string;
    formattedRange: string;
    visits: string;
    inclusions: readonly string[];
    priceFactors: readonly string[];
  };
  ctaLabel: string;
};

export type DentalUnavailableResult = PatientResult & {
  kind: "dental-quote-unavailable";
};

export type DentalQuoteOutcome = {
  status: "quoted" | "unavailable";
  configStatus: "valid" | "invalid" | "expired";
  patientResult: DentalPatientQuote | DentalUnavailableResult;
  specialistSummary: SpecialistSummary;
};

const safeUnavailableResult: DentalUnavailableResult = {
  kind: "dental-quote-unavailable",
  title: "Este rango necesita revisión",
  summary:
    "El consultorio debe confirmar su configuración antes de publicar una cifra.",
  disclaimer: "No se mostró un precio desactualizado ni estimado.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(isNonEmptyString)
  );
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function validateOptions(
  value: unknown,
  fieldName: string,
  issues: string[],
) {
  if (!isRecord(value) || !isNonEmptyString(value.label)) {
    issues.push(`${fieldName} necesita una etiqueta.`);
    return;
  }
  if (!Array.isArray(value.options) || value.options.length === 0) {
    issues.push(`${fieldName} necesita opciones.`);
    return;
  }

  const ids = new Set<string>();
  for (const [index, option] of value.options.entries()) {
    if (
      !isRecord(option) ||
      !isNonEmptyString(option.id) ||
      !isNonEmptyString(option.label)
    ) {
      issues.push(`${fieldName}.options[${index}] es inválida.`);
      continue;
    }
    if (ids.has(option.id)) {
      issues.push(`${fieldName} repite la opción ${option.id}.`);
    }
    ids.add(option.id);
  }
}

export function validateDentalQuoteConfig(
  config: unknown,
  asOf: string,
): DentalQuoteConfigValidation {
  const issues: string[] = [];

  if (!isIsoDate(asOf)) {
    return {
      valid: false,
      status: "invalid",
      issues: ["La fecha de evaluación debe usar YYYY-MM-DD."],
    };
  }
  if (!isRecord(config)) {
    return {
      valid: false,
      status: "invalid",
      issues: ["La configuración dental debe ser un objeto."],
    };
  }

  for (const key of ["clientId", "locale", "currency"] as const) {
    if (!isNonEmptyString(config[key])) {
      issues.push(`${key} es obligatorio.`);
    }
  }

  if (
    isNonEmptyString(config.currency) &&
    !/^[A-Z]{3}$/.test(config.currency)
  ) {
    issues.push("currency debe ser un código ISO 4217 de tres letras.");
  }

  if (isNonEmptyString(config.locale) && isNonEmptyString(config.currency)) {
    try {
      new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.currency,
      });
    } catch {
      issues.push("locale o currency no son compatibles con Intl.NumberFormat.");
    }
  }

  if (!isIsoDate(config.reviewedAt)) {
    issues.push("reviewedAt debe usar YYYY-MM-DD.");
  }
  if (!isIsoDate(config.validUntil)) {
    issues.push("validUntil debe usar YYYY-MM-DD.");
  }
  if (
    isIsoDate(config.reviewedAt) &&
    isIsoDate(config.validUntil) &&
    config.reviewedAt > config.validUntil
  ) {
    issues.push("reviewedAt no puede ser posterior a validUntil.");
  }

  const copy = config.copy;
  if (!isRecord(copy)) {
    issues.push("copy es obligatorio.");
  } else {
    for (const key of [
      "resultEyebrow",
      "ctaLabel",
      "disclaimer",
      "specialistNextStep",
    ] as const) {
      if (!isNonEmptyString(copy[key])) issues.push(`copy.${key} es obligatorio.`);
    }
  }

  if (!isRecord(config.contextFields)) {
    issues.push("contextFields debe ser un objeto.");
  } else {
    if (config.contextFields.concern !== undefined) {
      validateOptions(
        config.contextFields.concern,
        "contextFields.concern",
        issues,
      );
    }
    if (config.contextFields.startHorizon !== undefined) {
      validateOptions(
        config.contextFields.startHorizon,
        "contextFields.startHorizon",
        issues,
      );
    }
  }

  if (!Array.isArray(config.treatments) || config.treatments.length === 0) {
    issues.push("La configuración necesita tratamientos.");
  } else {
    const treatmentIds = new Set<string>();
    for (const [index, treatment] of config.treatments.entries()) {
      const path = `treatments[${index}]`;
      if (!isRecord(treatment)) {
        issues.push(`${path} es inválido.`);
        continue;
      }
      for (const key of ["id", "label", "patientNeed", "visits"] as const) {
        if (!isNonEmptyString(treatment[key])) {
          issues.push(`${path}.${key} es obligatorio.`);
        }
      }
      if (isNonEmptyString(treatment.id)) {
        if (treatmentIds.has(treatment.id)) {
          issues.push(`Se repite el tratamiento ${treatment.id}.`);
        }
        treatmentIds.add(treatment.id);
      }

      if (!isRecord(treatment.range)) {
        issues.push(`${path}.range es obligatorio.`);
      } else {
        const { min, max } = treatment.range;
        if (
          typeof min !== "number" ||
          typeof max !== "number" ||
          !Number.isFinite(min) ||
          !Number.isFinite(max) ||
          min <= 0 ||
          max <= min
        ) {
          issues.push(`${path}.range debe tener min > 0 y max > min.`);
        }
      }

      if (!isStringArray(treatment.inclusions)) {
        issues.push(`${path}.inclusions necesita al menos un elemento.`);
      }
      if (!isStringArray(treatment.priceFactors)) {
        issues.push(`${path}.priceFactors necesita al menos un elemento.`);
      }
      if (
        treatment.note !== undefined &&
        !isNonEmptyString(treatment.note)
      ) {
        issues.push(`${path}.note no puede estar vacío.`);
      }
    }
  }

  if (issues.length > 0) {
    return { valid: false, status: "invalid", issues };
  }

  const value = config as DentalQuoteConfig;
  if (asOf < value.reviewedAt) {
    return {
      valid: false,
      status: "invalid",
      issues: ["La configuración todavía no entra en vigencia."],
    };
  }
  if (asOf > value.validUntil) {
    return {
      valid: false,
      status: "expired",
      issues: [`La configuración venció el ${value.validUntil}.`],
    };
  }

  return { valid: true, status: "valid", value };
}

function findOption(
  field: DentalQuoteContextField | undefined,
  optionId: string | undefined,
) {
  if (!field || !optionId) return undefined;
  return field.options.find((option) => option.id === optionId);
}

export function validateDentalQuoteInput(
  input: unknown,
  config: DentalQuoteConfig,
): DomainValidationResult<DentalQuoteInput> {
  if (!isRecord(input)) {
    return { valid: false, issues: ["La selección dental debe ser un objeto."] };
  }

  const issues: string[] = [];
  const treatmentId = input.treatmentId;
  if (!isNonEmptyString(treatmentId)) {
    issues.push("Selecciona un tratamiento.");
  } else if (!config.treatments.some((item) => item.id === treatmentId)) {
    issues.push(`El tratamiento ${treatmentId} no existe.`);
  }

  const concernId = input.concernId;
  if (
    concernId !== undefined &&
    (!isNonEmptyString(concernId) ||
      !findOption(config.contextFields.concern, concernId))
  ) {
    issues.push("La preocupación seleccionada no existe.");
  }

  const startHorizonId = input.startHorizonId;
  if (
    startHorizonId !== undefined &&
    (!isNonEmptyString(startHorizonId) ||
      !findOption(config.contextFields.startHorizon, startHorizonId))
  ) {
    issues.push("El horizonte seleccionado no existe.");
  }

  if (issues.length > 0 || !isNonEmptyString(treatmentId)) {
    return { valid: false, issues };
  }

  return {
    valid: true,
    value: {
      treatmentId,
      ...(isNonEmptyString(concernId) ? { concernId } : {}),
      ...(isNonEmptyString(startHorizonId) ? { startHorizonId } : {}),
    },
  };
}

export function formatDentalMoney(
  amount: number,
  config: Pick<DentalQuoteConfig, "locale" | "currency">,
) {
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDentalRange(
  treatment: DentalTreatmentV2,
  config: Pick<DentalQuoteConfig, "locale" | "currency">,
) {
  return `${formatDentalMoney(treatment.range.min, config)} – ${formatDentalMoney(treatment.range.max, config)}`;
}

function unavailableOutcome(
  configStatus: "invalid" | "expired",
): DentalQuoteOutcome {
  return {
    status: "unavailable",
    configStatus,
    patientResult: safeUnavailableResult,
    specialistSummary: {
      title: "Cotizador temporalmente no disponible",
      signals: [
        configStatus === "expired"
          ? "La configuración de precios venció"
          : "La configuración necesita corrección",
      ],
      nextStep: "Revisar y aprobar la configuración antes de publicar rangos.",
    },
  };
}

export function evaluateDentalQuote(
  config: DentalQuoteConfig,
  input: DentalQuoteInput,
  asOf: string,
): DentalQuoteOutcome {
  const configValidation = validateDentalQuoteConfig(config, asOf);
  if (!configValidation.valid) {
    return unavailableOutcome(configValidation.status);
  }

  const treatment = configValidation.value.treatments.find(
    (item) => item.id === input.treatmentId,
  );
  if (!treatment) return unavailableOutcome("invalid");

  const formattedRange = formatDentalRange(
    treatment,
    configValidation.value,
  );
  const concern = findOption(
    configValidation.value.contextFields.concern,
    input.concernId,
  );
  const startHorizon = findOption(
    configValidation.value.contextFields.startHorizon,
    input.startHorizonId,
  );
  const contextualSignals = [
    concern ? `Le preocupa: ${concern.label}` : null,
    startHorizon ? `Quiere iniciar: ${startHorizon.label}` : null,
  ].filter((signal): signal is string => signal !== null);

  return {
    status: "quoted",
    configStatus: "valid",
    patientResult: {
      kind: "dental-quote",
      title: `${treatment.label}: ${formattedRange}`,
      summary: `${configValidation.value.copy.resultEyebrow} · ${treatment.visits}.`,
      disclaimer: configValidation.value.copy.disclaimer,
      quote: {
        treatmentId: treatment.id,
        formattedRange,
        visits: treatment.visits,
        inclusions: treatment.inclusions,
        priceFactors: treatment.priceFactors,
      },
      ctaLabel: configValidation.value.copy.ctaLabel,
    },
    specialistSummary: {
      title: `Interés en ${treatment.label.toLowerCase()}`,
      signals: [
        `Rango visto: ${formattedRange}`,
        `Visitas previstas: ${treatment.visits}`,
        ...contextualSignals,
      ],
      nextStep: configValidation.value.copy.specialistNextStep,
    },
  };
}

export function createDentalQuoteV2Domain(
  config: DentalQuoteConfig,
  asOf: string,
): MotorDomain<DentalQuoteInput> {
  return {
    identity: dentalQuoteV2Identity,
    validate(input) {
      return validateDentalQuoteInput(input, config);
    },
    evaluate(input) {
      return evaluateDentalQuote(config, input, asOf);
    },
  };
}
