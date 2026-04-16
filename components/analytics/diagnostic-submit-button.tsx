'use client';

import { useFormStatus } from "react-dom";

export function DiagnosticSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(216,204,178,0.22)_0%,rgba(216,204,178,0.12)_100%)] px-6 py-3 text-sm font-medium text-[#fbfcfd] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.08),0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-[#d8ccb2]/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {pending ? "Generando diagnóstico..." : "Ver mi recomendación"}
    </button>
  );
}
