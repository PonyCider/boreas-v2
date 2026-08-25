import type { LeadSubmission } from "./types";

export type MotorLeadTransportResult =
  | {
      status: "confirmado";
      submissionId: string;
      receiptId: string;
    }
  | {
      status: "demo-completada";
      submissionId: string;
      message: string;
    }
  | {
      status: "pendiente";
      submissionId: string;
      retryAt: string;
    }
  | {
      status: "error-recuperable";
      submissionId: string;
      message: string;
    };

export interface MotorLeadTransport {
  submitLead(submission: LeadSubmission): Promise<MotorLeadTransportResult>;
}
