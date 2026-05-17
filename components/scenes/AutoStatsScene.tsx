"use client";

import { useEffect, useRef, useState } from "react";

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
  { to: 228, label: "번의 재제작 요청." },
  { to: 106, label: "일간의 대장정." },
];

// 단위: ms
const COUNT_MS = 900;
const HOLD_MS = 1200;
const HOLD_FINAL_MS = 1700;
const FADE_MS = 400;
const GAP_MS = 120;
const TEAM_IN_DELAY = 220;
const TEAM_HOLD_MS = 1800;

type Phase =
  | "idle"
  | "in"
  | "hold"
  | "out"
  | "team-in"
  | "team-hold"
  | "team-out"
  | "scrolling"
  | "done";

export function AutoStatsScene() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // 스크롤 락 — idle / done 이외의 모든 phase에서 활성 (자동 스크롤 도중에도 락)
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

    // 시퀀스 완료 → 다음 씬(영상 자리)으로 자동 스크롤. 도착(스크롤 종료 감지) 후 락 해제.
    const finish = () => {
      const node = ref.current;
      if (!node) {
        setPhase("done");
        return;
      }
      setPhase("scrolling");
      const nextTop = node.offsetTop + node.offsetHeight;

      let scrollEndTimer: number | undefined;
      let fallbackTimer: number | undefined;

      const release = () => {
        window.clearTimeout(scrollEndTimer);
        window.clearTimeout(fallbackTimer);
        window.removeEventListener("scroll", onScroll);
        setPhase("done");
      };

      const onScroll = () => {
        window.clearTimeout(scrollEndTimer);
        // 마지막 scroll 이벤트 후 180ms 무이벤트 → 스크롤 종료로 판단
        scrollEndTimer = window.setTimeout(release, 180);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      // fallback — 스크롤이 발생하지 않거나 종료 감지에 실패할 경우
      fallbackTimer = window.setTimeout(release, 1800);

      requestAnimationFrame(() => {
        window.scrollTo({ top: nextTop, behavior: "smooth" });
      });
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
            <span className="font-sans font-semibold leading-none tracking-tight text-white tabular-nums">
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

        {/* Team line — stats 시퀀스 끝나면 자동 페이드인/홀드/페이드아웃 */}
        <p
          className="absolute left-0 right-0 mx-auto px-4 font-sans font-semibold leading-[1.15] tracking-tight text-white"
          style={{
            fontSize: "clamp(1.4rem, 4.2vw, 4.4rem)",
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
