import { DiagnosticCtaForm } from "@/components/analytics/diagnostic-cta-form";

export function DiagnosticCtaSection() {
  return (
    <section id="diagnostico" className="relative scroll-mt-28 overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.12),transparent_72%)] blur-[135px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <DiagnosticCtaForm />
      </div>
    </section>
  );
}
