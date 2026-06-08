"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getLenis, lockScrollAt, ScrollLock } from "@/lib/scrollLock";
import { waitForSpace, SpaceGate } from "@/lib/waitForSpace";

type Phase =
  | "idle"
  | "chaos"
  | "grid"
  | "five"
  | "shortlist"
  | "whiteout"
  | "done";

const N = 220;
const COLS = 14;
const ROWS = 10;
// 가운데 줄에서 뽑는 5개 후보의 그리드 열 (가운데=생존자)
const CAND_COLS = [2, 5, 7, 9, 12];

type Card = {
  id: number;
  chaos: { x: number; y: number; r: number; scale: number };
  grid: { col: number; row: number };
  c1: string;
  c2: string;
  survivor?: boolean;
  candidate?: boolean;
  candIndex?: number;
};

// F · Neon Accent — 다크 베이스에 시안/마젠타 드물게 박힘 (기본 카드도 살짝 밝게)
function neonColor(i: number, r1: number) {
  if (i % 7 === 0) return `hsl(180, 90%, ${52 + r1 * 14}%)`;
  if (i % 11 === 0) return `hsl(320, 82%, ${56 + r1 * 14}%)`;
  return `hsl(219, 16%, ${36 + r1 * 22}%)`;
}

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// 단계별 머무는 시간(ms)
const T = {
  chaos: 2400,
  grid: 2800,
  five: 2400,
  shortlist: 2200,
  whiteGrow: 780, // 방사형 흰 화면 확장
  whiteHold: 720, // 흰 화면 유지 (다음 씬이 흰 배경 그리는 동안 커버)
  whiteFade: 760, // 오버레이 페이드아웃
} as const;

