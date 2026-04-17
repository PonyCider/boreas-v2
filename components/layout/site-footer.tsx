const navLinks = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Demo", href: "#demo-relevo" },
  { label: "Sectores", href: "#sectores" },
  { label: "Diagnóstico", href: "#diagnostico" },
];

const productLinks = [
  { label: "Abrir Relevo", href: "https://relevo.chat" },
  { label: "Ver demo", href: "#demo-relevo" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#0b0e11] text-[#f5f1ea]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[56rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(216,204,178,0.1),transparent_72%)] blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1460px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.6fr_0.7fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-white/30">Boreas</p>
            <h2 className="mt-5 text-balance text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.05] tracking-[-0.05em] text-[#f7f1ea]">
              Responde más rápido y convierte más conversaciones en citas.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
              Hoy Relevo te ayuda a contestar al momento y llevar a cada persona al siguiente paso
              con una atención más clara, rápida y constante.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#diagnostico"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm font-medium text-[#f7f1ea] transition-all duration-300 hover:border-white/24 hover:bg-white/[0.08]"
              >
                Ver diagnóstico
              </a>
              <a
                href="https://relevo.chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#d4c0a1]/22 bg-[linear-gradient(180deg,rgba(216,204,178,0.18)_0%,rgba(216,204,178,0.1)_100%)] px-5 py-3 text-sm font-medium text-[#fbfcfd] transition-all duration-300 hover:border-[#d4c0a1]/35 hover:brightness-110"
              >
                Abrir Relevo
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#d8ccb2]/70">
              Navegación
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/64">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#d8ccb2]/70">
              Producto
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/64">
              {productLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <p className="pt-3 text-sm leading-6 text-white/46">
                Sectores activos: salud, belleza e inmobiliario.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/8 pt-6 text-sm text-white/38">
          Boreas · Relevo listo para responder, guiar y ayudar a cerrar mejor
        </div>
      </div>
    </footer>
  );
}
