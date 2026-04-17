'use server';

import {
  type BookingFlowBand,
  type DiagnosticActionState,
  type DiagnosticFocus,
  type DiagnosticPriority,
  type DiagnosticRecommendation,
  type DiagnosticSubmission,
  type DiagnosticVertical,
  type LeadVolumeBand,
  type ResponseTimeBand,
  isBookingFlowBand,
  isDiagnosticVertical,
  isLeadVolumeBand,
  isResponseTimeBand,
} from "@/app/actions/diagnostic.shared";

const focusLabels: Record<DiagnosticFocus, string> = {
  "speed-to-lead": "responder más rápido",
  qualification: "entender mejor a cada contacto",
  "agenda-automation": "hacer más fácil la cita o visita",
  "follow-up": "dar seguimiento sin soltar conversaciones",
};

const leadVolumeScore: Record<LeadVolumeBand, number> = {
  "1-20": 0,
  "21-60": 1,
  "61-150": 2,
  "151-plus": 3,
};

const responseTimeScore: Record<ResponseTimeBand, number> = {
  "lt-5m": 0,
  "5-30m": 1,
  "30-120m": 3,
  "gt-2h": 4,
};

const bookingFlowScore: Record<BookingFlowBand, number> = {
  manual: 2,
  whatsapp: 1,
  crm: 0,
  mixed: 1,
};

const playbookTitles: Record<DiagnosticVertical, Record<DiagnosticFocus, string>> = {
  salud: {
    "speed-to-lead": "Responder rápido y proponer consulta",
    qualification: "Entender el caso antes de agendar",
    "agenda-automation": "Proponer horario y confirmar",
    "follow-up": "Recordar y volver a contactar",
  },
  belleza: {
    "speed-to-lead": "Responder rápido y mostrar horarios",
    qualification: "Entender el servicio ideal",
    "agenda-automation": "Reservar y confirmar",
    "follow-up": "Retomar y volver a vender",
  },
  inmobiliario: {
    "speed-to-lead": "Responder rápido y mover a visita",
    qualification: "Entender presupuesto, zona e interés real",
    "agenda-automation": "Proponer visita y ordenar agenda",
    "follow-up": "Dar seguimiento después de la visita",
  },
};

export async function generateDiagnosticRecommendation(
  _previousState: DiagnosticActionState,
  formData: FormData,
): Promise<DiagnosticActionState> {
  const submission = parseDiagnosticSubmission(formData);

  if (!submission) {
    return {
      status: "error",
      message: "Selecciona las cuatro respuestas para generar tu diagnóstico.",
    };
  }

  const recommendation = buildRecommendation(submission);

  return {
    status: "success",
    message: "Diagnóstico generado.",
    submitted: submission,
    recommendation,
  };
}

function parseDiagnosticSubmission(formData: FormData): DiagnosticSubmission | null {
  const vertical = formData.get("vertical");
  const leadVolume = formData.get("leadVolume");
  const responseTime = formData.get("responseTime");
  const bookingFlow = formData.get("bookingFlow");
  const source = formData.get("source");

  if (
    typeof vertical !== "string" ||
    typeof leadVolume !== "string" ||
    typeof responseTime !== "string" ||
    typeof bookingFlow !== "string" ||
    typeof source !== "string"
  ) {
    return null;
  }

  if (
    !isDiagnosticVertical(vertical) ||
    !isLeadVolumeBand(leadVolume) ||
    !isResponseTimeBand(responseTime) ||
    !isBookingFlowBand(bookingFlow)
  ) {
    return null;
  }

  return {
    vertical,
    leadVolume,
    responseTime,
    bookingFlow,
    source,
  };
}

function buildRecommendation(submission: DiagnosticSubmission): DiagnosticRecommendation {
  const focus = resolveFocus(submission);
  const priority = resolvePriority(submission);
  const verticalLabel = getVerticalLabel(submission.vertical);
  const focusLabel = focusLabels[focus];

  return {
    resultKey: `${submission.vertical}-${submission.leadVolume}-${submission.responseTime}-${submission.bookingFlow}-${Date.now()}`,
    focus,
    focusLabel,
    priority,
    headline: `Hoy lo más importante es ${focusLabel}.`,
    summary: buildSummary(submission, verticalLabel, focus),
    playbookTitle: playbookTitles[submission.vertical][focus],
    nextSteps: buildNextSteps(submission, focus),
  };
}

