import { TheaterPreview } from "@/components/landing/motors/theater/theater-preview";

export default function TeatroPreviewPage() {
  return (
    <main data-theme="dark" className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            EPIC 3 · Fase 3B
          </p>
          <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Laboratorio del runtime portable
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Ruta interna. Valida el cotizador dental V2, sus dos caras y el
            contacto sintético sin modificar la sección pública.
          </p>
        </div>
        <TheaterPreview />
      </div>
    </main>
  );
}
