"use client";

import { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  index: string;
  children: ReactNode;
  className?: string;
};

export function ChapterShell({ id, label, index, children, className = "" }: Props) {
  return (
    <section
      id={id}
      data-chapter={id}
      className={`relative w-full ${className}`}
      aria-label={label}
    >
      <div className="pointer-events-none absolute top-0 left-0 z-30 h-full w-full">
        <div className="sticky top-6 left-6 z-30 inline-block px-6 font-mono text-[11px] tracking-[0.25em] text-white/50 mix-blend-difference">
          <span className="mr-3 opacity-60">{index}</span>
          <span>{label}</span>
        </div>
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
