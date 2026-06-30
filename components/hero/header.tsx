"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Prueba", href: "#prueba" },
  { label: "Proceso", href: "#proceso" },
  { label: "Confianza", href: "#garantia" },
  { label: "Contacto", href: "#contacto" },
];

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = stored ?? "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial === "dark" ? "dark" : "");
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "");
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: reduceMotion ? 0 : -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b bg-[var(--bg-deep)] transition-colors duration-[280ms]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="relative mx-auto flex w-full max-w-[1460px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex h-11 min-w-0 items-center"
          aria-label="Boreas — inicio"
        >
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "26px",
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            Boreas
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--ink-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                (e.currentTarget as HTMLElement).style.background = "var(--accent-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink-muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
            className="flex items-center justify-center rounded-md border transition-colors duration-150"
            style={{
              width: "38px",
              height: "38px",
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--ink-muted)",
            }}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* CTA */}
          <a
            href="#contacto"
            className="hidden items-center justify-center rounded-md font-semibold transition-all duration-150 hover:brightness-95 active:translate-y-px lg:inline-flex"
            style={{
              background: "var(--accent)",
              color: "var(--bg-deep)",
              height: "40px",
              padding: "0 18px",
              fontSize: "14px",
            }}
          >
            Quiero mi consultorio
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors lg:hidden"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--ink)",
            }}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Abrir menú"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div
            id="mobile-nav"
            className="absolute left-0 right-0 top-[calc(100%+1px)] z-50 border-b lg:hidden"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
          >
            <nav className="flex flex-col px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-4 py-2 text-base font-medium transition-colors"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <a
                  href="#contacto"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 w-full items-center justify-center rounded-md font-semibold transition-all"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg-deep)",
                    fontSize: "15px",
                  }}
                >
                  Quiero mi consultorio
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
