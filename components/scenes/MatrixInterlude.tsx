"use client";

import { useEffect, useRef, useState } from "react";
import { Scene } from "./Scene";
import { FEATURES, COMPETITORS, MATRIX } from "@/lib/research";

export function MatrixInterlude() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const total = COMPETITORS.length;
  const covered = FEATURES.map((name, i) => ({
    name,
    count: MATRIX[i].reduce((s, v) => s + v, 0),
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <Scene id="s-matrix" height="tall" bg="bg-black">
      <div ref={ref} className="mx-auto w-full max-w-[1500px] px-6 py-20 md:px-12 md:py-28">
        <h2
          className="font-sans font-bold leading-[0.98] tracking-tight text-white"
          style={{ fontSize: "clamp(2.8rem, 8vw, 8.5rem)" }}
        >
          기능 14개. 경쟁사 12개.
          <br />
          <span className="text-white/35">10개는 이미 있다.</span>
        </h2>

        <div className="mt-20 space-y-4 md:mt-28 md:space-y-5">
          {covered.map((r, i) => {
            const delay = i * 110;
            return (
              <div
                key={r.name}
                className="grid grid-cols-[170px_1fr_60px] items-center gap-4 md:grid-cols-[360px_1fr_110px] md:gap-10"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 500ms ease, transform 700ms cubic-bezier(0.2,0.9,0.3,1)`,
                  transitionDelay: `${delay}ms`,
                }}
              >
                <span
                  className="font-sans font-medium leading-tight text-white/85"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.7rem)" }}
                >
                  {r.name}
                </span>
                <div className="relative h-12 overflow-hidden rounded-sm bg-white/[0.04] md:h-16">
                  <div
                    className="h-full bg-white/45"
                    style={{
                      width: visible ? `${(r.count / total) * 100}%` : "0%",
                      transition: `width 1200ms cubic-bezier(0.2,0.9,0.3,1)`,
                      transitionDelay: `${delay + 200}ms`,
                    }}
                  />
                </div>
                <span
                  className="text-right font-mono tabular-nums text-white/55"
                  style={{
                    fontSize: "clamp(0.95rem, 1.3vw, 1.45rem)",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 500ms ease",
                    transitionDelay: `${delay + 800}ms`,
                  }}
                >
                  {r.count}/{total}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </Scene>
  );
}