export function ChaosToOrderScene() {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [overlayFade, setOverlayFade] = useState(false);
  const startedRef = useRef(false);
  const lockRef = useRef<ScrollLock | null>(null);

  const cards = useMemo<Card[]>(() => {
    const list: Card[] = [];
    for (let i = 0; i < N; i++) {
      const r1 = rand(i + 1);
      const r2 = rand(i + 7);
      const r3 = rand(i + 13);
      const r4 = rand(i + 19);
      list.push({
        id: i,
        chaos: {
          x: r1 * 100,
          y: r2 * 100,
          r: (r3 - 0.5) * 60,
          scale: 0.5 + r4 * 0.6,
        },
        grid: { col: i % COLS, row: Math.floor(i / COLS) % ROWS },
        c1: neonColor(i, r1),
        c2: neonColor(i + 100, r2),
      });
    }
    // 가운데 줄에서 5개 후보를 뽑고(가운데 열=생존자), 그 중 하나만 살아남음
    const midRow = Math.floor(ROWS / 2);
    CAND_COLS.forEach((col, idx) => {
      const card = list.find((c) => c.grid.row === midRow && c.grid.col === col);
      if (card) {
        card.candidate = true;
        card.candIndex = idx;
      }
    });
    const surv = list.find(
      (c) => c.grid.row === midRow && c.grid.col === Math.floor(COLS / 2)
    );
    (surv ?? list[Math.floor(N / 2)]).survivor = true;
    return list;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let cancelled = false;
    let gate: SpaceGate | null = null;
    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(window.setTimeout(res, ms));
      });

    // 흰 화면이 다 덮인 뒤 → 락 풀고 다음 씬(CodeMaterialize)으로 이동, 오버레이 페이드
    const handoff = () => {
      const node = ref.current;
      lockRef.current?.release();
      lockRef.current = null;
      if (node) {
        const nextTop = node.offsetTop + node.offsetHeight;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(nextTop, { duration: 0.8, force: true });
        else window.scrollTo({ top: nextTop, behavior: "smooth" });
      }
      timers.push(window.setTimeout(() => setOverlayFade(true), T.whiteHold));
      timers.push(
        window.setTimeout(() => setPhase("done"), T.whiteHold + T.whiteFade)
      );
    };

    // 스페이스바 단계 통제: 시안(228) → [SPACE] 정리해라 → [SPACE] 같이 고른 다섯 → [SPACE] 살아남은 하나 → [SPACE] 코딩 페이지
    const runGated = async () => {
      setPhase("chaos");
      gate = waitForSpace();
      await gate.promise;
      if (cancelled) return;
      setPhase("grid");
      gate = waitForSpace();
      await gate.promise;
      if (cancelled) return;
      setPhase("five");
      gate = waitForSpace();
      await gate.promise;
      if (cancelled) return;
      setPhase("shortlist");
      gate = waitForSpace();
      await gate.promise;
      if (cancelled) return;
      setPhase("whiteout");
      await sleep(T.whiteGrow); // 흰 와이프가 화면을 덮는 동안
      if (cancelled) return;
      handoff();
    };

    // reduced-motion: 원래 자동 타이밍대로
    const runAuto = () => {
      setPhase("chaos");
      let t = T.chaos;
      timers.push(window.setTimeout(() => setPhase("grid"), t));
      t += T.grid;
      timers.push(window.setTimeout(() => setPhase("five"), t));
      t += T.five;
      timers.push(window.setTimeout(() => setPhase("shortlist"), t));
      t += T.shortlist;
      timers.push(window.setTimeout(() => setPhase("whiteout"), t));
      t += T.whiteGrow;
      timers.push(window.setTimeout(handoff, t));
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting && e.intersectionRatio >= 0.85 && !startedRef.current) {
          startedRef.current = true;
          io.disconnect();
          const node = ref.current;
          if (node && !reduce) lockRef.current = lockScrollAt(node.offsetTop);
          if (reduce) runAuto();
          else runGated();
        }
      },
      { threshold: [0.85, 1] }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      gate?.cancel();
      timers.forEach((id) => window.clearTimeout(id));
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, []);

  const captionMap: Record<Phase, string> = {
    idle: "",
    chaos: "228 번의 시안.",
    grid: "정리해라.",
    five: "같이 고른 다섯.",
    shortlist: "살아남은 하나.",
    whiteout: "",
    done: "",
  };
  const captionVisible =
    phase === "chaos" ||
    phase === "grid" ||
    phase === "five" ||
    phase === "shortlist";

  const whiteActive = phase === "whiteout" || phase === "done";

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      {/* 상단 자막 */}
      <div className="pointer-events-none absolute left-1/2 top-12 z-40 -translate-x-1/2 whitespace-nowrap font-sans font-semibold text-white">
        <div
          key={phase}
          style={{
            fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)",
            opacity: captionVisible ? 1 : 0,
            transition: "opacity 700ms cubic-bezier(0.2,1,0.4,1)",
          }}
        >
          {captionMap[phase]}
        </div>
      </div>

      {/* 카드 220개 */}
      <div className="absolute inset-0 overflow-hidden">
        {cards.map((c) => {
          let style: React.CSSProperties = {};
          const cardW = 70;
          const cardH = 112;
          const isShort = phase === "shortlist" || phase === "whiteout";
          const gridGapX = 100 / (COLS + 1);
          const gridGapY = 100 / (ROWS + 1);
          const gridLeft = `${(c.grid.col + 1) * gridGapX}%`;
          const gridTop = `${(c.grid.row + 1) * gridGapY}%`;
          // 후보 5개가 가운데 한 줄로 (candIndex 0~4 → 화면폭 10~90%)
          const candLeft = `${10 + (c.candIndex ?? 0) * 20}%`;

          if (phase === "idle" || phase === "chaos") {
            style = {
              left: `${c.chaos.x}%`,
              top: `${c.chaos.y}%`,
              transform: `translate(-50%, -50%) rotate(${c.chaos.r}deg) scale(${c.chaos.scale})`,
              opacity: phase === "idle" ? 0 : 0.92,
              transition: "all 700ms cubic-bezier(0.6,0,0.2,1)",
            };
          } else if (phase === "grid") {
            style = {
              left: gridLeft,
              top: gridTop,
              transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
              opacity: 0.9,
              transition: "all 950ms cubic-bezier(0.6,0,0.2,1)",
            };
          } else if (phase === "five") {
            if (c.candidate) {
              style = {
                left: candLeft,
                top: "50%",
                transform: "translate(-50%, -50%) rotate(0deg) scale(1.7)",
                opacity: 1,
                transition: "all 950ms cubic-bezier(0.6,0,0.2,1)",
                zIndex: 10,
              };
            } else {
              // 나머지 215개는 그리드 자리에서 그대로 사라짐
              style = {
                left: gridLeft,
                top: gridTop,
                transform: "translate(-50%, -50%) scale(0.6)",
                opacity: 0,
                transition: "all 600ms cubic-bezier(0.6,0,0.2,1)",
              };
            }
          } else if (isShort) {
            if (c.survivor) {
              style = {
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) scale(3.4)",
                opacity: 1,
                transition: "all 1100ms cubic-bezier(0.6,0,0.2,1)",
                zIndex: 10,
              };
            } else if (c.candidate) {
              // 살아남지 못한 4개 후보 — 줄 자리에서 페이드아웃
              style = {
                left: candLeft,
                top: "50%",
                transform: "translate(-50%, -50%) scale(0.5)",
                opacity: 0,
                transition: "all 700ms cubic-bezier(0.6,0,0.2,1)",
              };
            } else {
              style = {
                left: gridLeft,
                top: gridTop,
                transform: "translate(-50%, -50%) scale(0.4)",
                opacity: 0,
                transition: "all 500ms cubic-bezier(0.6,0,0.2,1)",
              };
            }
          } else {
            // done — 카드 페이드아웃
            style = { opacity: 0, transition: "opacity 400ms" };
          }

          const fiveHi = phase === "five" && !!c.candidate;
          const survivorHi = c.survivor && isShort;

          return (
            <div
              key={c.id}
              className="absolute"
              style={{ ...style, width: cardW, height: cardH }}
            >
              <div
                className="h-full w-full rounded-lg border border-white/10"
                style={{
                  background: survivorHi
                    ? "linear-gradient(135deg, hsl(180,90%,62%) 0%, hsl(192,85%,46%) 100%)"
                    : `linear-gradient(135deg, ${c.c1} 0%, ${c.c2} 100%)`,
                  boxShadow: survivorHi
                    ? "0 8px 40px rgba(46,210,220,.45), 0 0 0 1px rgba(255,255,255,.25)"
                    : fiveHi
                    ? "0 10px 36px rgba(0,0,0,.5), 0 0 0 2px rgba(255,255,255,.75)"
                    : "0 4px 16px rgba(0,0,0,.4)",
                }}
              >
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

      {/* 흰색 방사형 와이프 — 중앙에서 퍼져 화면을 덮고, 다음 씬으로 핸드오프 후 페이드 */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#ffffff",
          zIndex: 80,
          clipPath: whiteActive ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
          opacity: overlayFade ? 0 : 1,
          transition:
            "clip-path 780ms cubic-bezier(0.45,0,0.2,1), opacity 760ms ease",
          pointerEvents: "none",
          willChange: "clip-path, opacity",
        }}
      />
    </section>
  );
}
