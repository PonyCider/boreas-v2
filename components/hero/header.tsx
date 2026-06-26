"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Prueba", href: "#problema" },
  { label: "Proceso", href: "#proceso" },
  { label: "Confianza", href: "#garantia" },
  { label: "Contacto", href: "#contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="relative mx-auto flex w-full max-w-[1460px] items-center justify-between gap-6 rounded-lg border border-line bg-background/88 px-4 py-3 shadow-[0_16px_48px_rgba(2,8,18,0.28)] backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="flex h-11 items-center gap-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-clinical"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-md border border-accent/30 bg-accent-soft">
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
          </span>
          Boreas
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-11 items-center px-3 py-2 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#contacto"
            className="hidden min-h-11 items-center justify-center rounded-md bg-accent px-5 py-2 text-sm font-semibold text-background shadow-md transition-all duration-300 hover:brightness-110 active:translate-y-px lg:inline-flex"
          >
            Quiero mi consultorio
          </a>

          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface p-2 text-foreground lg:hidden"
            aria-expanded={isOpen}
            aria-label="Abrir menú"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 rounded-lg border border-line bg-surface p-5 shadow-2xl backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center px-4 py-2 text-base font-medium text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                <a
                  href="#contacto"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-md bg-accent px-6 py-2 text-base font-semibold text-background shadow-md transition-all duration-300 hover:brightness-110"
                >
                  Quiero mi consultorio
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
