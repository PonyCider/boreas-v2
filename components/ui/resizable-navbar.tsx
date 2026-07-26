"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  link: string;
  id?: string;
}

// --- Navbar Base (Scroll Resizable Wrapper) ---
interface NavbarProps {
  children: ReactNode;
  className?: string;
}

export function Navbar({ children, className }: NavbarProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 40);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none"
    >
      <motion.div
        animate={{
          maxWidth: isScrolled ? "780px" : "960px",
          paddingLeft: isScrolled ? "1.25rem" : "1.75rem",
          paddingRight: isScrolled ? "1.25rem" : "1.75rem",
          paddingTop: isScrolled ? "0.6rem" : "0.85rem",
          paddingBottom: isScrolled ? "0.6rem" : "0.85rem",
          borderRadius: isScrolled ? "9999px" : "1.25rem",
          boxShadow: isScrolled
            ? "0 20px 40px -15px rgba(0,0,0,0.35), 0 0 0 1px var(--border)"
            : "0 8px 24px -10px rgba(0,0,0,0.15), 0 0 0 1px var(--line)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto relative w-full border backdrop-blur-xl transition-colors duration-300",
          "bg-[var(--bg-surface)]/85 text-[var(--ink)] border-[var(--border)]",
          className
        )}
      >
        {children}
      </motion.div>
    </motion.header>
  );
}

// --- NavBody (Desktop Container) ---
interface NavBodyProps {
  children: ReactNode;
  className?: string;
}

export function NavBody({ children, className }: NavBodyProps) {
  return (
    <div className={cn("hidden md:flex items-center justify-between gap-6", className)}>
      {children}
    </div>
  );
}

// --- NavItems (Desktop Menu Links + Active Section & Hover Effect) ---
interface NavItemsProps {
  items: NavItem[];
  activeId?: string;
  onItemClick?: (href: string) => void;
  className?: string;
}

export function NavItems({ items, activeId, onItemClick, className }: NavItemsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav className={cn("flex items-center gap-1 relative", className)}>
      {items.map((item, idx) => {
        const isActive = activeId === item.id || activeId === item.link.replace("#", "");

        return (
          <a
            key={item.name}
            href={item.link}
            onClick={(e) => {
              if (onItemClick) {
                e.preventDefault();
                onItemClick(item.link);
              }
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative px-3.5 py-1.5 text-sm font-medium transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1.5"
          >
            {/* Hover Pill Background */}
            {hoveredIdx === idx && (
              <motion.span
                layoutId="nav-hover-pill"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-[var(--accent-soft)] z-0"
              />
            )}

            {/* Active Section Dot */}
            {isActive && (
              <motion.span
                layoutId="active-section-dot"
                className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] z-10"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}

            <span className="relative z-10 font-sans">{item.name}</span>
          </a>
        );
      })}
    </nav>
  );
}

// --- NavbarLogo ---
interface NavbarLogoProps {
  src?: string;
  alt?: string;
  href?: string;
  className?: string;
}

export function NavbarLogo({
  src = "/brand/boreas-mark.png",
  alt = "Boreas",
  href = "/",
  className,
}: NavbarLogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 shrink-0 group", className)}>
      <Image
        src={src}
        alt={alt}
        width={36}
        height={26}
        priority
        className="h-7 w-auto transition-transform duration-300 group-hover:scale-105 logo"
      />
    </Link>
  );
}

// --- NavbarButton ---
interface NavbarButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  href?: string;
}

export function NavbarButton({
  children,
  onClick,
  variant = "primary",
  className,
  href,
}: NavbarButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 shadow-sm";

  const variants = {
    primary:
      "bg-[var(--accent)] text-[var(--bg-deep)] hover:bg-[var(--accent-h)] hover:shadow-md hover:shadow-[var(--accent)]/20 border border-[var(--accent)]/40",
    secondary:
      "bg-[var(--bg-elevated)] text-[var(--ink)] hover:bg-[var(--bg-surface)] border border-[var(--border)]",
    outline:
      "bg-transparent text-[var(--ink)] border border-[var(--border)] hover:border-[var(--ink)]",
  };

  const Content = (
    <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="inline-flex items-center">
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cn(baseStyles, variants[variant], className)}>
        {Content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseStyles, variants[variant], className)}>
      {Content}
    </button>
  );
}

// --- Mobile Navigation Components ---
interface MobileNavProps {
  children: ReactNode;
  className?: string;
}

export function MobileNav({ children, className }: MobileNavProps) {
  return <div className={cn("block md:hidden w-full", className)}>{children}</div>;
}

interface MobileNavHeaderProps {
  children: ReactNode;
  className?: string;
}

export function MobileNavHeader({ children, className }: MobileNavHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between w-full min-h-[36px]", className)}>
      {children}
    </div>
  );
}

interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function MobileNavToggle({ isOpen, onClick, className }: MobileNavToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--ink)] transition-colors focus:outline-none",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center w-5 h-5 gap-1.5">
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 4 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="h-[2px] w-5 rounded-full bg-current block transform-origin-center"
        />
        <motion.span
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -4 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="h-[2px] w-5 rounded-full bg-current block transform-origin-center"
        />
      </div>
    </button>
  );
}

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function MobileNavMenu({ isOpen, children, className }: MobileNavMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn("overflow-hidden w-full pt-4 border-t border-[var(--border)] mt-3", className)}
        >
          <div className="flex flex-col gap-3 pb-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
