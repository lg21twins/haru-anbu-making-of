"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

export function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.022,
  once = true,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";
    const chars: HTMLSpanElement[] = [];
    for (const ch of [...text]) {
      const span = document.createElement("span");
      if (ch === " ") {
        span.className = "char space";
        span.innerHTML = "&nbsp;";
      } else {
        span.className = "char";
        span.textContent = ch;
      }
      el.appendChild(span);
      chars.push(span);
    }

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: once ? "play none none none" : "play none none reverse",
          once,
        },
      });
    }, el);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [text, delay, stagger, once]);

  return <span ref={ref} className={`inline-block ${className}`}>{text}</span>;
}
