"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { navLinks, primaryCta, sectionIds } from "@/content/site";

// Below this scroll offset, the hero's own CTA is out of view — the header
// CTA can appear without competing for the same first viewport.
const HEADER_CTA_SCROLL_THRESHOLD = 600;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeaderCta, setShowHeaderCta] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setShowHeaderCta(window.scrollY > HEADER_CTA_SCROLL_THRESHOLD);
    });
    function onScroll() {
      setShowHeaderCta(window.scrollY > HEADER_CTA_SCROLL_THRESHOLD);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: reduceMotion ? 0 : -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b bg-[var(--bg-deep)] transition-colors duration-[280ms]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="relative mx-auto flex w-full max-w-[1460px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="flex h-11 min-w-0 items-center"
          aria-label="Boreas — inicio"
        >
          <Image
            src="/brand/boreas-mark.png"
            alt="Boreas"
            width={872}
            height={640}
            priority
            className="h-9 w-auto"
          />
        </Link>

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

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <AnimatePresence>
              {showHeaderCta && (
                <motion.a
                  href={`#${sectionIds.pricing}`}
                  initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center justify-center rounded-md font-semibold transition-all duration-150 hover:brightness-95 active:translate-y-px"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg-deep)",
                    height: "40px",
                    padding: "0 18px",
                    fontSize: "14px",
                  }}
                >
                  {primaryCta}
                </motion.a>
              )}
            </AnimatePresence>
          </div>

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
                  href={`#${sectionIds.pricing}`}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 w-full items-center justify-center rounded-md font-semibold transition-all"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg-deep)",
                    fontSize: "15px",
                  }}
                >
                  {primaryCta}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
