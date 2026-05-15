"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Pill = { text: string; weight: 1 | 2 | 3 };

const pillsData: Pill[] = [
  { text: "디자인", weight: 3 },
  { text: "스크린샷", weight: 3 },
  { text: "만들어줘", weight: 3 },
  { text: "레퍼런스", weight: 3 },
  { text: "다시", weight: 3 },
  { text: "이거야", weight: 3 },
  { text: "더 단순하게", weight: 3 },

  { text: "홈화면", weight: 2 },
  { text: "탭바", weight: 2 },
  { text: "피드백", weight: 2 },
  { text: "반영해줘", weight: 2 },
  { text: "추가해줘", weight: 2 },
  { text: "정리", weight: 2 },
  { text: "업데이트", weight: 2 },
  { text: "통일감", weight: 2 },
  { text: "컬러 팔레트", weight: 2 },
  { text: "보호자앱", weight: 2 },
  { text: "환자앱", weight: 2 },
  { text: "의료진웹", weight: 2 },
  { text: "Liquid Glass", weight: 2 },
  { text: "벤토 그리드", weight: 2 },
  { text: "햅틱", weight: 2 },
  { text: "스킬 써", weight: 2 },
  { text: "분석해봐", weight: 2 },
  { text: "X로 가자", weight: 2 },
  { text: "왜 안 돼?", weight: 2 },
  { text: "맥락 다시", weight: 2 },
  { text: "그대로 코드로", weight: 2 },
  { text: "Higgsfield", weight: 2 },
  { text: "4차 시나리오", weight: 2 },
  { text: "프롬프트 다시", weight: 2 },
  { text: "온보딩", weight: 2 },

  { text: "행간 자간", weight: 1 },
  { text: "여백", weight: 1 },
  { text: "글라스", weight: 1 },
  { text: "다크모드", weight: 1 },
  { text: "톤앤무드", weight: 1 },
  { text: "퍼소나", weight: 1 },
  { text: "JTBD", weight: 1 },
  { text: "린캔버스", weight: 1 },
  { text: "와이어프레임", weight: 1 },
  { text: "IA", weight: 1 },
  { text: "유저플로", weight: 1 },
  { text: "케어", weight: 1 },
  { text: "리포트", weight: 1 },
  { text: "알림", weight: 1 },
  { text: "처방전", weight: 1 },
  { text: "타임라인", weight: 1 },
  { text: "일일 리포트", weight: 1 },
  { text: "오늘 일정", weight: 1 },
  { text: "결제 탭", weight: 1 },
  { text: "납부 이력", weight: 1 },
  { text: "더미데이터", weight: 1 },
  { text: "차트", weight: 1 },
  { text: "SVG", weight: 1 },
  { text: "이쁘게", weight: 1 },
  { text: "깔끔하게", weight: 1 },
  { text: "심플하게", weight: 1 },
  { text: "산만함 제거", weight: 1 },
  { text: "스러운", weight: 1 },
  { text: "공간 마련", weight: 1 },
  { text: "여유 공간", weight: 1 },
  { text: "사용자별", weight: 1 },
  { text: "역할별", weight: 1 },
  { text: "분기", weight: 1 },
  { text: "간호사", weight: 1 },
  { text: "보호자", weight: 1 },
  { text: "환자", weight: 1 },
  { text: "의료진", weight: 1 },
  { text: "정희님", weight: 1 },
  { text: "김순자", weight: 1 },
  { text: "현장 인터뷰", weight: 1 },
  { text: "시장 조사", weight: 1 },
  { text: "경쟁사 분석", weight: 1 },
  { text: "Apple Health", weight: 1 },
  { text: "Stripe", weight: 1 },
  { text: "iOS 프레임", weight: 1 },
  { text: "스테이터스바", weight: 1 },
  { text: "노치", weight: 1 },
  { text: "safe area", weight: 1 },
  { text: "스크롤 스냅", weight: 1 },
  { text: "스크롤 트리거", weight: 1 },
  { text: "GSAP", weight: 1 },
  { text: "Lenis", weight: 1 },
  { text: "Tailwind", weight: 1 },
  { text: "Next.js", weight: 1 },
  { text: "Vercel", weight: 1 },
  { text: "GitHub", weight: 1 },
  { text: "푸시해줘", weight: 1 },
  { text: "커밋", weight: 1 },
  { text: "롤백", weight: 1 },
  { text: "다국어", weight: 1 },
  { text: "Pretendard", weight: 1 },
  { text: "노트북에서", weight: 1 },
  { text: "복잡도 컷", weight: 1 },
  { text: "디버깅", weight: 1 },
  { text: "/simplify", weight: 1 },
  { text: "/ultrareview", weight: 1 },
  { text: "/loop", weight: 1 },
  { text: "음, 별로", weight: 1 },
  { text: "이건 아냐", weight: 1 },
  { text: "통과", weight: 1 },
  { text: "괜찮네", weight: 1 },
];

