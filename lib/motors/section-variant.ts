export type MotorsSectionVariant = "legacy" | "theater";

export function resolveMotorsSectionVariant(
  value: string | undefined,
): MotorsSectionVariant {
  return value === "legacy" ? "legacy" : "theater";
}
