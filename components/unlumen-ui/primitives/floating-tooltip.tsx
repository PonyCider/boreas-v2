"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
} from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const floatingTooltipVariants = cva("z-50 max-w-[min(20rem,calc(100vw-1.5rem))] font-medium", {
  variants: {
    variant: {
      default: "bg-primary text-background dark:bg-white",
      outline: "border border-border bg-background text-foreground shadow-lg backdrop-blur-md",
    },
    size: {
      md: "rounded-md px-3.5 py-2.5 text-sm",
      lg: "rounded-xl px-5 py-4 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface TooltipContextType {
  setContent: (
    content: string,
    description?: string,
    contentClassName?: string,
    descriptionClassName?: string,
  ) => void;
  setIsActive: (active: boolean) => void;
  setAnchorPosition: (rect: DOMRect) => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export function FloatingTooltipProvider({
  children,
  className,
  variant,
  size,
}: {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof floatingTooltipVariants>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [contentClassName, setContentClassName] = useState("");
  const [descriptionClassName, setDescriptionClassName] = useState("");
  const tooltipRef = useRef<HTMLDivElement>(null);

  const setAnchorPosition = useCallback((rect: DOMRect) => {
    if (typeof window === "undefined") return;
    const bounds = tooltipRef.current?.getBoundingClientRect();
    const width = bounds?.width ?? Math.min(320, window.innerWidth - 24);
    const height = bounds?.height ?? 104;
    const gutter = 24;
    const offset = 10;
    let left = rect.left + rect.width / 2 - width / 2;
    let top = rect.bottom + offset;

    if (top + height + gutter > window.innerHeight) top = rect.top - height - offset;
    left = Math.max(gutter, Math.min(left, window.innerWidth - width - gutter));
    top = Math.max(gutter, Math.min(top, window.innerHeight - height - gutter));
    x.set(left);
    y.set(top);
  }, [x, y]);

  const handleSetContent = (
    newContent: string,
    newDescription?: string,
    newContentClassName?: string,
    newDescriptionClassName?: string,
  ) => {
    setContent(newContent);
    setDescription(newDescription || "");
    setContentClassName(newContentClassName || "");
    setDescriptionClassName(newDescriptionClassName || "");
  };

  return (
    <TooltipContext.Provider
      value={{ setContent: handleSetContent, setIsActive, setAnchorPosition }}
    >
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isActive && content && (
              <motion.div
                ref={tooltipRef}
                className="pointer-events-none fixed z-[9999]"
                style={{
                  top: y,
                  left: x,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              >
                <motion.div
                  layout
                  className={cn(
                    floatingTooltipVariants({ variant, size }),
                    className,
                  )}
                  transition={{
                    layout: {
                      type: "spring",
                      damping: 25,
                      stiffness: 400,
                    },
                  }}
                >
                  <motion.div
                    key={content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-1"
                  >
                    <span
                      className={cn(
                        "whitespace-nowrap font-semibold text-foreground",
                        contentClassName,
                      )}
                    >
                      {content}
                    </span>
                    {description && (
                      <span
                        className={cn(
                          "max-w-[28ch] whitespace-normal text-xs leading-snug font-normal text-muted",
                          descriptionClassName,
                        )}
                      >
                        {description}
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </TooltipContext.Provider>
  );
}

export function FloatingTooltipTrigger({
  children,
  content,
  description,
  contentClassName,
  descriptionClassName,
}: {
  children: React.ReactNode;
  content: string;
  description?: string;
  contentClassName?: string;
  descriptionClassName?: string;
}) {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error(
      "FloatingTooltipTrigger must be used within FloatingTooltipProvider",
    );
  }

  const { setContent, setIsActive, setAnchorPosition } = context;
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    setContent(content, description, contentClassName, descriptionClassName);
    if (triggerRef.current) setAnchorPosition(triggerRef.current.getBoundingClientRect());
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={showTooltip}
      onBlurCapture={handleMouseLeave}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") showTooltip();
      }}
      className="inline-block"
    >
      {children}
    </div>
  );
}

export const FloatingTooltip = {
  Provider: FloatingTooltipProvider,
  Trigger: FloatingTooltipTrigger,
};
