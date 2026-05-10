"use client";

import { useEffect, useRef, useState } from "react";

type Line =
  | { kind: "title"; text: string }
  | { kind: "section"; text: string }
  | { kind: "header"; text: string }
  | { kind: "name"; text: string }
  | { kind: "role"; role: string; name: string }
  | { kind: "prompt"; n: string; text: string }
  | { kind: "thanks"; text: string }
  | { kind: "spacer"; h: number };

const credits: Line[] = [
  { kind: "title", text: "MAKING OF" },
  { kind: "title", text: "하루안부." },
  { kind: "spacer", h: 14 },

  { kind: "section", text: "DIRECTED BY" },
  { kind: "name", text: "김지욱" },
  { kind: "spacer", h: 9 },

  { kind: "section", text: "WRITTEN BY" },
  { kind: "name", text: "김지욱" },
  { kind: "name", text: "Claude" },
  { kind: "spacer", h: 9 },

  { kind: "section", text: "CAST" },
  { kind: "role", role: "보호자", name: "김미영, 52" },
  { kind: "role", role: "간호사", name: "박지현, 34" },
  { kind: "role", role: "환자", name: "김순자, 78" },
  { kind: "spacer", h: 16 },

  { kind: "header", text: "AI ENSEMBLE" },
  { kind: "spacer", h: 6 },
  { kind: "role", role: "Claude (Opus 4)", name: "기획 · 디자인 · 코드" },
  { kind: "role", role: "Higgsfield · Cinema Studio", name: "AI 영상" },
  { kind: "role", role: "Midjourney v6", name: "AI 이미지 · 페르소나" },
  { kind: "role", role: "Remotion", name: "프로그래매틱 영상" },
  { kind: "role", role: "Figma", name: "초기 와이어프레임" },
  { kind: "role", role: "Pretendard Variable", name: "타이포그래피" },
  { kind: "role", role: "Iconify · Fluent", name: "아이콘" },
  { kind: "role", role: "Next.js 16 · GSAP · R3F", name: "이 사이트" },
  { kind: "spacer", h: 16 },

  { kind: "header", text: "PROMPTS" },
  { kind: "spacer", h: 6 },
  {
    kind: "prompt",
    n: "01",
    text: "넌 이제부터 우리의 프로젝트 \"하루안부\"를 담당할 기획자이자 디자이너이자 영상 제작자야.",
  },
  { kind: "prompt", n: "02", text: "누구를 위해 만들지부터 정해." },
  { kind: "prompt", n: "03", text: "그들이 진짜 원하는 게 뭔지 찾아내." },
  { kind: "prompt", n: "04", text: "시장에서 우리만 할 수 있는 게 뭔지도." },
  { kind: "prompt", n: "05", text: "우리 기획서 가지고 로고 만들어봐." },
  {
    kind: "prompt",
    n: "06",
    text: "이건 로고가 아니라 다이어그램이잖아. 다시.",
  },
  { kind: "prompt", n: "07", text: "캐릭터 같아. 의료 신뢰감이 없어. 다시." },
  { kind: "prompt", n: "08", text: "색이 너무 많아 무거워. 단순하게 다시." },
  { kind: "prompt", n: "09", text: "기능 그대로네. 시그니처 한 곡선으로 가자." },
  { kind: "prompt", n: "10", text: "디자인 시작." },
  { kind: "prompt", n: "11", text: "다시." },
  { kind: "prompt", n: "12", text: "다시." },
  { kind: "prompt", n: "13", text: "다시." },
  { kind: "prompt", n: "14", text: "열세 번 다시 그렸다." },
  { kind: "prompt", n: "15", text: "이거야!" },
  { kind: "prompt", n: "16", text: "근데 자주 틀렸다." },
  { kind: "prompt", n: "17", text: "영상까지 가자." },
  { kind: "prompt", n: "18", text: "다시." },
  { kind: "prompt", n: "19", text: "다시." },
  { kind: "prompt", n: "20", text: "4차에서 멈췄다." },
  { kind: "prompt", n: "...", text: "외 56개의 명령." },
  { kind: "spacer", h: 16 },

  { kind: "header", text: "ARTIFACTS" },
  { kind: "spacer", h: 6 },
  { kind: "role", role: "13 design iterations", name: "v1 → v13" },
  { kind: "role", role: "5 logo iterations", name: "v1 → v5" },
  { kind: "role", role: "4 Higgsfield videos", name: "iter1 → iter4" },
  { kind: "role", role: "168 cells", name: "14 × 12 경쟁사" },
  {
    kind: "role",
    role: "4 blue oceans",
    name: "AI 가이드 / 본인 앱 / 챗봇 / UI",
  },
  { kind: "role", role: "1,845줄", name: "76 entries · 28 days" },
  { kind: "spacer", h: 16 },

  { kind: "section", text: "FOR" },
  { kind: "name", text: "엄마와, 엄마의 엄마와," },
  { kind: "name", text: "그리고 우리 모두를 위한 하루." },
  { kind: "spacer", h: 18 },

  { kind: "thanks", text: "THANK YOU." },
  { kind: "spacer", h: 8 },
  { kind: "title", text: "─ FIN ─" },
  { kind: "spacer", h: 8 },
];

