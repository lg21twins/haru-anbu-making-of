"use client";

import { useEffect, useRef, useState } from "react";

type Word = { text: string; count: number };

// 06_로그/대화기록_작업로그.md 프롬프트 74개에서 실제로 카운트한 빈도
const words: Word[] = [
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
];

const MAX = 9;
const MIN = 3;

export function PromptGrammarScene() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = range > 0 ? scrolled / range : 0;
      const t = Math.max(0, Math.min(1, (p - 0.08) / 0.78));
      setShown(Math.round(words.length * t));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <section ref={ref} className="relative w-full" style={{ height: "640vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-10 px-6 text-center md:mb-12">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            우리가 가장 많이 쓴 말들.
          </h2>
        </div>

        <div className="flex w-full max-w-6xl flex-wrap items-baseline justify-center gap-x-6 gap-y-4 px-6 md:gap-x-10 md:gap-y-6">
          {words.map((w, i) => {
            // 빈도 → 크기 (MIN..MAX → 1.2rem..6rem 식으로)
            const t = (w.count - MIN) / (MAX - MIN);
            const remMin = 1.4;
            const remMax = 5.5;
            const fontRem = remMin + t * (remMax - remMin);
            // 상위 5개는 키컬러, 나머지는 흰색
            const isTop = w.count >= 6;
            return (
              <span
                key={w.text}
                className="relative inline-flex items-baseline font-sans font-semibold leading-none tracking-tight"
                style={{
                  fontSize: `clamp(${remMin * 0.7}rem, ${
                    fontRem * 0.9
                  }vw + 0.6rem, ${remMax}rem)`,
                  color: isTop ? "var(--color-key)" : "#ffffff",
                  opacity: shown > i ? 1 : 0,
                  transform: shown > i ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 540ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 50
                  }ms, transform 540ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 50
                  }ms`,
                  textShadow: isTop
                    ? "0 0 24px rgba(126, 255, 141, 0.35)"
                    : "none",
                }}
              >
                {w.text}
                <sup
                  className="ml-1 font-mono font-medium text-white/45"
                  style={{ fontSize: "0.28em" }}
                >
                  {w.count}
                </sup>
              </span>
            );
          })}
        </div>

        <p
          className="mt-12 px-6 text-center font-sans text-sm text-white/45 md:mt-14"
          style={{
            opacity: shown >= words.length ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          프롬프트 74개에서 실제로 센 빈도.
        </p>
      </div>
    </section>
  );
}
