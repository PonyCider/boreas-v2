import type { MotorLeadTransport, MotorLeadTransportResult } from "./transport";
import type { LeadSubmission } from "./types";

export class DemoMotorLeadTransport implements MotorLeadTransport {
  async submitLead(
    submission: LeadSubmission,
  ): Promise<MotorLeadTransportResult> {
    return {
      status: "demo-completada",
      submissionId: submission.submissionId,
      message: "Demostración completada. Ningún consultorio recibió estos datos.",
    };
  }
}
