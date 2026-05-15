"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  id: string;
  prompt: string;
  cat: "리서치" | "기획" | "디자인" | "구현" | "디버깅";
};

// 06_로그/대화기록_작업로그.md 에서 발췌한 실제 프롬프트
const rows: Row[] = [
  {
    id: "#01",
    prompt:
      "안에 있는 파일 분석해서 우리가 이 프로젝트를 만들기 전에 경쟁사 및 시장 조사를 할꺼야",
    cat: "리서치",
  },
  {
    id: "#10",
    prompt: "간호사한테 인터뷰할 질문 → 의료인으로 단어 대체해서 다시 만들어줘",
    cat: "리서치",
  },
  {
    id: "#14",
    prompt:
      "컬러 팔레트 추천해줘, 사용자별 컬러를 다르게 하자는 얘기도 나왔는데",
    cat: "디자인",
  },
  {
    id: "#19",
    prompt: "순차적으로 다 만들어",
    cat: "디자인",
  },
  {
    id: "#29",
    prompt: "v7 홈화면, Apple Liquid Glass 느낌으로 리디자인 해봐",
    cat: "디자인",
  },
  {
    id: "#38",
    prompt: "케어 대시보드를 벤토 그리드 + SVG 차트로 다시 짜봐",
    cat: "구현",
  },
  {
    id: "#47",
    prompt: "글래스 요소들이 뷰포트 상관없이 잘 보이는 방법 없어?",
    cat: "디버깅",
  },
  {
    id: "#48",
    prompt: "홈화면 네비바로 다른 페이지도 동일하게 통일해",
    cat: "구현",
  },
];

const CAT_COLOR: Record<Row["cat"], string> = {
  리서치: "#74a8ff",
  기획: "#7c4dff",
  디자인: "#7eff8d",
  구현: "#00d4ff",
  디버깅: "#ffb86b",
};

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
      const t = Math.max(0, Math.min(1, (p - 0.08) / 0.8));
      setShown(Math.round(rows.length * t));
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
            우리가 실제로 보낸 프롬프트.
          </h2>
        </div>

        <div className="w-full max-w-5xl px-6">
          {/* 표 헤더 */}
          <div className="mb-3 hidden grid-cols-[80px_1fr_120px] gap-6 border-b border-white/15 pb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40 md:grid">
            <span>id</span>
            <span>prompt</span>
            <span className="text-right">category</span>
          </div>

          <ul>
            {rows.map((r, i) => (
              <li
                key={r.id}
                className="grid grid-cols-[60px_1fr_84px] items-center gap-3 border-b border-white/8 py-4 md:grid-cols-[80px_1fr_120px] md:gap-6 md:py-5"
                style={{
                  opacity: shown > i ? 1 : 0,
                  transform: shown > i ? "translateX(0)" : "translateX(-36px)",
                  transition: `opacity 540ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 40
                  }ms, transform 540ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 40
                  }ms`,
                }}
              >
                <span className="font-mono text-[13px] text-white/45 md:text-sm">
                  {r.id}
                </span>
                <p
                  className="font-sans font-medium leading-snug text-white"
                  style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)" }}
                >
                  "{r.prompt}"
                </p>
                <span
                  className="justify-self-end rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] md:px-3 md:text-[11px]"
                  style={{
                    color: CAT_COLOR[r.cat],
                    borderColor: `${CAT_COLOR[r.cat]}55`,
                    background: `${CAT_COLOR[r.cat]}10`,
                  }}
                >
                  {r.cat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="mt-10 px-6 text-center font-sans text-sm text-white/45"
          style={{
            opacity: shown >= rows.length ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          총 51개 엔트리 중 8개 발췌.
        </p>
      </div>
    </section>
  );
}
