"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TOTAL_VH = 720;

const stages = [
  {
    prompt: "우리 기획서 가지고 로고 만들어봐.",
    src: "/media/logo/logo-1.png",
    label: "벤다이어그램 — 컨셉 다이어그램, 로고는 아님.",
  },
  {
    prompt: "아니, 이건 로고가 아니라 다이어그램이잖아. 다시.",
    src: "/media/logo/logo-2.png",
    label: "해님 캐릭터 — 따뜻한데 의료에 안 어울림.",
  },
  {
    prompt: "캐릭터 같아. 의료 신뢰감이 없어. 다시.",
    src: "/media/logo/logo-3.png",
    label: "추상 매듭 — 색이 너무 많고 시각이 무거움.",
  },
  {
    prompt: "색이 너무 많아 무거워. 단순하게 다시.",
    src: "/media/logo/logo-4.png",
    label: "말풍선+하트 — 기능 그대로 합친 셈, 평범.",
  },
  {
    prompt: "기능 그대로네. 시그니처 한 곡선으로 가자.",
    src: null,
    label: "심볼 — 두 곡선의 흐름.",
  },
];

const phases: [number, number][] = [
  [0.04, 0.20],
  [0.20, 0.36],
  [0.36, 0.52],
  [0.52, 0.68],
  [0.68, 0.84],
];

const FINAL_REVEAL_START = 0.78;
const FINAL_FULL = 0.86;
const THATS_IT_START = 0.88;
const THATS_IT_END = 0.97;

function fadeBetween(
  p: number,
  fadeIn: number,
  full: number,
  fadeOutStart: number,
  end: number
): number {
  if (p < fadeIn) return 0;
  if (p < full) return (p - fadeIn) / (full - fadeIn);
  if (p < fadeOutStart) return 1;
  if (p < end) return 1 - (p - fadeOutStart) / (end - fadeOutStart);
  return 0;
}