const TOTAL_VH = 600;

export function CreditsScene() {
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

  const vh = 100 - 112 * progress;
  const pct = progress * 100;
  const transform = `translateY(calc(${vh}vh - ${pct}%))`;

  return (
    <section
      ref={outerRef}
      id="s-credits"
      className="relative w-full"
      style={{ height: `${TOTAL_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent"
        />

        <div
          className="absolute inset-x-0 mx-auto max-w-3xl px-6 text-center md:px-12"
          style={{ transform, willChange: "transform" }}
        >
          {credits.map((line, i) => (
            <CreditLine key={i} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CreditLine({ line }: { line: Line }) {
  switch (line.kind) {
    case "title":
      return (
        <div
          className="my-10 font-sans font-semibold leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)" }}
        >
          {line.text}
        </div>
      );
    case "section":
      return (
        <div className="mb-3 font-mono text-[11px] tracking-[0.45em] text-[color:var(--color-key)]/85 md:text-xs">
          {line.text}
        </div>
      );
    case "header":
      return (
        <div className="font-mono text-sm tracking-[0.5em] text-[color:var(--color-key)] md:text-base">
          {line.text}
        </div>
      );
    case "name":
      return (
        <div className="my-0.5 font-sans text-2xl leading-tight text-white md:text-3xl">
          {line.text}
        </div>
      );
    case "role":
      return (
        <div className="my-1 grid grid-cols-2 items-baseline gap-6 md:gap-12">
          <div className="text-right font-mono text-xs leading-relaxed text-white/55 md:text-sm">
            {line.role}
          </div>
          <div className="text-left font-sans text-base font-medium leading-relaxed text-white md:text-lg">
            {line.name}
          </div>
        </div>
      );
    case "prompt":
      return (
        <div className="my-1.5 grid grid-cols-[auto_1fr] items-baseline gap-4 text-left md:gap-6">
          <div className="font-mono text-xs tabular-nums text-[color:var(--color-key)]/70 md:text-sm">
            #{line.n}
          </div>
          <div className="font-mono text-sm leading-relaxed text-white/85 md:text-base">
            {line.text}
          </div>
        </div>
      );
    case "thanks":
      return (
        <div
          className="my-6 font-sans font-bold leading-none tracking-tight text-[color:var(--color-key)]"
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)",
            filter: "drop-shadow(0 0 30px rgba(126, 255, 141, 0.5))",
          }}
        >
          {line.text}
        </div>
      );
    case "spacer":
      return <div style={{ height: `${line.h * 0.45}rem` }} />;
  }
}
