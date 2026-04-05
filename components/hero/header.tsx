import Link from "next/link";

export function Header() {
  return (
    <div className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/25 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:px-6">
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

        <a
          href="mailto:hola@boreas.ai"
          className="inline-flex items-center rounded-full border border-[#d4c0a1]/25 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#f7f1ea] transition-all duration-300 hover:border-[#d4c0a1]/45 hover:bg-white/[0.07]"
        >
          Agendar llamada
        </a>
      </div>
    </div>
  );
}
