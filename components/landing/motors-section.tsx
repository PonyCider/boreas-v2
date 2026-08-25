import { resolveMotorsSectionVariant } from "@/lib/motors/section-variant";
import { MotorsSectionSwitcher } from "./motors-section-switcher";

export function MotorsSection() {
  const variant = resolveMotorsSectionVariant(process.env.BOREAS_MOTORS_SECTION);
  return <MotorsSectionSwitcher variant={variant} />;
}
