"use client";

import { useActionState } from "react";
import { ContactFormState, submitContact } from "@/app/actions/submit-contact";
import { SectionFrame } from "./boreas-landing-sections";

export function ContactFormSection() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    async (prevState, formData) => {
      const response = await submitContact(prevState, formData);
      return response;
    },
    {}
  );

  return (
    <SectionFrame id="contacto" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-md">
            <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground">
              Empezamos con lo mínimo.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed">
              Déjanos tus datos. Te escribimos por WhatsApp y, si hace sentido, el arranque real será un audio de un minuto.
            </p>
          </div>

          <div className="w-full max-w-2xl lg:ml-auto">
            {state?.success ? (
              <div className="border-y border-accent/40 py-8">
                <h3 className="text-2xl font-semibold text-foreground">
                  Listo. Te escribimos por WhatsApp en las próximas 2 horas.
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  Revisaremos tu especialidad y tu perfil para decirte qué tendría más peso en tu consultorio digital.
                </p>
              </div>
            ) : (
              <form action={formAction} className="grid gap-6 border-y border-line py-7 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-foreground/80">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    autoComplete="name"
                    placeholder="Ej: Dr. Alejandro Ríos"
                    className="h-12 w-full rounded-md border border-line bg-surface px-4 text-base text-foreground transition-all placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="especialidad" className="text-sm font-medium text-foreground/80">
                    Especialidad médica *
                  </label>
                  <input
                    type="text"
                    id="especialidad"
                    name="especialidad"
                    required
                    placeholder="Ej: Cardiología, Dermatología"
                    className="h-12 w-full rounded-md border border-line bg-surface px-4 text-base text-foreground transition-all placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="whatsapp" className="text-sm font-medium text-foreground/80">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    placeholder="Ej: +52 55 1234 5678"
                    className="h-12 w-full rounded-md border border-line bg-surface px-4 text-base text-foreground transition-all placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="google_maps" className="text-sm font-medium text-foreground/80">
                      Enlace de Google Maps
                    </label>
                    <span className="text-xs text-muted/80">Opcional</span>
                  </div>
                  <input
                    type="url"
                    id="google_maps"
                    name="google_maps"
                    placeholder="Link a tu perfil de Google Maps"
                    className="h-12 w-full rounded-md border border-line bg-surface px-4 text-base text-foreground transition-all placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {state?.error && (
                  <div className="text-sm text-danger font-medium sm:col-span-2">
                    {state.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent px-6 text-base font-semibold text-background transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                >
                  {isPending ? (
                    <>
                      <svg className="h-5 w-5 animate-spin text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    "Quiero mi consultorio digital"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
