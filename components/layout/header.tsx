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

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const navMarker = 96;
      let activeSection = sectionEls[0];

      for (const sectionEl of sectionEls) {
        if (sectionEl.getBoundingClientRect().top <= navMarker) {
          activeSection = sectionEl;
        } else {
          break;
        }
      }

      const nextTheme = activeSection.dataset.theme === "dark" ? "dark" : "light";
      setTheme((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme));
      setIsHero((currentIsHero) =>
        currentIsHero === (activeSection.id === sectionIds.hero)
          ? currentIsHero
          : activeSection.id === sectionIds.hero
      );
      setActiveSectionId((currentId) =>
        currentId === activeSection.id ? currentId : activeSection.id
      );
    };

    const scheduleUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
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
          buttonTextColor="var(--bg-deep)"
          reduceMotion={reduceMotion}
        />
      </div>
    </header>
  );
}
