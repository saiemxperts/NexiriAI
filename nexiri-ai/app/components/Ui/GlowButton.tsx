"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./GlowButton.module.css";

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

const defaultIcon = (
  <svg
    className={cn("h-[18px] w-[18px]", styles.icon)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2.5}
  >
    <polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37" />
  </svg>
);

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, children, icon = defaultIcon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative inline-flex cursor-pointer items-center justify-center overflow-hidden border-0 px-[18px] py-3 outline-none transition-all duration-[250ms] ease-in-out active:scale-95",
          styles.button,
          className
        )}
        {...props}
      >
        <span className={styles.fold} />

        <div className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <i key={i} className={styles.point} />
          ))}
        </div>

        <span className="relative z-[2] inline-flex w-full items-center justify-center gap-1.5 text-base font-medium leading-normal text-white transition-colors duration-200 ease-in-out">
          {icon}
          {children ?? "Credits"}
        </span>
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";