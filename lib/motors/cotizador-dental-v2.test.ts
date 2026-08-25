import { describe, expect, it } from "vitest";
import {
  boreasDentalQuoteV2Config,
  dentalQuoteV2Definition,
} from "@/content/cotizador-dental-v2";
import { TRATAMIENTOS } from "./cotizador-dental";
import {
  createDentalQuoteV2Domain,
  evaluateDentalQuote,
  formatDentalMoney,
  formatDentalRange,
  validateDentalQuoteConfig,
  validateDentalQuoteInput,
  type DentalQuoteConfig,
} from "./cotizador-dental-v2";

const validDate = "2026-08-25";

describe("configuración dental V2", () => {
  it("acepta una configuración vigente y completa", () => {
    expect(
      validateDentalQuoteConfig(boreasDentalQuoteV2Config, validDate),
    ).toMatchObject({ valid: true, status: "valid" });
  });

  it("rechaza ids repetidos y rangos invertidos", () => {
    const first = boreasDentalQuoteV2Config.treatments[0];
    const invalidConfig = {
      ...boreasDentalQuoteV2Config,
      treatments: [
        first,
        {
          ...first,
          range: { min: 2000, max: 1000 },
        },
      ],
    };

    const validation = validateDentalQuoteConfig(invalidConfig, validDate);
    expect(validation.valid).toBe(false);
    if (validation.valid) return;
    expect(validation.status).toBe("invalid");
    expect(validation.issues.join(" ")).toContain("Se repite el tratamiento");
    expect(validation.issues.join(" ")).toContain("max > min");
  });

  it("distingue una configuración vencida de una inválida", () => {
    expect(
      validateDentalQuoteConfig(
        boreasDentalQuoteV2Config,
        "2026-11-04",
      ),
    ).toMatchObject({ valid: false, status: "expired" });
  });

  it("conserva los rangos, visitas e incluidos de V1", () => {
    expect(boreasDentalQuoteV2Config.treatments).toHaveLength(
      TRATAMIENTOS.length,
    );

    for (const v1 of TRATAMIENTOS) {
      const v2 = boreasDentalQuoteV2Config.treatments.find(
        (item) => item.id === v1.id,
      );
      expect(v2, v1.id).toBeDefined();
      expect(v2?.range).toEqual({ min: v1.min, max: v1.max });
      expect(v2?.visits).toBe(v1.visitas);
      expect(v2?.inclusions).toEqual(v1.incluye);
    }
  });
});

describe("formato dental V2", () => {
  it("usa locale y moneda configurados sin centavos", () => {
    const formatted = formatDentalMoney(1500, boreasDentalQuoteV2Config);
    expect(formatted).toContain("1,500");
    expect(formatted).not.toContain(".00");
  });

  it("separa el rango con guion largo", () => {
    expect(
      formatDentalRange(
        boreasDentalQuoteV2Config.treatments[0],
        boreasDentalQuoteV2Config,
      ),
    ).toContain(" – ");
  });
});

describe("entrada y minimización dental V2", () => {
  it("conserva solo campos reconocidos", () => {
    const validation = validateDentalQuoteInput(
      {
        treatmentId: "corona",
        concernId: "precio",
        startHorizonId: "este-mes",
        notes: "dato-crudo-que-no-debe-salir",
        contact: { email: "real@example.com" },
      },
      boreasDentalQuoteV2Config,
    );

    expect(validation).toEqual({
      valid: true,
      value: {
        treatmentId: "corona",
        concernId: "precio",
        startHorizonId: "este-mes",
      },
    });
  });

  it("rechaza opciones que no pertenecen a la configuración", () => {
    expect(
      validateDentalQuoteInput(
        { treatmentId: "corona", concernId: "inventada" },
        boreasDentalQuoteV2Config,
      ),
    ).toMatchObject({ valid: false });
  });
});

