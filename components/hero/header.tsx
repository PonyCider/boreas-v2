import Link from "next/link";

const navLinks = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Demo", href: "#demo-relevo" },
  { label: "Sectores", href: "#sectores" },
  { label: "Diagnóstico", href: "#diagnostico" },
];

export function Header() {
  return (
    <div className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1460px] items-center justify-between gap-6 rounded-full border border-white/10 bg-black/25 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-[0.78rem] font-medium uppercase tracking-[0.28em] text-[#f5f1ea]/85 transition-colors duration-300 hover:text-[#f7f1ea]"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#d4c0a1]/20 bg-white/[0.03]">
            <span className="absolute inset-[5px] rounded-full border border-white/6" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d4c0a1] shadow-[0_0_24px_rgba(212,192,161,0.42)]" />
          </span>
          Boreas
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/56 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#diagnostico"
            className="hidden items-center rounded-full border border-white/14 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#f7f1ea] transition-all duration-300 hover:border-white/24 hover:bg-white/[0.07] sm:inline-flex"
          >
            Ver diagnóstico
          </a>
          <a
            href="https://relevo.chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[#d4c0a1]/25 bg-[linear-gradient(180deg,rgba(216,204,178,0.18)_0%,rgba(216,204,178,0.1)_100%)] px-4 py-2.5 text-sm font-medium text-[#f7f1ea] transition-all duration-300 hover:border-[#d4c0a1]/45 hover:brightness-110"
          >
            Abrir Relevo
          </a>
        </div>
      </div>
    </div>
  );
}
