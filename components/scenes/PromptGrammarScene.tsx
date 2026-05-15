"use client";

import { useEffect, useRef, useState } from "react";

const patterns = [
  { cmd: "다시.", count: 47, note: "가장 많이 쓴 한 마디" },
  { cmd: "이거야.", count: 12, note: "처음 통과 신호" },
  { cmd: "더 단순하게.", count: 28, note: "복잡도 컷" },
  { cmd: "왜 안 돼?", count: 19, note: "디버깅 트리거" },
  { cmd: "X로 가자.", count: 34, note: "방향 결정" },
  { cmd: "맥락을 다시 줘봐.", count: 11, note: "흐름 회복" },
];

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
      const t = Math.max(0, Math.min(1, (p - 0.1) / 0.78));
      setShown(Math.round(patterns.length * t));
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
    <section ref={ref} className="relative w-full" style={{ height: "580vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-12 px-6 text-center">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            우리가 자주 쓴 명령의 문법.
          </h2>
        </div>

        <ul className="w-full max-w-3xl space-y-5 px-6">
          {patterns.map((p, i) => (
            <li
              key={p.cmd}
              className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4"
              style={{
                opacity: shown > i ? 1 : 0,
                transform: shown > i ? "translateX(0)" : "translateX(-40px)",
                transition:
                  "opacity 560ms cubic-bezier(0.2, 1, 0.4, 1), transform 560ms cubic-bezier(0.2, 1, 0.4, 1)",
              }}
            >
              <div className="min-w-0">
                <span
                  className="font-sans font-semibold text-white"
                  style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}
                >
                  "{p.cmd}"
                </span>
                <span className="ml-3 font-mono text-xs text-white/40">
                  {p.note}
                </span>
              </div>
              <span
                className="shrink-0 font-mono font-semibold text-[color:var(--color-key)]"
                style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}
              >
                {p.count}회
              </span>
            </li>
          ))}
        </ul>

        <p
          className="mt-10 px-6 text-center font-sans text-sm text-white/45"
          style={{
            opacity: shown >= patterns.length ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          이 여섯 마디로 거의 다 했다.
        </p>
      </div>
    </section>
  );
}
