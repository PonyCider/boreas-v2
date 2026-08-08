import { describe, expect, it } from "vitest";
import { resolveCheckoutUrls } from "@/lib/server/checkout-urls";

describe("resolveCheckoutUrls", () => {
  it("usa el Preview actual para retornos y Production para webhooks", () => {
    expect(
      resolveCheckoutUrls("https://preview-actual.vercel.app/api/checkout", {
        vercelEnv: "preview",
        vercelProjectProductionUrl: "www.boreas.one",
        configuredSiteUrl: "https://preview-viejo.vercel.app",
      }),
    ).toEqual({
      returnSiteUrl: "https://preview-actual.vercel.app",
      webhookSiteUrl: "https://www.boreas.one",
    });
  });

  it("usa Production para retornos y webhooks en producción", () => {
    expect(
      resolveCheckoutUrls("https://www.boreas.one/api/checkout", {
        vercelEnv: "production",
        vercelProjectProductionUrl: "www.boreas.one",
      }),
    ).toEqual({
      returnSiteUrl: "https://www.boreas.one",
      webhookSiteUrl: "https://www.boreas.one",
    });
  });
});
