export type MotorFamily =
  | "quiz"
  | "calculator"
  | "simulator"
  | "lead-magnet"
  | "booking";

export type MotorCapability =
  | "patient-result"
  | "specialist-summary"
  | "contact-after-result"
  | "urgent-interruption";

export type MotorIdentity = {
  motorId: string;
  version: string;
};

export type MotorDefinition = MotorIdentity & {
  family: MotorFamily;
  specialties: readonly string[];
  label: string;
  promise: string;
  capabilities: readonly MotorCapability[];
  consent: {
    required: boolean;
    version: string;
    purpose: string;
  };
};

export type PatientResult = {
  kind: string;
  title: string;
  summary: string;
  disclaimer?: string;
};

export type SpecialistSummary = {
  title: string;
  signals: readonly string[];
  nextStep: string;
};

export type LeadContact = {
  name: string;
  channel: "email" | "phone" | "whatsapp";
  value: string;
};

export type ConsentReceipt = {
  version: string;
  acceptedAt: string;
  purpose: string;
};

export type LeadSubmission = {
  submissionId: string;
  motorId: string;
  motorVersion: string;
  contact: LeadContact;
  specialistSummary: SpecialistSummary;
  consent: ConsentReceipt;
};
