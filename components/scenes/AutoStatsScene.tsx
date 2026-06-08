"use client";

import { useEffect, useRef, useState } from "react";
import { lockScrollAt, releaseAndAdvance, ScrollLock } from "@/lib/scrollLock";

type Stat = {
  to: number;
  label: string;
  format?: (n: number) => string;
};

// 4개 stat 모두 동일한 흐름:
//   1) 숫자 카운트업
//   2) hold 동안 숫자 옆으로 같은 폰트 크기의 한글 라벨 페이드인
//   3) 페이드아웃
const stats: Stat[] = [
  { to: 12236, label: "줄의 대화.", format: (n) => n.toLocaleString() },
  {
    to: 612,
    label: "줄의 디자인 수정 명령.",
    format: (n) => n.toLocaleString(),
  },
  { to: 228, label: "번의 재시도." },
];

// 단위: ms
const COUNT_MS = 900;
const HOLD_MS = 1200;
const HOLD_FINAL_MS = 1700;
const FADE_MS = 400;
const GAP_MS = 120;

type Phase = "idle" | "in" | "hold" | "out" | "scrolling" | "done";

export function AutoStatsScene() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const lockRef = useRef<ScrollLock | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 시작 게이트(스페이스바)가 열려야 카운트업 시작
    const begin = () => {
      const node = ref.current;
      if (node && !reduce) lockRef.current = lockScrollAt(node.offsetTop);
      runStat(0);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting && e.intersectionRatio >= 0.85 && !startedRef.current) {
          startedRef.current = true;
          io.disconnect();
          if ((window as { __haruStarted?: boolean }).__haruStarted) begin();
          else window.addEventListener("haru:start", begin, { once: true });
        }
      },
      { threshold: [0.85, 1] }
    );
    io.observe(el);

    // 시퀀스 완료 → 락 해제 + 다음 씬으로 자동 이동.
    const finish = () => {
      const node = ref.current;
      if (!node) {
        lockRef.current?.release();
        lockRef.current = null;
        setPhase("done");
        return;
      }
      setPhase("scrolling");
      const nextTop = node.offsetTop + node.offsetHeight;
      releaseAndAdvance(lockRef.current, nextTop, () => setPhase("done"));
      lockRef.current = null;
    };

    const runStat = (i: number) => {
      if (i >= stats.length) {
        finish();
        return;
      }
      const stat = stats[i];
      const isFinal = i === stats.length - 1;
      setIndex(i);
      setValue(0);
      setPhase("in");

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / COUNT_MS);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(stat.to * eased));
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setValue(stat.to);
          setPhase("hold");
          timerRef.current = window.setTimeout(
            () => {
              setPhase("out");
              timerRef.current = window.setTimeout(() => {
                runStat(i + 1);
              }, FADE_MS + GAP_MS);
            },
            isFinal ? HOLD_FINAL_MS : HOLD_MS
          );
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    return () => {
      io.disconnect();
      window.removeEventListener("haru:start", begin);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, []);

  const current = stats[index];
  const isStatsLayer =
    phase === "in" || phase === "hold" || phase === "out";
  const isStatsVisible = phase === "in" || phase === "hold";
  const showLabel = phase === "hold";

  return (
    <section
      ref={ref}
      className="relative w-full bg-black"
      style={{ height: "100vh" }}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-4 text-center md:px-12">
        {/* Stats — 모든 stat 동일하게: 숫자 + 같은 폰트 사이즈 라벨이 옆에 페이드인 */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 md:px-12"
          style={{
            opacity: isStatsLayer ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
          }}
        >
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:gap-x-8"
            style={{
              fontSize: "clamp(2rem, 7.5vw, 7.8rem)",
              opacity: isStatsVisible ? 1 : 0,
              transform: isStatsVisible
                ? "translateY(0)"
                : "translateY(-10px)",
              transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
            }}
          >
            <span
              className={`font-sans font-semibold leading-none tracking-tight text-[var(--color-accent-green)] tabular-nums${
                phase === "in" || phase === "hold" ? " accent-glow" : ""
              }`}
              style={{ animationDuration: "1840ms" }}
            >
              {current.format ? current.format(value) : value}
            </span>
            <span
              className="font-sans font-semibold leading-none tracking-tight text-white"
              style={{
                opacity: showLabel ? 1 : 0,
                transform: showLabel
                  ? "translateX(0)"
                  : "translateX(-12px)",
                transition: `opacity 520ms cubic-bezier(0.2,1,0.4,1), transform 560ms cubic-bezier(0.2,1,0.4,1)`,
              }}
            >
              {current.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