describe("salidas dental V2", () => {
  it("separa resultado paciente y resumen especialista", () => {
    const outcome = evaluateDentalQuote(
      boreasDentalQuoteV2Config,
      {
        treatmentId: "corona",
        concernId: "precio",
        startHorizonId: "este-mes",
      },
      validDate,
    );

    expect(outcome.status).toBe("quoted");
    expect(outcome.patientResult.kind).toBe("dental-quote");
    expect(outcome.patientResult.title).toContain("Corona");
    expect(outcome.specialistSummary.signals).toContain(
      "Le preocupa: Entender el precio",
    );
    expect(outcome.specialistSummary.signals).toContain(
      "Quiere iniciar: Este mes",
    );
  });

  it("omite contexto opcional cuando no fue respondido", () => {
    const outcome = evaluateDentalQuote(
      boreasDentalQuoteV2Config,
      { treatmentId: "limpieza" },
      validDate,
    );

    expect(outcome.specialistSummary.signals).toHaveLength(2);
    expect(JSON.stringify(outcome.specialistSummary)).not.toContain(
      "Le preocupa",
    );
    expect(JSON.stringify(outcome.specialistSummary)).not.toContain(
      "Quiere iniciar",
    );
  });

  it("el contexto opcional no altera el rango del paciente", () => {
    const withoutContext = evaluateDentalQuote(
      boreasDentalQuoteV2Config,
      { treatmentId: "implante" },
      validDate,
    );
    const withContext = evaluateDentalQuote(
      boreasDentalQuoteV2Config,
      {
        treatmentId: "implante",
        concernId: "tiempo",
        startHorizonId: "uno-tres-meses",
      },
      validDate,
    );

    expect(withContext.patientResult).toEqual(withoutContext.patientResult);
    expect(withContext.specialistSummary).not.toEqual(
      withoutContext.specialistSummary,
    );
  });

  it("no replica campos crudos ni datos de contacto", () => {
    const validation = validateDentalQuoteInput(
      {
        treatmentId: "corona",
        notes: "dato-crudo-que-no-debe-salir",
        email: "real@example.com",
      },
      boreasDentalQuoteV2Config,
    );
    if (!validation.valid) throw new Error("La fixture debía ser válida.");

    const serialized = JSON.stringify(
      evaluateDentalQuote(
        boreasDentalQuoteV2Config,
        validation.value,
        validDate,
      ),
    );
    expect(serialized).not.toContain("dato-crudo-que-no-debe-salir");
    expect(serialized).not.toContain("real@example.com");
    expect(serialized).not.toContain("notes");
  });

  it("una configuración vencida devuelve fallback sin precio", () => {
    const outcome = evaluateDentalQuote(
      boreasDentalQuoteV2Config,
      { treatmentId: "corona" },
      "2026-11-04",
    );

    expect(outcome).toMatchObject({
      status: "unavailable",
      configStatus: "expired",
      patientResult: { kind: "dental-quote-unavailable" },
    });
    expect(outcome.patientResult).not.toHaveProperty("quote");
    expect(JSON.stringify(outcome.patientResult)).not.toContain("3,000");
  });

  it("una configuración inválida tampoco inventa precio", () => {
    const invalidConfig = {
      ...boreasDentalQuoteV2Config,
      validUntil: "fecha-inválida",
    } as unknown as DentalQuoteConfig;
    const outcome = evaluateDentalQuote(
      invalidConfig,
      { treatmentId: "corona" },
      validDate,
    );

    expect(outcome).toMatchObject({
      status: "unavailable",
      configStatus: "invalid",
    });
    expect(outcome.patientResult).not.toHaveProperty("quote");
  });

  it("produce exactamente la misma salida para el mismo input", () => {
    const input = {
      treatmentId: "implante",
      concernId: "tiempo",
      startHorizonId: "uno-tres-meses",
    };

    expect(
      evaluateDentalQuote(boreasDentalQuoteV2Config, input, validDate),
    ).toEqual(
      evaluateDentalQuote(boreasDentalQuoteV2Config, input, validDate),
    );
  });

  it("expone un MotorDomain con la identidad V2", () => {
    const domain = createDentalQuoteV2Domain(
      boreasDentalQuoteV2Config,
      validDate,
    );
    const validation = domain.validate({ treatmentId: "limpieza" });

    expect(domain.identity).toEqual({
      motorId: "cotizador-dental",
      version: "2.0.0",
    });
    expect(dentalQuoteV2Definition).toMatchObject(domain.identity);
    if (!validation.valid) throw new Error("La fixture debía ser válida.");
    expect(domain.evaluate(validation.value).patientResult.kind).toBe(
      "dental-quote",
    );
  });
});
