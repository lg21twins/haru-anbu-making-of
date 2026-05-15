"use client";

import { useEffect, useRef, useState } from "react";

type Word = { text: string; count: number };

// 06_로그/대화기록_작업로그.md 프롬프트 74개에서 실측한 빈도
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
  { text: "분석", count: 3 },
  { text: "기능", count: 3 },
  { text: "공간", count: 3 },
  { text: "우리", count: 3 },
];

// pill 컬러 팔레트 — 글자/배경/테두리 묶음
type PillStyle = { bg: string; fg: string; border?: string };
const palette: PillStyle[] = [
  { bg: "#ffffff", fg: "#0a0a0a" }, // 화이트
  { bg: "#2c7afc", fg: "#ffffff" }, // 브랜드 블루
  { bg: "#0a1a3a", fg: "#74a8ff", border: "rgba(116,168,255,0.3)" }, // 다크 네이비
  { bg: "#7eff8d", fg: "#0a0a0a" }, // 키 그린
  { bg: "#7c4dff", fg: "#ffffff" }, // 퍼플
  { bg: "#10b9c4", fg: "#0a0a0a" }, // 시안
  { bg: "#d946ef", fg: "#ffffff" }, // 마젠타
  { bg: "transparent", fg: "#ffffff", border: "rgba(255,255,255,0.3)" }, // 아웃라인
];

// 시드 기반 결정론적 셔플 — 단어별 컬러 고정
function pickColor(seed: number): PillStyle {
  return palette[seed % palette.length];
}

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
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a1024]">
        <div className="mb-8 px-6 text-center md:mb-10">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            우리가 가장 많이 쓴 말들.
          </h2>
        </div>

        <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-2 px-4 md:gap-3 md:px-8">
          {words.map((w, i) => {
            const t = (w.count - MIN) / (MAX - MIN);
            // 폰트 크기 (rem)
            const fontSize = `clamp(${0.95 + t * 0.5}rem, ${
              1.4 + t * 2.6
            }vw, ${1.8 + t * 2.4}rem)`;
            const pad = `${0.4 + t * 0.5}em ${0.8 + t * 0.6}em`;
            const c = pickColor(i * 3 + w.count);
            return (
              <span
                key={w.text}
                className="inline-flex items-center rounded-full font-sans font-semibold leading-none tracking-tight"
                style={{
                  background: c.bg,
                  color: c.fg,
                  border: c.border
                    ? `1.5px solid ${c.border}`
                    : "1.5px solid transparent",
                  fontSize,
                  padding: pad,
                  opacity: shown > i ? 1 : 0,
                  transform: shown > i ? "translateY(0) scale(1)" : "translateY(18px) scale(0.92)",
                  transition: `opacity 520ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 35
                  }ms, transform 560ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 35
                  }ms`,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>

        <p
          className="mt-10 px-6 text-center font-sans text-sm text-white/55 md:mt-12"
          style={{
            opacity: shown >= words.length ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          프롬프트 74개에서 실제로 가장 많이 등장한 말들.
        </p>
      </div>
    </section>
  );
}
