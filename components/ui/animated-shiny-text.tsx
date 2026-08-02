"use client";

import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-[#373129] bg-[#1B1916]/80 px-4 py-1.5 text-sm font-medium text-[#A8A192] backdrop-blur-md shadow-sm",
        className
      )}
    >
      <style>{`
        @keyframes shinyMove {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shiny-text-gradient {
          background: linear-gradient(
            110deg,
            #A8A192 40%,
            #F5F1E8 50%,
            #A8A192 60%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shinyMove 3s infinite linear;
        }
      `}</style>
      <span className="h-2 w-2 rounded-full bg-[#E27F62] animate-pulse" />
      <span className="shiny-text-gradient">{children}</span>
    </span>
  );
};
