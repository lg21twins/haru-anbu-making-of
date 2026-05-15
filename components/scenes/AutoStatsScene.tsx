"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  to: number;
  label: string;
  format?: (n: number) => string;
};

const stats: Stat[] = [
  { to: 12236, label: "줄의 대화.", format: (n) => n.toLocaleString() },
  {
    to: 612,
    label: "줄의 디자인 수정 명령.",
    format: (n) => n.toLocaleString(),
  },
  { to: 228, label: "번의 재제작 요청." },
  { to: 106, label: "일간의 대장정." },
];

// 단위: ms
const COUNT_MS = 900;
const HOLD_MS = 700;
const FADE_MS = 400;
const GAP_MS = 120;
const PER_STAT = COUNT_MS + HOLD_MS + FADE_MS + GAP_MS;

export function AutoStatsScene() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "done">("in");
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          io.disconnect();
          runStat(0);
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);

    const runStat = (i: number) => {
      if (i >= stats.length) {
        setPhase("done");
        return;
      }
      const stat = stats[i];
      setIndex(i);
      setValue(0);
      setPhase("in");

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / COUNT_MS);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(stat.to * eased));
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setValue(stat.to);
          setPhase("hold");
          timerRef.current = window.setTimeout(() => {
            setPhase("out");
            timerRef.current = window.setTimeout(() => {
              runStat(i + 1);
            }, FADE_MS + GAP_MS);
          }, HOLD_MS);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const current = stats[index];
  const isVisible = phase !== "out" && phase !== "done";
  // done 상태에서는 마지막 통계를 유지
  const displayValue = phase === "done" ? stats[stats.length - 1].to : value;
  const displayStat = phase === "done" ? stats[stats.length - 1] : current;
  const showLabel = phase === "hold" || phase === "done";

  return (
    <section
      ref={ref}
      className="relative w-full bg-black"
      style={{ height: "100vh" }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center md:px-16">
        <div
          className="font-sans font-semibold leading-[0.95] tracking-tight text-white tabular-nums"
          style={{
            fontSize: "clamp(4rem, 14vw, 14rem)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-12px)",
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
          }}
        >
          {displayStat.format
            ? displayStat.format(displayValue)
            : displayValue}
        </div>
        <p
          className="mt-6 font-mono leading-tight text-white/60"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            opacity: isVisible && showLabel ? 1 : 0,
            transform:
              isVisible && showLabel ? "translateY(0)" : "translateY(8px)",
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
          }}
        >
          {displayStat.label}
        </p>
      </div>
    </section>
  );
}
