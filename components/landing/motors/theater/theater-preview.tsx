"use client";

import { runtimeContractDemoDefinition } from "@/content/motor-theater";
import { resolveMotorView } from "./motor-registry";

const PreviewView = resolveMotorView(runtimeContractDemoDefinition);

export function TheaterPreview() {
  return <PreviewView definition={runtimeContractDemoDefinition} />;
}