function resolveFocus(submission: DiagnosticSubmission): DiagnosticFocus {
  if (submission.responseTime === "30-120m" || submission.responseTime === "gt-2h") {
    return "speed-to-lead";
  }

  if (submission.bookingFlow === "manual" && leadVolumeScore[submission.leadVolume] >= 2) {
    return "agenda-automation";
  }

  if (submission.vertical === "inmobiliario" || submission.bookingFlow === "crm" || submission.bookingFlow === "mixed") {
    return "qualification";
  }

  return "follow-up";
}

function resolvePriority(submission: DiagnosticSubmission): DiagnosticPriority {
  const score =
    responseTimeScore[submission.responseTime] +
    leadVolumeScore[submission.leadVolume] +
    bookingFlowScore[submission.bookingFlow];

  return score >= 4 ? "alta" : "media";
}

function buildSummary(
  submission: DiagnosticSubmission,
  verticalLabel: string,
  focus: DiagnosticFocus,
): string {
  const focusCopy: Record<DiagnosticFocus, string> = {
    "speed-to-lead":
      "La intención ya existe, pero se enfría antes de que alguien la atienda bien.",
    qualification:
      "Responder rápido ayuda, pero hace falta entender mejor qué busca cada persona.",
    "agenda-automation":
      "El problema está entre los mensajes, la agenda y todo lo que pasa antes de cerrar una cita o visita.",
    "follow-up":
      "No basta con contestar una vez; hace falta seguir la conversación hasta que avance.",
  };

  const verticalContext: Record<DiagnosticVertical, string> = {
    salud:
      "En salud, cada retraso o pregunta sin contexto empuja al paciente a otra opción o pospone su decisión.",
    belleza:
      "En belleza, la rapidez y claridad alrededor de disponibilidad, servicio y confirmación define si la reserva ocurre.",
    inmobiliario:
      "En inmobiliario, la conversación necesita identificar intención y preparar la visita correcta sin desperdiciar tiempo comercial.",
  };

  return `${focusCopy[focus]} ${verticalContext[submission.vertical]} Para ${verticalLabel}, esto sería lo primero que convendría ordenar con Relevo.`;
}

function getFirstStepLabel(
  submission: DiagnosticSubmission,
  focus: DiagnosticFocus,
): string {
  return `Empezar por ${playbookTitles[submission.vertical][focus].toLowerCase()}.`;
}

function buildNextSteps(
  submission: DiagnosticSubmission,
  focus: DiagnosticFocus,
): [string, string, string] {
  const speedSla =
    submission.responseTime === "gt-2h" || submission.responseTime === "30-120m"
      ? "Buscar que las conversaciones nuevas reciban respuesta en menos de 5 minutos."
      : "Cuidar el tiempo de respuesta para que no dependa de quién esté disponible.";

  const focusSteps: Record<DiagnosticFocus, [string, string, string]> = {
    "speed-to-lead": [
      speedSla,
      getFirstStepLabel(submission, "speed-to-lead"),
      "Cerrar cada conversación con una cita, llamada o siguiente paso claro.",
    ],
    qualification: [
      "Definir qué datos mínimos hacen falta para saber si la persona realmente quiere avanzar.",
      getFirstStepLabel(submission, "qualification"),
      "Pasar al equipo solo conversaciones con contexto suficiente para seguir sin perder tiempo.",
    ],
    "agenda-automation": [
      "Tener disponibilidad, reglas de agenda y confirmaciones en un flujo mucho más claro.",
      getFirstStepLabel(submission, "agenda-automation"),
      "Quitar pasos manuales entre el interés inicial y la confirmación final.",
    ],
    "follow-up": [
      "Definir cuándo volver a escribir y cuándo dar la conversación por cerrada.",
      getFirstStepLabel(submission, "follow-up"),
      "Asegurar que cada conversación tenga un siguiente paso y no se quede en visto.",
    ],
  };

  return focusSteps[focus];
}

function getVerticalLabel(vertical: DiagnosticVertical): string {
  switch (vertical) {
    case "salud":
      return "salud";
    case "belleza":
      return "belleza";
    case "inmobiliario":
      return "inmobiliario";
  }
}
