import type {
  LeadSubmission,
  MotorDefinition,
  MotorIdentity,
  PatientResult,
  SpecialistSummary,
} from "./types";

type ResultContext = MotorIdentity & {
  patientResult: PatientResult;
  specialistSummary: SpecialistSummary;
};

export type MotorRuntimeState =
  | (MotorIdentity & { status: "inicio" })
  | (MotorIdentity & {
      status: "captura";
      draft: Readonly<Record<string, unknown>>;
    })
  | (ResultContext & { status: "resultado-paciente" })
  | (ResultContext & { status: "contacto" })
  | (ResultContext & {
      status: "enviando";
      submission: LeadSubmission;
    })
  | (ResultContext & {
      status: "confirmado";
      submission: LeadSubmission;
      receiptId: string;
    })
  | (ResultContext & {
      status: "demo-completada";
      submission: LeadSubmission;
      message: string;
    })
  | (ResultContext & {
      status: "pendiente";
      submission: LeadSubmission;
      retryAt: string;
    })
  | (ResultContext & {
      status: "reintentando";
      submission: LeadSubmission;
    })
  | (ResultContext & {
      status: "error-recuperable";
      submission: LeadSubmission;
      message: string;
    })
  | (MotorIdentity & {
      status: "configuración-inválida";
      reason: string;
    })
  | (MotorIdentity & {
      status: "urgente";
      patientResult: PatientResult;
      resources: readonly string[];
    });

export type MotorRuntimeEvent =
  | { type: "RESET" }
  | { type: "START" }
  | { type: "CAPTURE_UPDATED"; draft: Readonly<Record<string, unknown>> }
  | {
      type: "RESULT_READY";
      patientResult: PatientResult;
      specialistSummary: SpecialistSummary;
    }
  | {
      type: "URGENT_RESULT";
      patientResult: PatientResult;
      resources: readonly string[];
    }
  | { type: "REQUEST_CONTACT" }
  | { type: "SUBMIT"; submission: LeadSubmission }
  | { type: "CONFIRMED"; receiptId: string }
  | { type: "DEMO_COMPLETED"; message: string }
  | { type: "SUBMIT_PENDING"; retryAt: string }
  | { type: "RETRY" }
  | { type: "SUBMIT_FAILED"; message: string }
  | { type: "RETURN_TO_CONTACT" }
  | { type: "CONFIG_INVALID"; reason: string };

export function createInitialMotorState(
  definition: MotorDefinition,
): MotorRuntimeState {
  return {
    status: "inicio",
    motorId: definition.motorId,
    version: definition.version,
  };
}

function invalidTransition(
  state: MotorRuntimeState,
  event: MotorRuntimeEvent,
): never {
  throw new Error(
    `Transición inválida desde "${state.status}" con "${event.type}".`,
  );
}

export function transitionMotorState(
  state: MotorRuntimeState,
  event: MotorRuntimeEvent,
): MotorRuntimeState {
  if (event.type === "RESET") {
    return {
      status: "inicio",
      motorId: state.motorId,
      version: state.version,
    };
  }

  if (event.type === "CONFIG_INVALID") {
    return {
      status: "configuración-inválida",
      motorId: state.motorId,
      version: state.version,
      reason: event.reason,
    };
  }

  switch (event.type) {
    case "START":
      if (state.status !== "inicio") return invalidTransition(state, event);
      return { ...state, status: "captura", draft: {} };

    case "CAPTURE_UPDATED":
      if (state.status !== "captura") return invalidTransition(state, event);
      return { ...state, draft: { ...state.draft, ...event.draft } };

    case "RESULT_READY":
      if (state.status !== "captura") return invalidTransition(state, event);
      return {
        motorId: state.motorId,
        version: state.version,
        status: "resultado-paciente",
        patientResult: event.patientResult,
        specialistSummary: event.specialistSummary,
      };

    case "URGENT_RESULT":
      if (state.status !== "captura") return invalidTransition(state, event);
      return {
        motorId: state.motorId,
        version: state.version,
        status: "urgente",
        patientResult: event.patientResult,
        resources: event.resources,
      };

    case "REQUEST_CONTACT":
      if (state.status !== "resultado-paciente") {
        return invalidTransition(state, event);
      }
      return { ...state, status: "contacto" };

    case "SUBMIT":
      if (state.status !== "contacto") return invalidTransition(state, event);
      return { ...state, status: "enviando", submission: event.submission };

    case "CONFIRMED":
      if (state.status !== "enviando" && state.status !== "reintentando") {
        return invalidTransition(state, event);
      }
      return { ...state, status: "confirmado", receiptId: event.receiptId };

    case "DEMO_COMPLETED":
      if (state.status !== "enviando") return invalidTransition(state, event);
      return { ...state, status: "demo-completada", message: event.message };

    case "SUBMIT_PENDING":
      if (state.status !== "enviando" && state.status !== "reintentando") {
        return invalidTransition(state, event);
      }
      return { ...state, status: "pendiente", retryAt: event.retryAt };

    case "RETRY":
      if (state.status !== "pendiente") return invalidTransition(state, event);
      return { ...state, status: "reintentando" };

    case "SUBMIT_FAILED":
      if (state.status !== "enviando" && state.status !== "reintentando") {
        return invalidTransition(state, event);
      }
      return { ...state, status: "error-recuperable", message: event.message };

    case "RETURN_TO_CONTACT":
      if (state.status !== "error-recuperable") {
        return invalidTransition(state, event);
      }
      return {
        motorId: state.motorId,
        version: state.version,
        status: "contacto",
        patientResult: state.patientResult,
        specialistSummary: state.specialistSummary,
      };
  }
}
