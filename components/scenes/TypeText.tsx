"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  cursor?: boolean;
  finalCursor?: boolean;
  threshold?: number;
  onDone?: () => void;
};

export function TypeText({
  text,
  speed = 48,
  startDelay = 220,
  className = "",
  cursor = true,
  finalCursor = false,
  threshold = 0.45,
  onDone,
}: Props) {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!started) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = window.setTimeout(() => {
        setShown(text.length);
        setDone(true);
        onDone?.();
      }, 0);
      return () => window.clearTimeout(t);
    }
    let i = 0;
    let timer: number | null = null;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i++;
      setShown(i);
      if (i < text.length) {
        const last = text[i - 1];
        const variance = (Math.random() - 0.35) * speed * 0.6;
        let next = Math.max(18, speed + variance);
        if (".!?".includes(last)) next += 320;
        else if (",;:…—".includes(last)) next += 180;
        else if (last === "\n") next += 240;
        timer = window.setTimeout(tick, next);
      } else {
        setDone(true);
        onDone?.();
      }
    };
    timer = window.setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [started, text, speed, startDelay, onDone]);

  return (
    <span ref={ref} className={`whitespace-pre-line ${className}`}>
      {text.slice(0, shown)}
      {cursor && started && (!done || finalCursor) && (
        <span className="caret" aria-hidden />
      )}
    </span>
  );
}
