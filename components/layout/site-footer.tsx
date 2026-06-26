export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-background py-8 text-foreground">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Boreas
            </span>
            <span className="text-sm text-muted">
              © 2026 Boreas. Todos los derechos reservados.
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            <a
              href="#problema"
              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-foreground"
            >
              Problema
            </a>
            <a
              href="#proceso"
              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-foreground"
            >
              Proceso
            </a>
            <a
              href="#contacto"
              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-foreground"
            >
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
