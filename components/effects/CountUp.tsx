"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  to: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
};

export function CountUp({
  to,
  duration = 2,
  className = "",
  format = (n) => n.toLocaleString(),
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = format(0);

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = format(Math.round(obj.v));
      },
    });

    ScrollTrigger.refresh();

    return () => {
      tween.kill();
    };
  }, [to, duration, format]);

  return <span ref={ref} className={className}>0</span>;
}
