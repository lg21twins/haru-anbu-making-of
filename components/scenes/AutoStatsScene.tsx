"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  to: number;
  label: string;
  format?: (n: number) => string;
  inline?: boolean;
};

const stats: Stat[] = [
  { to: 12236, label: "줄의 대화.", format: (n) => n.toLocaleString() },
  {
    to: 612,
    label: "줄의 디자인 수정 명령.",
    format: (n) => n.toLocaleString(),
  },
  { to: 228, label: "번의 재제작 요청." },
  { to: 106, label: "일간의 대장정.", inline: true },
];

// 단위: ms
const COUNT_MS = 900;
const HOLD_MS = 700;
const HOLD_FINAL_MS = 1600;
const FADE_MS = 400;
const GAP_MS = 120;
const TEAM_IN_DELAY = 200;
const TEAM_HOLD_MS = 1800;

type Phase =
  | "idle"
  | "in"
  | "hold"
  | "out"
  | "team-in"
  | "team-hold"
  | "team-out"
  | "done";

export function AutoStatsScene() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // 재생 중 페이지 스크롤 락 — phase !== idle / done 일 때만
  useEffect(() => {
    if (phase === "idle" || phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

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

    const finish = () => {
      setPhase("done");
      // 락 해제 후 다음 씬으로 부드럽게 자동 스크롤
      const node = ref.current;
      if (node) {
        const nextTop = node.offsetTop + node.offsetHeight;
        // overflow 복원 직후 스크롤
        requestAnimationFrame(() => {
          window.scrollTo({ top: nextTop, behavior: "smooth" });
        });
      }
    };

    const runTeamLine = () => {
      setPhase("team-in");
      timerRef.current = window.setTimeout(() => {
        setPhase("team-hold");
        timerRef.current = window.setTimeout(() => {
          setPhase("team-out");
          timerRef.current = window.setTimeout(() => {
            finish();
          }, FADE_MS + GAP_MS);
        }, TEAM_HOLD_MS);
      }, FADE_MS);
    };

    const runStat = (i: number) => {
      if (i >= stats.length) {
        timerRef.current = window.setTimeout(runTeamLine, TEAM_IN_DELAY);
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  const current = stats[index];
  const isStatsLayer =
    phase === "in" || phase === "hold" || phase === "out";
  const isStatsVisible = phase === "in" || phase === "hold";
  const showLabel = phase === "hold";
  const isTeamVisible = phase === "team-in" || phase === "team-hold";

  return (
    <section
      ref={ref}
      className="relative w-full bg-black"
      style={{ height: "100vh" }}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 text-center md:px-16">
        {/* Stats layer */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
          style={{
            opacity: isStatsLayer ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
          }}
        >
          {current.inline ? (
            // 마지막 stat — 숫자 + 라벨 한 줄, 같은 폰트 크기
            <div
              className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 md:gap-x-6"
              style={{
                fontSize: "clamp(2.4rem, 8.5vw, 8.5rem)",
                opacity: isStatsVisible ? 1 : 0,
                transform: isStatsVisible
                  ? "translateY(0)"
                  : "translateY(-8px)",
                transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
              }}
            >
              <span className="font-sans font-semibold leading-none tracking-tight text-white tabular-nums">
                {current.format ? current.format(value) : value}
              </span>
              <span
                className="font-sans font-semibold leading-none tracking-tight text-white"
                style={{
                  opacity: showLabel ? 1 : 0,
                  transform: showLabel
                    ? "translateY(0)"
                    : "translateY(6px)",
                  transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
                }}
              >
                {current.label}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div
                className="font-sans font-semibold leading-[0.95] tracking-tight text-white tabular-nums"
                style={{
                  fontSize: "clamp(4rem, 14vw, 14rem)",
                  opacity: isStatsVisible ? 1 : 0,
                  transform: isStatsVisible
                    ? "translateY(0)"
                    : "translateY(-12px)",
                  transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
                }}
              >
                {current.format ? current.format(value) : value}
              </div>
              <p
                className="mt-6 font-mono leading-tight text-white/60"
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.4rem)",
                  opacity: isStatsVisible && showLabel ? 1 : 0,
                  transform:
                    isStatsVisible && showLabel
                      ? "translateY(0)"
                      : "translateY(8px)",
                  transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
                }}
              >
                {current.label}
              </p>
            </div>
          )}
        </div>

        {/* Team line layer — stats 끝나면 자동 페이드인/아웃 */}
        <p
          className="absolute left-0 right-0 mx-auto whitespace-nowrap px-4 font-sans font-semibold leading-[1.15] tracking-tight text-white"
          style={{
            fontSize: "clamp(1.4rem, 4vw, 4.2rem)",
            opacity: isTeamVisible ? 1 : 0,
            transform: isTeamVisible ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 600ms cubic-bezier(0.2,1,0.4,1), transform 600ms cubic-bezier(0.2,1,0.4,1)`,
          }}
        >
          저희 팀은 우리가 원하는 디자인을 구현하였습니다.
        </p>
      </div>
    </section>
  );
}
