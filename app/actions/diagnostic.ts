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
  "speed-to-lead": "Velocidad de respuesta",
  qualification: "Calificación de intención",
  "agenda-automation": "Agenda y hand-off operativo",
  "follow-up": "Seguimiento consistente",
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
    "speed-to-lead": "Playbook de triage inmediato y agenda clínica",
    qualification: "Playbook de calificación clínica previa a la cita",
    "agenda-automation": "Playbook de agenda, confirmación y pre-consulta",
    "follow-up": "Playbook de recordatorios y reactivación de pacientes",
  },
  belleza: {
    "speed-to-lead": "Playbook de respuesta inmediata y disponibilidad",
    qualification: "Playbook de calificación de servicio ideal y ticket",
    "agenda-automation": "Playbook de reserva, confirmación y no-shows",
    "follow-up": "Playbook de seguimiento post-servicio y recompra",
  },
  inmobiliario: {
    "speed-to-lead": "Playbook de respuesta inmediata y visita priorizada",
    qualification: "Playbook de presupuesto, zona e intención de compra",
    "agenda-automation": "Playbook de agenda de visitas y hand-off comercial",
    "follow-up": "Playbook de seguimiento entre visita, objeciones y cierre",
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
    headline: `Tu palanca principal hoy es ${focusLabel.toLowerCase()}.`,
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
      "La intención ya existe, pero se enfría antes de que el equipo la convierta en acción.",
    qualification:
      "Responder rápido no basta: hace falta filtrar intención, urgencia y contexto antes de pasar al equipo.",
    "agenda-automation":
      "La fuga está en los hand-offs, la disponibilidad y la coordinación operativa para cerrar la siguiente acción.",
    "follow-up":
      "El problema no es solo la primera respuesta, sino la constancia para empujar al lead hasta una cita real.",
  };

  const verticalContext: Record<DiagnosticVertical, string> = {
    salud:
      "En salud, cada retraso o pregunta sin contexto empuja al paciente a otra opción o pospone su decisión.",
    belleza:
      "En belleza, la rapidez y claridad alrededor de disponibilidad, servicio y confirmación define si la reserva ocurre.",
    inmobiliario:
      "En inmobiliario, la conversación necesita identificar intención y preparar la visita correcta sin desperdiciar tiempo comercial.",
  };

  return `${focusCopy[focus]} ${verticalContext[submission.vertical]} Para ${verticalLabel}, el primer despliegue de Relevo debería enfocarse en ese cuello de botella antes de expandirse a otros módulos.`;
}

function buildNextSteps(
  submission: DiagnosticSubmission,
  focus: DiagnosticFocus,
): [string, string, string] {
  const speedSla =
    submission.responseTime === "gt-2h" || submission.responseTime === "30-120m"
      ? "Definir un SLA objetivo de respuesta menor a 5 minutos para nuevos leads."
      : "Blindar el SLA actual para que no dependa de disponibilidad manual del equipo.";

  const focusSteps: Record<DiagnosticFocus, [string, string, string]> = {
    "speed-to-lead": [
      speedSla,
      `Diseñar primero el ${playbookTitles[submission.vertical]["speed-to-lead"].toLowerCase()}.`,
      "Cerrar el hand-off con agenda o siguiente acción concreta antes de terminar la conversación.",
    ],
    qualification: [
      "Definir 3 a 5 datos obligatorios que separen curiosidad de intención real.",
      `Diseñar primero el ${playbookTitles[submission.vertical].qualification.toLowerCase()}.`,
      "Pasar al equipo solo leads con contexto suficiente para avanzar sin retrabajo.",
    ],
    "agenda-automation": [
      "Centralizar disponibilidad, reglas de agenda y confirmaciones en un solo flujo.",
      `Diseñar primero el ${playbookTitles[submission.vertical]["agenda-automation"].toLowerCase()}.`,
      "Eliminar pasos manuales entre interés, propuesta de horario y confirmación final.",
    ],
    "follow-up": [
      "Definir cuándo insistir, cuándo reconectar y cuándo cerrar la conversación.",
      `Diseñar primero el ${playbookTitles[submission.vertical]["follow-up"].toLowerCase()}.`,
      "Asegurar que cada lead tenga una siguiente acción definida, no solo una primera respuesta.",
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
