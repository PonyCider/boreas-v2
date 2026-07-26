"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CardNav, type CardNavItem } from "@/components/layout/card-nav";
import { navCards, primaryCta, sectionIds } from "@/content/site";

const cardNavItems: CardNavItem[] = navCards.map((card) => ({
  label: card.label,
  bgColor: card.bgColor,
  textColor: "var(--ink)",
  links: card.links,
}));

function useCurrentSectionTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isHero, setIsHero] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string>("hero");

  useEffect(() => {
    const sectionEls = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top >= b.boundingClientRect.top ? a : b
        );
        const el = topMost.target as HTMLElement;
        setTheme(el.dataset.theme === "dark" ? "dark" : "light");
        setIsHero(el.id === sectionIds.hero);
        setActiveSectionId(el.id);
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { theme, isHero, activeSectionId };
}

export function Header() {
  const { theme, isHero, activeSectionId } = useCurrentSectionTheme();
  const reduceMotion = !!useReducedMotion();

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      data-theme={theme === "dark" ? "dark" : undefined}
    >
      <div className="pointer-events-auto">
        <CardNav
          logo="/brand/boreas-mark.png"
          logoAlt="Boreas"
          items={cardNavItems}
          ctaLabel={primaryCta}
          ctaHref={`#${sectionIds.pricing}`}
          showCta={!isHero}
          activeSectionId={activeSectionId}
          baseColor="var(--bg-surface)"
          menuColor="var(--ink)"
          buttonBgColor="var(--accent)"
          buttonTextColor="#1E1B18"
          reduceMotion={reduceMotion}
        />
      </div>
    </header>
  );
}