type PillStyle = { bg: string; fg: string; border?: string };
const palette: PillStyle[] = [
  { bg: "#ffffff", fg: "#0a0a0a" },
  { bg: "#2c7afc", fg: "#ffffff" },
  { bg: "#0f1b3a", fg: "#74a8ff", border: "rgba(116,168,255,0.4)" },
  { bg: "#7eff8d", fg: "#0a0a0a" },
  { bg: "#7c4dff", fg: "#ffffff" },
  { bg: "#10b9c4", fg: "#0a0a0a" },
  { bg: "#d946ef", fg: "#ffffff" },
  { bg: "transparent", fg: "#ffffff", border: "rgba(255,255,255,0.3)" },
  { bg: "#1a2447", fg: "#ffffff" },
  { bg: "#ff6b9d", fg: "#0a0a0a" },
  { bg: "#fbbf24", fg: "#0a0a0a" },
  { bg: "transparent", fg: "#7eff8d", border: "rgba(126,255,141,0.4)" },
];

function hash(n: number): number {
  const x = (n * 9301 + 49297) % 233280;
  return x / 233280;
}

function shuffled<T>(arr: T[]): T[] {
  return arr
    .map((p, i) => ({ p, k: hash(i * 17 + 3) }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => p);
}

export function PromptGrammarScene() {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  const pills = useMemo(() => {
    const arr = shuffled(pillsData);
    return arr.map((p, i) => ({
      ...p,
      style: palette[(i * 5 + Math.floor(hash(i) * 7)) % palette.length],
      rot: (hash(i * 11 + 5) - 0.5) * 4,
    }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#0a1024]"
    >
      <div className="relative flex min-h-screen w-full flex-col py-20 md:py-24">
        <div className="px-6 text-center">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}
          >
            우리가 자주 보낸 말들.
          </h2>
        </div>

        <div className="mt-10 flex flex-1 items-center justify-center md:mt-14">
          <div className="flex w-screen flex-wrap items-center justify-center gap-1.5 px-1 md:gap-2 md:px-2">
            {pills.map((pill, i) => {
              const w = pill.weight;
              const sizeMap = {
                1: {
                  font: "clamp(0.85rem, 1.2vw, 1.25rem)",
                  pad: "0.46em 0.95em",
                },
                2: {
                  font: "clamp(1.1rem, 1.95vw, 2rem)",
                  pad: "0.55em 1.15em",
                },
                3: {
                  font: "clamp(1.5rem, 3vw, 3.2rem)",
                  pad: "0.62em 1.35em",
                },
              };
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
                    fontSize: sizeMap[w].font,
                    padding: sizeMap[w].pad,
                    transform: `rotate(${pill.rot}deg) ${
                      revealed ? "scale(1)" : "scale(0.7)"
                    }`,
                    opacity: revealed ? 1 : 0,
                    transition: `opacity 420ms cubic-bezier(0.2, 1, 0.4, 1) ${
                      Math.min(i * 12, 1100)
                    }ms, transform 520ms cubic-bezier(0.2, 1, 0.4, 1) ${
                      Math.min(i * 12, 1100)
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
          className="mt-10 px-6 text-center font-sans text-sm text-white/55 md:mt-12"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 800ms ease-out 1400ms",
          }}
        >
          51개 대화에서 가장 자주 보낸 말들 — 총 {pills.length}개.
        </p>
      </div>
    </section>
  );
}
