"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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
}

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
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
  reduceMotion = false,
  showCta = true,
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // Tracks the *intended* open/closed target synchronously, independent of in-flight
  // animations or React state batching — handleResize must always branch on this, not on
  // `isExpanded`, since `isExpanded` only flips to false after the close tween finishes.
  const expandedTargetRef = useRef(false);

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

        void contentEl.offsetHeight; // force a layout read (reflow) so scrollHeight below reflects the temporarily-unhidden content

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

  // Instant (non-animated) height sync for the reduced-motion path: no gsap timeline exists,
  // so the nav's expanded/collapsed height is applied directly whenever isExpanded flips.
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
      // A tween (open or close) is actively running — let it finish naturally instead of
      // yanking it mid-flight. Killing an in-flight reverse tween here is what used to strand
      // the nav in a stuck, contradictory state (see expandedTargetRef comment above).
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
    <div
      className={`card-nav-container absolute left-1/2 top-[1.2em] z-[99] w-[90%] max-md:w-[62%] max-w-[800px] -translate-x-1/2 md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} relative block h-[60px] overflow-hidden rounded-xl p-0 shadow-md will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 pl-[1.1rem]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} group order-2 flex h-full cursor-pointer flex-col items-center justify-center gap-[6px] md:order-none`}
            onClick={toggleMenu}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={`hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""} group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""} group-hover:opacity-75`}
            />
          </div>

          <Link
            href="/"
            aria-label="Boreas — inicio"
            className="logo-container order-1 flex items-center md:absolute md:left-1/2 md:top-1/2 md:order-none md:-translate-x-1/2 md:-translate-y-1/2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={logoAlt} className="logo h-[28px]" />
          </Link>

          {showCta && (
            <a
              href={ctaHref}
              onClick={onCtaClick}
              className="card-nav-cta-button hidden h-full items-center rounded-[calc(0.75rem-0.2rem)] border-0 px-4 font-medium transition-colors duration-300 md:inline-flex"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {ctaLabel}
            </a>
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
    </div>
  );
}
