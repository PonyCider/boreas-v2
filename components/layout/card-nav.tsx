"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { motion, useScroll } from "framer-motion";

export type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  ctaLabel: string;
  ctaHref: string;
  onCtaClick?: () => void;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  /** When true, skip gsap animation entirely — expand/collapse still work, just instant. */
  reduceMotion?: boolean;
  /** When false, the CTA button is not rendered at all. Defaults to true. */
  showCta?: boolean;
  activeSectionId?: string;
}

const sectionNameMap: Record<string, string> = {
  hero: "Inicio",
  problema: "Problema",
  motores: "Motores",
  "social-proof": "Resultados",
  pricing: "Planes",
  relevo: "Relevo",
};

function ArrowUpRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="nav-card-link-icon shrink-0"
    >
      <path d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  );
}

export function CardNav({
  logo,
  logoAlt = "Boreas",
  items,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className = "",
  ease = "expo.out",
  buttonBgColor,
  buttonTextColor,
  reduceMotion = false,
  showCta = true,
  activeSectionId,
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const expandedTargetRef = useRef(false);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSectionName = activeSectionId ? sectionNameMap[activeSectionId] : null;

  useEffect(() => {
    const initialSyncFrame = window.requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 56);
    });
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled((currentIsScrolled) => {
        const nextIsScrolled = currentIsScrolled ? latest > 24 : latest > 56;
        return currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled;
      });
    });
    return () => {
      window.cancelAnimationFrame(initialSyncFrame);
      unsubscribe();
    };
  }, [scrollY]);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement | null;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        void contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, "-=0.1");
    return tl;
  };

  useLayoutEffect(() => {
    if (reduceMotion) {
      tlRef.current = null;
      return;
    }
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items, reduceMotion]);

  useLayoutEffect(() => {
    if (!reduceMotion) return;
    const navEl = navRef.current;
    if (!navEl) return;
    navEl.style.height = isExpanded ? `${calculateHeight()}px` : "60px";
  }, [reduceMotion, isExpanded]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const navEl = navRef.current;
      if (reduceMotion) {
        if (!navEl || !expandedTargetRef.current) return;
        navEl.style.height = `${calculateHeight()}px`;
        return;
      }
      if (!tlRef.current) return;
      if (tlRef.current.isActive()) return;
      if (expandedTargetRef.current) {
        const newHeight = calculateHeight();
        gsap.set(navEl, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const toggleMenu = () => {
    if (reduceMotion) {
      if (!isExpanded) {
        expandedTargetRef.current = true;
        setIsHamburgerOpen(true);
        setIsExpanded(true);
      } else {
        expandedTargetRef.current = false;
        setIsHamburgerOpen(false);
        setIsExpanded(false);
      }
      return;
    }
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      expandedTargetRef.current = true;
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      expandedTargetRef.current = false;
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <motion.div
      animate={{
        maxWidth: isScrolled ? "740px" : "880px",
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`card-nav-container fixed left-1/2 top-[1.2em] z-[99] w-[90%] -translate-x-1/2 md:top-[1.6em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} relative block h-[60px] overflow-hidden rounded-2xl p-0 backdrop-blur-xl border border-[var(--border)] transition-colors duration-300 ${
          isScrolled ? "shadow-2xl bg-[var(--bg-surface)]/90" : "shadow-lg bg-[var(--bg-surface)]/80"
        } will-change-[height]`}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 pl-[1.1rem]">
          <div className="order-2 md:order-none flex items-center gap-2.5">
            {/* Indicador de Sección Activa (a la izquierda del hamburguesa) */}
            {activeSectionName && (
              <motion.span
                key={activeSectionId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)] border border-[var(--accent)]/30 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                {activeSectionName}
              </motion.span>
            )}

            {/* Micro-interacción animada de Botón Hamburguesa */}
            <button
              onClick={toggleMenu}
              onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
              aria-label={isExpanded ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isExpanded}
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--ink)] transition-colors hover:bg-[var(--bg-surface)] focus:outline-none shadow-sm group"
            >
              <div className="flex flex-col items-center justify-center w-5 h-5 gap-1.5">
                <motion.span
                  animate={{
                    rotate: isHamburgerOpen ? 45 : 0,
                    y: isHamburgerOpen ? 4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="h-[2px] w-5 rounded-full bg-current block origin-center"
                />
                <motion.span
                  animate={{
                    rotate: isHamburgerOpen ? -45 : 0,
                    y: isHamburgerOpen ? -4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="h-[2px] w-5 rounded-full bg-current block origin-center"
                />
              </div>
            </button>
          </div>

          <Link
            href="/"
            aria-label="Boreas — inicio"
            className="logo-container order-1 flex items-center md:absolute md:left-1/2 md:top-1/2 md:order-none md:-translate-x-1/2 md:-translate-y-1/2"
          >
            <Image
              src={logo}
              alt={logoAlt}
              width={38}
              height={28}
              priority
              style={{ width: "auto" }}
              className="logo h-[28px] w-auto transition-[filter,transform] duration-300"
            />
          </Link>

          {showCta && (
            <motion.a
              href={ctaHref}
              onClick={onCtaClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="card-nav-cta-button hidden h-[40px] items-center justify-center rounded-full border border-[var(--accent)]/40 px-5 text-xs font-semibold tracking-wide text-[#1E1B18] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[var(--accent)]/25 md:inline-flex"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {ctaLabel}
            </motion.a>
          )}
        </div>

        <div
          className={`card-nav-content absolute inset-x-0 bottom-0 top-[60px] z-[1] flex flex-col items-stretch justify-start gap-2 p-2 ${isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"} md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card relative flex h-auto min-h-[60px] min-w-0 flex-[1_1_auto] select-none flex-col gap-2 rounded-[calc(0.75rem-0.2rem)] p-[12px_16px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label text-[18px] font-normal tracking-[-0.5px] md:text-[22px]">{item.label}</div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex cursor-pointer items-center gap-[6px] text-[15px] no-underline transition-opacity duration-300 hover:opacity-75 md:text-[16px]"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <ArrowUpRightIcon />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </motion.div>
  );
}
