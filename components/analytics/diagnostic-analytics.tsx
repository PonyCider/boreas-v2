'use client';

import { useEffect, useRef } from "react";

import type { DiagnosticRecommendation } from "@/app/actions/diagnostic.shared";
import { trackAnalyticsEvent } from "@/lib/analytics";

const DIAGNOSTIC_SURFACE = "diagnostic_cta_section";

function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function trackDiagnosticCtaClick() {
  trackAnalyticsEvent({
    name: "cta_click",
    surface: DIAGNOSTIC_SURFACE,
    meta: {
      cta_id: "open-diagnostic-flow",
    },
  });
}

export function trackDiagnosticSubmit(formData: FormData) {
  trackAnalyticsEvent({
    name: "diagnostic_submit",
    surface: DIAGNOSTIC_SURFACE,
    meta: {
      vertical: getFormValue(formData, "vertical") ?? null,
      lead_volume: getFormValue(formData, "leadVolume") ?? null,
      response_time: getFormValue(formData, "responseTime") ?? null,
      booking_flow: getFormValue(formData, "bookingFlow") ?? null,
      source: getFormValue(formData, "source") ?? null,
    },
  });
}

export function DiagnosticResultTracker({
  recommendation,
  source,
}: {
  recommendation?: DiagnosticRecommendation;
  source: string;
}) {
  const lastResultKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!recommendation || lastResultKeyRef.current === recommendation.resultKey) {
      return;
    }

    lastResultKeyRef.current = recommendation.resultKey;

    trackAnalyticsEvent({
      name: "diagnostic_result",
      surface: DIAGNOSTIC_SURFACE,
      meta: {
        source,
        focus: recommendation.focus,
        focus_label: recommendation.focusLabel,
        priority: recommendation.priority,
        playbook: recommendation.playbookTitle,
      },
    });
  }, [recommendation, source]);

  return null;
}
