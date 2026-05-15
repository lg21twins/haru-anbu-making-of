"use client";

import { useEffect, useRef, useState } from "react";

type Stack = {
  tool: string;
  role: string;
  weight: string;
  accent: string;
  logo: string;
  // 로고 색이 흐려지지 않도록 배경/패딩을 톤별로 조정
  logoBg: string;
};

const stack: Stack[] = [
  {
    tool: "Claude",
    role: "기획 · 디자인 · 코드 · 시나리오",
    weight: "메인 파트너",
    accent: "#d97757",
    logo: "/media/stack/claude.png",
    logoBg: "bg-white/5",
  },
  {
    tool: "Higgsfield",
    role: "영상 · 1차 → 4차 진화",
    weight: "영상 디렉팅",
    accent: "#c4ff3a",
    logo: "/media/stack/higgsfield.png",
    logoBg: "bg-white/5",
  },
  {
    tool: "Figma",
    role: "디자인 시스템 · 목업 · 핸드오프",
    weight: "디자인 본진",
    accent: "#7c4dff",
    logo: "/media/stack/figma.png",
    logoBg: "bg-white/5",
  },
  {
    tool: "VS Code",
    role: "에디터 · v8 보호자앱 구현 환경",
    weight: "코드 에디터",
    accent: "#2c7afc",
    logo: "/media/stack/vscode.png",
    logoBg: "bg-white/5",
  },
  {
    tool: "GPT",
    role: "프롬프트 · 레퍼런스 비주얼 생성",
    weight: "이미지 생성",
    accent: "#10a37f",
    logo: "/media/stack/gpt.png",
    logoBg: "bg-white",
  },
  {
    tool: "Codex",
    role: "코드 리뷰 · 패치 제안",
    weight: "코딩 검토",
    accent: "#8b7fff",
    logo: "/media/stack/codex.png",
    logoBg: "bg-white/5",
  },
];

export function AIStackScene() {
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
      const t = Math.max(0, Math.min(1, (p - 0.1) / 0.7));
      setShown(Math.round(stack.length * t));
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
    <section ref={ref} className="relative w-full" style={{ height: "520vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-10 px-6 text-center md:mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            ai stack
          </p>
          <h2
            className="mt-2 font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            어떤 AI가 어디서 일했나.
          </h2>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {stack.map((s, i) => (
            <div
              key={s.tool}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              style={{
                opacity: shown > i ? 1 : 0,
                transform: shown > i ? "translateY(0)" : "translateY(36px)",
                transition: `opacity 660ms cubic-bezier(0.2, 1, 0.4, 1) ${
                  i * 70
                }ms, transform 660ms cubic-bezier(0.2, 1, 0.4, 1) ${i * 70}ms`,
              }}
            >
              <div
                className="absolute -top-14 -right-14 h-28 w-28 rounded-full opacity-40 blur-3xl"
                style={{ background: s.accent }}
              />
              <div
                className={`relative mb-4 grid h-14 w-14 place-items-center overflow-hidden rounded-xl ${s.logoBg}`}
              >
                <img
                  src={s.logo}
                  alt={`${s.tool} 로고`}
                  className="h-11 w-11 object-contain"
                  draggable={false}
                />
              </div>
              <div className="relative flex items-baseline justify-between gap-3">
                <h3
                  className="font-sans font-semibold text-white"
                  style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.55rem)" }}
                >
                  {s.tool}
                </h3>
                <span
                  className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: s.accent }}
                >
                  {s.weight}
                </span>
              </div>
              <p className="relative mt-2 text-sm leading-snug text-white/65">
                {s.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
