"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PageKind, PhoneMock } from "./PhoneMock";

type Phase = "idle" | "chaos" | "grid" | "shortlist" | "closeup";

const N = 220;
const PAGES: PageKind[] = ["home", "chat", "report", "alert", "mypage"];

// 그리드 칸 위치 계산 (12×9 정도)
const COLS = 14;
const ROWS = 10;

type Card = {
  id: number;
  chaos: { x: number; y: number; r: number; scale: number };
  grid: { col: number; row: number };
  hue: number;
  // shortlist 단계에서 살아남는지 (5개)
  short?: number; // 인덱스
};

function rand(seed: number) {
  // 결정론적 의사난수
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function PatternE() {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [closeupIdx, setCloseupIdx] = useState(0);

  const cards = useMemo<Card[]>(() => {
    const list: Card[] = [];
    let shortPicks = 0;
    for (let i = 0; i < N; i++) {
      const r1 = rand(i + 1);
      const r2 = rand(i + 7);
      const r3 = rand(i + 13);
      const r4 = rand(i + 19);
      const col = i % COLS;
      const row = Math.floor(i / COLS) % ROWS;
      const card: Card = {
        id: i,
        chaos: {
          x: r1 * 100,
          y: r2 * 100,
          r: (r3 - 0.5) * 60,
          scale: 0.5 + r4 * 0.6,
        },
        grid: { col, row },
        hue: 200 + r1 * 80, // 블루~시안 톤
      };
      list.push(card);
    }
    // shortlist 5개 — 중앙 그리드 위치에서 뽑기
    const targets = [
      { col: Math.floor(COLS / 2) - 4, row: Math.floor(ROWS / 2) },
      { col: Math.floor(COLS / 2) - 2, row: Math.floor(ROWS / 2) },
      { col: Math.floor(COLS / 2), row: Math.floor(ROWS / 2) },
      { col: Math.floor(COLS / 2) + 2, row: Math.floor(ROWS / 2) },
      { col: Math.floor(COLS / 2) + 4, row: Math.floor(ROWS / 2) },
    ];
    for (const c of list) {
      const hit = targets.findIndex(
        (t) => t.col === c.grid.col && t.row === c.grid.row
      );
      if (hit >= 0 && shortPicks < 5) {
        c.short = hit;
        shortPicks++;
      }
    }
    // 부족하면 그리드 첫줄에서 채움
    if (shortPicks < 5) {
      for (const c of list) {
        if (c.short === undefined && shortPicks < 5) {
          c.short = shortPicks;
          shortPicks++;
        }
      }
    }
    return list;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && phase === "idle") {
          io.disconnect();
          // 시퀀스 시작
          setPhase("chaos");
          window.setTimeout(() => setPhase("grid"), 2400);
          window.setTimeout(() => setPhase("shortlist"), 5200);
          window.setTimeout(() => setPhase("closeup"), 7400);
          // closeup 이후 반복 (cycle)
          window.setTimeout(() => {
            setPhase("idle");
            window.setTimeout(() => {
              setPhase("chaos");
              window.setTimeout(() => setPhase("grid"), 2400);
              window.setTimeout(() => setPhase("shortlist"), 5200);
              window.setTimeout(() => setPhase("closeup"), 7400);
            }, 400);
          }, 12000);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase]);

  // closeup 단계에서 5개 페이지 순환
  useEffect(() => {
    if (phase !== "closeup") return;
    const id = window.setInterval(() => {
      setCloseupIdx((i) => (i + 1) % PAGES.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute left-6 top-6 z-50 text-[11px] uppercase tracking-[0.3em] text-white/40">
        Pattern E · Chaos → Sort → Closeup
      </div>

      {/* 상단 자막 */}
      <div className="pointer-events-none absolute left-1/2 top-12 z-40 -translate-x-1/2 font-sans font-semibold text-white">
        <div
          style={{
            fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)",
            opacity: phase === "chaos" ? 1 : 0,
            transition: "opacity 700ms",
          }}
        >
          {phase === "chaos" && "228 개의 시안."}
        </div>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap"
          style={{
            fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)",
            opacity: phase === "grid" ? 1 : 0,
            transition: "opacity 700ms",
          }}
        >
          정리해라.
        </div>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap"
          style={{
            fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)",
            opacity: phase === "shortlist" ? 1 : 0,
            transition: "opacity 700ms",
          }}
        >
          살아남은 다섯.
        </div>
      </div>

      {/* 카드 200+개 */}
      <div className="absolute inset-0 overflow-hidden">
        {cards.map((c) => {
          let style: React.CSSProperties = {};
          const cardW = 70;
          const cardH = 112;

          if (phase === "idle" || phase === "chaos") {
            // 카오스 — 화면 전역 랜덤
            style = {
              left: `${c.chaos.x}%`,
              top: `${c.chaos.y}%`,
              transform: `translate(-50%, -50%) rotate(${c.chaos.r}deg) scale(${c.chaos.scale})`,
              opacity: phase === "idle" ? 0 : 0.78,
              transition: "all 700ms cubic-bezier(0.6,0,0.2,1)",
            };
          } else if (phase === "grid") {
            // 그리드 — 정렬
            const gridGapX = 100 / (COLS + 1);
            const gridGapY = 100 / (ROWS + 1);
            style = {
              left: `${(c.grid.col + 1) * gridGapX}%`,
              top: `${(c.grid.row + 1) * gridGapY}%`,
              transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
              opacity: 0.9,
              transition: "all 950ms cubic-bezier(0.6,0,0.2,1)",
            };
          } else if (phase === "shortlist") {
            // 5개만 살아남음, 가로 정렬
            if (c.short !== undefined) {
              const slot = c.short;
              const xs = [20, 35, 50, 65, 80];
              style = {
                left: `${xs[slot]}%`,
                top: "50%",
                transform: `translate(-50%, -50%) scale(2.6)`,
                opacity: 1,
                transition: "all 1100ms cubic-bezier(0.6,0,0.2,1)",
                zIndex: 10,
              };
            } else {
              style = {
                left: `${c.chaos.x}%`,
                top: `${c.chaos.y}%`,
                transform: "translate(-50%, -50%) scale(0.3)",
                opacity: 0,
                transition: "all 800ms",
              };
            }
          } else if (phase === "closeup") {
            // 모두 페이드아웃
            style = {
              opacity: 0,
              transition: "opacity 500ms",
            };
          }

          return (
            <div
              key={c.id}
              className="absolute"
              style={{
                ...style,
                width: cardW,
                height: cardH,
              }}
            >
              <div
                className="h-full w-full rounded-lg border border-white/10"
                style={{
                  background: `linear-gradient(135deg, hsl(${c.hue}, 50%, 35%) 0%, hsl(${c.hue + 20}, 60%, 22%) 100%)`,
                  boxShadow: "0 4px 16px rgba(0,0,0,.4)",
                }}
              >
                {/* 작은 더미 콘텐츠 */}
                <div className="flex h-full flex-col p-1.5">
                  <div className="h-2 w-3/4 rounded bg-white/40" />
                  <div className="mt-1 h-1.5 w-1/2 rounded bg-white/20" />
                  <div className="mt-auto h-6 w-full rounded bg-white/15" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* closeup 단계 — 완성 폰 클로즈업 */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: phase === "closeup" ? 1 : 0,
          transition: "opacity 800ms cubic-bezier(0.2,1,0.4,1)",
          transitionDelay: phase === "closeup" ? "300ms" : "0ms",
          pointerEvents: phase === "closeup" ? "auto" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <div
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)" }}
          >
            완성.
          </div>
          <PhoneMock page={PAGES[closeupIdx]} stage={4} />
        </div>
      </div>
    </section>
  );
}