export function LogoEvolutionScene() {
  const outerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      setProgress(scrolled / range);
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        compute();
        ticking.current = false;
      });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const p = progress;

  let currentIdx = -1;
  for (let i = 0; i < phases.length; i++) {
    if (p >= phases[i][0] && p < phases[i][1]) {
      currentIdx = i;
      break;
    }
  }
  if (currentIdx === -1 && p >= phases[phases.length - 1][1]) {
    currentIdx = phases.length - 1;
  }

  const cardLogoOps = phases.slice(0, 4).map((_, i) => {
    const [a, b] = phases[i];
    return fadeBetween(p, a, a + 0.03, b - 0.03, b);
  });

  const finalOp = fadeBetween(p, FINAL_REVEAL_START, FINAL_FULL, 1.5, 2);
  const cardOp = 1 - finalOp;
  const thatsItOp = fadeBetween(p, THATS_IT_START, THATS_IT_START + 0.02, THATS_IT_END - 0.03, THATS_IT_END);

  return (
    <section
      id="s-logo"
      ref={outerRef}
      className="relative w-full"
      style={{ height: `${TOTAL_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        {/* main: chat thread (left) + logo (right) */}
        <div className="absolute inset-0 grid grid-cols-1 items-center gap-8 px-6 pt-20 pb-20 md:grid-cols-[1fr_1.05fr] md:gap-14 md:px-16 md:pt-24 md:pb-24">
          {/* chat thread */}
          <div className="relative flex h-full max-h-[64vh] flex-col justify-end overflow-hidden">
            <div className="flex flex-col gap-3 md:gap-4">
              {stages.map((s, i) => {
                const dist = currentIdx - i;
                const visible = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const opacity = !visible
                  ? 0
                  : isCurrent
                    ? 1
                    : Math.max(0.18, 0.55 - dist * 0.12);
                const size = isCurrent ? "1.0" : "0.86";
                return (
                  <p
                    key={i}
                    className="font-mono leading-[1.3] text-white transition-all duration-700 ease-out"
                    style={{
                      opacity,
                      fontSize: isCurrent
                        ? "clamp(1.15rem, 1.85vw, 1.85rem)"
                        : "clamp(0.9rem, 1.2vw, 1.25rem)",
                      transform: `scale(${size})`,
                      transformOrigin: "left bottom",
                      color: isCurrent ? "#ffffff" : "rgba(255,255,255,0.65)",
                    }}
                  >
                    <span className="text-[color:var(--color-key)]">&gt; </span>
                    {s.prompt}
                    {isCurrent && finalOp < 0.5 && (
                      <span className="caret" aria-hidden />
                    )}
                  </p>
                );
              })}
            </div>
          </div>

          {/* logo display (right) */}
          <div className="relative flex items-center justify-center">
            {/* phases 1-4 white card with PNG */}
            <div
              className="relative"
              style={{
                width: "min(440px, 80vw)",
                aspectRatio: "1 / 1",
                opacity: cardOp,
                transition: "opacity 350ms linear",
              }}
            >
              {stages.slice(0, 4).map((s, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white"
                  style={{
                    opacity: cardLogoOps[i],
                    transition: "opacity 220ms linear",
                    boxShadow:
                      "0 30px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
                  }}
                >
                  <div className="relative h-[86%] w-[86%]">
                    {s.src && (
                      <Image
                        src={s.src}
                        alt={s.label}
                        fill
                        sizes="(max-width: 768px) 78vw, 440px"
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* final brand logo reveal — replaces card */}
            {finalOp > 0 && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  opacity: finalOp,
                  transform: `scale(${0.88 + finalOp * 0.12})`,
                  transition: "transform 260ms ease-out",
                }}
              >
                <FinalSymbol />
                <p
                  className="mt-6 font-sans font-bold leading-none tracking-tight text-white"
                  style={{ fontSize: "clamp(1.8rem, 3.4vw, 3rem)" }}
                >
                  하루안부
                </p>
                <p className="mt-3 font-sans text-xs text-white/50 md:text-sm">
                  오늘 하루도, 안녕하셨습니다
                </p>
              </div>
            )}

            {/* 이거다. overlay */}
            {thatsItOp > 0 && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ opacity: thatsItOp }}
              >
                <p
                  className="font-sans font-bold text-[color:var(--color-key)]"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 9rem)",
                    filter: "drop-shadow(0 0 36px rgba(126,255,141,0.55))",
                  }}
                >
                  이거다.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="absolute inset-x-0 bottom-10 z-20 flex items-center justify-end px-6 md:bottom-14 md:px-12">
          <Progress idx={currentIdx} reveal={finalOp > 0.5} />
        </footer>
      </div>
    </section>
  );
}

function FinalSymbol() {
  return (
    <svg
      viewBox="0 0 512 512"
      width="min(40vw, 300px)"
      height="min(40vw, 300px)"
      style={{
        filter:
          "drop-shadow(0 0 60px rgba(44, 122, 252, 0.55)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5))",
      }}
    >
      <g transform="translate(50, 50) scale(0.163)">
        <path
          d="M2521.32 2506.66C1239.65 2657.48 1239.65 1895.6 1239.65 1279.34L2497.69 0.000170058C2518.68 494.198 2522.27 1157.92 1658.86 1262.48C2641.88 1314.25 2521.32 2101.84 2521.32 2506.66Z"
          fill="#2C7AFC"
        />
        <path
          d="M4.6772 19.3353C1286.35 -131.481 1286.35 630.399 1286.35 1246.66L28.3145 2526C7.32194 2031.8 3.73014 1368.08 867.143 1263.52C-115.881 1211.75 4.6772 424.157 4.6772 19.3353Z"
          fill="#2C7AFC"
        />
      </g>
    </svg>
  );
}

function Progress({ idx, reveal }: { idx: number; reveal: boolean }) {
  const total = 5;
  const active = reveal ? total - 1 : Math.max(0, idx);
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="block h-[2px] transition-all duration-500"
          style={{
            width: i === active ? "32px" : "12px",
            background:
              i === active
                ? "var(--color-key)"
                : i < active
                  ? "rgba(126,255,141,0.45)"
                  : "rgba(255,255,255,0.18)",
            boxShadow:
              i === active ? "0 0 10px rgba(126,255,141,0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}
