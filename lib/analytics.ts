export const BOREAS_ANALYTICS_EVENT = "boreas:analytics";
export const BOREAS_ANALYTICS_QUEUE_KEY = "__BOREAS_ANALYTICS__";

export type AnalyticsEventName = "cta_click" | "diagnostic_submit" | "diagnostic_result";

export type AnalyticsMetaValue = string | number | boolean | null;

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  surface: string;
  timestamp: string;
  meta?: Record<string, AnalyticsMetaValue>;
};

declare global {
  interface Window {
    __BOREAS_ANALYTICS__?: AnalyticsEvent[];
  }
}

export function createAnalyticsEvent(input: Omit<AnalyticsEvent, "timestamp">): AnalyticsEvent {
  return {
    ...input,
    timestamp: new Date().toISOString(),
  };
}

export function trackAnalyticsEvent(input: Omit<AnalyticsEvent, "timestamp">): AnalyticsEvent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const event = createAnalyticsEvent(input);
  const queue = window[BOREAS_ANALYTICS_QUEUE_KEY] ?? [];

  queue.push(event);
  window[BOREAS_ANALYTICS_QUEUE_KEY] = queue;
  window.dispatchEvent(new CustomEvent<AnalyticsEvent>(BOREAS_ANALYTICS_EVENT, { detail: event }));

  if (process.env.NODE_ENV !== "production") {
    console.info("[boreas:analytics]", event);
  }

  return event;
}
