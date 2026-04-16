export type DiagnosticVertical = "salud" | "belleza" | "inmobiliario";
export type LeadVolumeBand = "1-20" | "21-60" | "61-150" | "151-plus";
export type ResponseTimeBand = "lt-5m" | "5-30m" | "30-120m" | "gt-2h";
export type BookingFlowBand = "manual" | "whatsapp" | "crm" | "mixed";
export type DiagnosticFocus = "speed-to-lead" | "qualification" | "agenda-automation" | "follow-up";
export type DiagnosticPriority = "alta" | "media";

export type DiagnosticSubmission = {
  vertical: DiagnosticVertical;
  leadVolume: LeadVolumeBand;
  responseTime: ResponseTimeBand;
  bookingFlow: BookingFlowBand;
  source: string;
};

export type DiagnosticRecommendation = {
  resultKey: string;
  focus: DiagnosticFocus;
  focusLabel: string;
  priority: DiagnosticPriority;
  headline: string;
  summary: string;
  playbookTitle: string;
  nextSteps: [string, string, string];
};

export type DiagnosticActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  submitted?: DiagnosticSubmission;
  recommendation?: DiagnosticRecommendation;
};

export const initialDiagnosticActionState: DiagnosticActionState = {
  status: "idle",
};

export const verticalOptions: Array<{
  value: DiagnosticVertical;
  label: string;
  hint: string;
}> = [
  {
    value: "salud",
    label: "Salud",
    hint: "Clínicas, consultorios, medspa y atención especializada.",
  },
  {
    value: "belleza",
    label: "Belleza",
    hint: "Estéticas, salones, wellness y servicios con agenda activa.",
  },
  {
    value: "inmobiliario",
    label: "Inmobiliario",
    hint: "Desarrollos, brokers y equipos que convierten visitas en cierres.",
  },
];

export const leadVolumeOptions: Array<{
  value: LeadVolumeBand;
  label: string;
}> = [
  { value: "1-20", label: "1 a 20 leads al mes" },
  { value: "21-60", label: "21 a 60 leads al mes" },
  { value: "61-150", label: "61 a 150 leads al mes" },
  { value: "151-plus", label: "Más de 150 leads al mes" },
];

export const responseTimeOptions: Array<{
  value: ResponseTimeBand;
  label: string;
}> = [
  { value: "lt-5m", label: "Menos de 5 minutos" },
  { value: "5-30m", label: "Entre 5 y 30 minutos" },
  { value: "30-120m", label: "Entre 30 minutos y 2 horas" },
  { value: "gt-2h", label: "Más de 2 horas" },
];

export const bookingFlowOptions: Array<{
  value: BookingFlowBand;
  label: string;
}> = [
  { value: "manual", label: "Manual, entre mensajes y llamadas" },
  { value: "whatsapp", label: "Principalmente por WhatsApp" },
  { value: "crm", label: "Con CRM o agenda digital" },
  { value: "mixed", label: "Mixto, con varios hand-offs" },
];

export function isDiagnosticVertical(value: string): value is DiagnosticVertical {
  return verticalOptions.some((option) => option.value === value);
}

export function isLeadVolumeBand(value: string): value is LeadVolumeBand {
  return leadVolumeOptions.some((option) => option.value === value);
}

export function isResponseTimeBand(value: string): value is ResponseTimeBand {
  return responseTimeOptions.some((option) => option.value === value);
}

export function isBookingFlowBand(value: string): value is BookingFlowBand {
  return bookingFlowOptions.some((option) => option.value === value);
}
