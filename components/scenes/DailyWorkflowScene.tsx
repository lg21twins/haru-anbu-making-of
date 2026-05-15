"use client";

import { useEffect, useRef, useState } from "react";

const day = [
  { time: "09:00", task: "전날 결과물 다시 읽기", tool: "Claude" },
  { time: "10:30", task: "이슈 발견 → 다시 프롬프트", tool: "Claude" },
  { time: "13:00", task: "디자인 시안 새로 그리기", tool: "Claude + Figma" },
  { time: "16:00", task: "코드로 옮기기", tool: "Claude Code" },
  { time: "19:00", task: "영상 1컷 돌리기", tool: "Higgsfield" },
  { time: "22:00", task: "내일 plan 정리", tool: "Claude" },
];

export function DailyWorkflowScene() {
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
      const t = Math.max(0, Math.min(1, (p - 0.1) / 0.78));
      setShown(Math.round(day.length * t));
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
        <div className="mb-12 px-6 text-center">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            우리의 하루는 이렇게 흘렀다.
          </h2>
        </div>

        <ol className="relative w-full max-w-3xl px-6">
          <div className="pointer-events-none absolute left-[calc(7.5rem+1.5rem)] top-3 bottom-3 w-px bg-white/10" />
          {day.map((d, i) => (
            <li
              key={d.time}
              className="relative flex items-start gap-6 pb-7 last:pb-0"
              style={{
                opacity: shown > i ? 1 : 0,
                transform: shown > i ? "translateY(0)" : "translateY(20px)",
                transition:
                  "opacity 620ms cubic-bezier(0.2, 1, 0.4, 1), transform 620ms cubic-bezier(0.2, 1, 0.4, 1)",
              }}
            >
              <span className="w-24 shrink-0 text-right font-mono text-sm text-white/40">
                {d.time}
              </span>
              <span className="relative z-10 mt-[0.4rem] inline-block h-3 w-3 shrink-0 rounded-full bg-[color:var(--color-key)] shadow-[0_0_12px_var(--color-key-glow)]" />
              <div className="min-w-0">
                <p
                  className="font-sans font-semibold text-white"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
                >
                  {d.task}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  with {d.tool}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p
          className="mt-6 px-6 text-center font-sans text-sm text-white/45"
          style={{
            opacity: shown >= day.length ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          이 패턴을 55일 반복했다.
        </p>
      </div>
    </section>
  );
}
