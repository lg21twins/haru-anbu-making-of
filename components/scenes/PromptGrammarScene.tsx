"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Word = { text: string; count: number };

// 06_로그/대화기록_작업로그.md 프롬프트 74개에서 실측한 빈도
const baseWords: Word[] = [
  { text: "디자인", count: 9 },
  { text: "스크린샷", count: 8 },
  { text: "만들어줘", count: 6 },
  { text: "레퍼런스", count: 6 },
  { text: "스킬", count: 6 },
  { text: "홈화면", count: 5 },
  { text: "파일", count: 5 },
  { text: "피드백", count: 5 },
  { text: "탭바", count: 5 },
  { text: "반영", count: 5 },
  { text: "추가", count: 5 },
  { text: "정리", count: 4 },
  { text: "문서", count: 4 },
  { text: "채팅", count: 4 },
  { text: "다시", count: 4 },
  { text: "업데이트", count: 4 },
  { text: "다른", count: 4 },
  { text: "컬러", count: 3 },
  { text: "통일감", count: 3 },
  { text: "간호사", count: 3 },
  { text: "분석", count: 3 },
  { text: "기능", count: 3 },
  { text: "공간", count: 3 },
  { text: "우리", count: 3 },
];

type PillStyle = { bg: string; fg: string; border?: string };
const palette: PillStyle[] = [
  { bg: "#ffffff", fg: "#0a0a0a" },
  { bg: "#2c7afc", fg: "#ffffff" },
  { bg: "#0f1b3a", fg: "#74a8ff", border: "rgba(116,168,255,0.35)" },
  { bg: "#7eff8d", fg: "#0a0a0a" },
  { bg: "#7c4dff", fg: "#ffffff" },
  { bg: "#10b9c4", fg: "#0a0a0a" },
  { bg: "#d946ef", fg: "#ffffff" },
  { bg: "transparent", fg: "#ffffff", border: "rgba(255,255,255,0.3)" },
  { bg: "#1a2447", fg: "#ffffff" },
  { bg: "#ff6b9d", fg: "#0a0a0a" },
];

// 결정론적 의사난수
function hash(n: number): number {
  let x = (n * 9301 + 49297) % 233280;
  return x / 233280;
}

// 빈도만큼 단어를 반복해서 펼친 뒤 셔플
function buildPills(): { text: string; size: number; style: PillStyle; rot: number }[] {
  const flat: { text: string; size: number }[] = [];
  baseWords.forEach((w) => {
    for (let i = 0; i < w.count; i++) {
      flat.push({ text: w.text, size: w.count });
    }
  });
  // 셔플 (시드 기반 — SSR/CSR 일관)
  const arr = flat.map((p, i) => ({ p, k: hash(i * 17 + 3) }));
  arr.sort((a, b) => a.k - b.k);
  return arr.map(({ p }, idx) => ({
    text: p.text,
    size: p.size,
    style: palette[idx % palette.length],
    rot: (hash(idx * 7 + 1) - 0.5) * 5, // -2.5deg ~ +2.5deg 살짝
  }));
}

export function PromptGrammarScene() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);
  const pills = useMemo(buildPills, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = range > 0 ? scrolled / range : 0;
      const t = Math.max(0, Math.min(1, (p - 0.04) / 0.82));
      setShown(Math.round(pills.length * t));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [pills.length]);

  const MAX = 9;
  const MIN = 3;

  return (
    <section ref={ref} className="relative w-full" style={{ height: "720vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-[#0a1024]">
        <div className="absolute inset-x-0 top-8 z-20 px-6 text-center md:top-12">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}
          >
            우리가 가장 많이 쓴 말들.
          </h2>
        </div>

        <div className="flex h-full w-full items-center justify-center px-3 py-20 md:px-6 md:py-24">
          <div className="flex w-full max-w-[1400px] flex-wrap items-center justify-center gap-1.5 md:gap-2">
            {pills.map((pill, i) => {
              const t = (pill.size - MIN) / (MAX - MIN);
              const fontSize = `clamp(${0.8 + t * 0.35}rem, ${
                1.05 + t * 1.4
              }vw, ${1.3 + t * 1.6}rem)`;
              const pad = `${0.32 + t * 0.3}em ${0.7 + t * 0.4}em`;
              const c = pill.style;
              return (
                <span
                  key={i}
                  className="inline-flex items-center whitespace-nowrap rounded-full font-sans font-semibold leading-none tracking-tight"
                  style={{
                    background: c.bg,
                    color: c.fg,
                    border: c.border
                      ? `1.5px solid ${c.border}`
                      : "1.5px solid transparent",
                    fontSize,
                    padding: pad,
                    transform: `rotate(${pill.rot}deg) ${
                      shown > i ? "scale(1)" : "scale(0.6)"
                    }`,
                    opacity: shown > i ? 1 : 0,
                    transition: `opacity 380ms cubic-bezier(0.2, 1, 0.4, 1) ${
                      Math.min(i * 18, 1400)
                    }ms, transform 460ms cubic-bezier(0.2, 1, 0.4, 1) ${
                      Math.min(i * 18, 1400)
                    }ms`,
                  }}
                >
                  {pill.text}
                </span>
              );
            })}
          </div>
        </div>

        <p
          className="absolute inset-x-0 bottom-6 z-20 px-6 text-center font-sans text-sm text-white/55 md:bottom-8"
          style={{
            opacity: shown >= pills.length ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          프롬프트 74개에서 등장한 횟수만큼 — 총 {pills.length}개.
        </p>
      </div>
    </section>
  );
}
