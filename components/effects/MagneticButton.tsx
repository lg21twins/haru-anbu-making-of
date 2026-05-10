"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
  cursorState?: "link" | "card" | "text";
};

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  href,
  onClick,
  cursorState = "link",
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = "translate3d(0, 0, 0)";
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const sharedProps = {
    ref,
    className: `${className} inline-flex items-center transition-[box-shadow,background-color,border-color] duration-300`,
    style: {
      transform: "translate3d(0,0,0)",
      transitionTimingFunction: "cubic-bezier(0.2, 1, 0.4, 1)",
    } as const,
    "data-cursor": cursorState,
  };

  if (href) {
    return (
      <a href={href} {...(sharedProps as Record<string, unknown>)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} {...(sharedProps as Record<string, unknown>)}>
      {children}
    </button>
  );
}
