"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
};

export function Marquee({
  children,
  speed = 60,
  reverse = false,
  className = "",
  itemClassName = "px-8",
}: Props) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        <span className={itemClassName}>{children}</span>
        <span className={itemClassName} aria-hidden>
          {children}
        </span>
      </div>
    </div>
  );
}
