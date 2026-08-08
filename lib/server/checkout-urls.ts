type CheckoutUrlEnvironment = {
  vercelEnv?: string;
  vercelProjectProductionUrl?: string;
  configuredSiteUrl?: string;
};

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function trimSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function resolveCheckoutUrls(requestUrl: string, environment: CheckoutUrlEnvironment) {
  const requestOrigin = new URL(requestUrl).origin;
  const productionOrigin = environment.vercelProjectProductionUrl
    ? withProtocol(environment.vercelProjectProductionUrl)
    : environment.configuredSiteUrl || requestOrigin;

  return {
    returnSiteUrl: trimSlash(
      environment.vercelEnv === "preview" ? requestOrigin : productionOrigin,
    ),
    webhookSiteUrl: trimSlash(productionOrigin),
  };
}
