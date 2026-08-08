const BOREAS_REFERENCE = /^BOR-[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function sanitizeCheckoutReference(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && BOREAS_REFERENCE.test(candidate) ? candidate.toUpperCase() : undefined;
}
