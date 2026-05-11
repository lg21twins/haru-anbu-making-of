"use client";

import { useEffect, useRef, useState } from "react";

const stack = [
  {
    tool: "Claude",
    role: "기획 · 디자인 · 코드 · 시나리오",
    weight: "메인 파트너",
    accent: "#7eff8d",
  },
  {
    tool: "Higgsfield",
    role: "영상 · 1차 → 4차 진화",
    weight: "영상 디렉팅",
    accent: "#2c7afc",
  },
  {
    tool: "Figma",
    role: "디자인 시스템 · 목업 · 핸드오프",
    weight: "디자인 본진",
    accent: "#7c4dff",
  },
  {
    tool: "Claude Code",
    role: "v8 보호자앱 풀 구현",
    weight: "코드 실행",
    accent: "#00d4ff",
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
      const t = Math.max(0, Math.min(1, (p - 0.15) / 0.65));
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
    <section ref={ref} className="relative w-full" style={{ height: "440vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-12 px-6 text-center">
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

        <div className="grid w-full max-w-5xl grid-cols-1 gap-5 px-6 md:grid-cols-2">
          {stack.map((s, i) => (
            <div
              key={s.tool}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              style={{
                opacity: shown > i ? 1 : 0,
                transform: shown > i ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 660ms cubic-bezier(0.2, 1, 0.4, 1) ${
                  i * 80
                }ms, transform 660ms cubic-bezier(0.2, 1, 0.4, 1) ${i * 80}ms`,
              }}
            >
              <div
                className="absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-40 blur-3xl"
                style={{ background: s.accent }}
              />
              <div className="relative flex items-baseline justify-between">
                <h3
                  className="font-sans font-semibold text-white"
                  style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
                >
                  {s.tool}
                </h3>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: s.accent }}
                >
                  {s.weight}
                </span>
              </div>
              <p className="relative mt-3 text-sm text-white/65">{s.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
