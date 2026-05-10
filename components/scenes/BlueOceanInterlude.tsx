"use client";

import { useEffect, useRef, useState } from "react";

const blueOceans = [
  {
    name: "AI 요양 가이드",
    insight: "장기요양 정보는 흩어져 있다. AI가 한 번에 정리해주면 된다.",
  },
  {
    name: "환자 본인 앱",
    insight: "환자를 ‘사용자'로 본 앱이 없다. 우리는 만든다.",
  },
  {
    name: "감정 지지 챗봇",
    insight: "노인 심리 케어를 챗봇으로 푸는 시도 자체가 없다.",
  },
  {
    name: "고령자 전용 UI",
    insight: "큰 글씨, 단순 인터랙션. 글로벌도 미흡하다.",
  },
];

const INTRO = 0.06;

export function BlueOceanInterlude() {
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

  const introOpacity = Math.min(1, progress / INTRO);
  const phaseProgress = Math.max(0, (progress - INTRO) / (1 - INTRO));
  const rawIdx = Math.floor(phaseProgress * blueOceans.length);
  const idx = Math.max(0, Math.min(blueOceans.length - 1, rawIdx));

  return (
    <section ref={outerRef} className="relative w-full" style={{ height: "560vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-stretch justify-between overflow-hidden bg-black">
        <div
          className="flex flex-1 items-center px-6 md:px-12"
          style={{ opacity: introOpacity }}
        >
          <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 md:grid-cols-[1.55fr_1fr] md:gap-16">
            <div className="relative min-h-[36vh] md:min-h-[44vh]">
              {blueOceans.map((b, i) => {
                const isActive = i === idx;
                const dir = i < idx ? -1 : i > idx ? 1 : 0;
                return (
                  <h2
                    key={b.name}
                    className="absolute inset-0 flex items-center font-sans font-bold leading-[0.92] tracking-tight text-[color:var(--color-key)] transition-all duration-[700ms] ease-out"
                    style={{
                      fontSize: "clamp(2.8rem, 9vw, 9.5rem)",
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${dir * 28}px)`,
                      filter: isActive
                        ? "drop-shadow(0 0 40px rgba(126, 255, 141, 0.45))"
                        : "none",
                    }}
                  >
                    {b.name}
                  </h2>
                );
              })}
            </div>

            <div className="relative min-h-[26vh] md:min-h-[32vh]">
              {blueOceans.map((b, i) => {
                const isActive = i === idx;
                const dir = i < idx ? -1 : i > idx ? 1 : 0;
                return (
                  <div
                    key={b.name}
                    className="absolute inset-0 flex flex-col justify-center transition-all duration-[700ms] ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${dir * 24}px)`,
                    }}
                  >
                    <p
                      className="font-sans leading-snug text-white/85"
                      style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.85rem)" }}
                    >
                      {b.insight}
                    </p>
                    <p
                      className="mt-8 font-mono tabular-nums text-[color:var(--color-key)]"
                      style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.8rem)" }}
                    >
                      0 <span className="text-white/30">/ 12</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-center gap-2.5 pb-12 md:pb-16">
          {blueOceans.map((_, i) => (
            <span
              key={i}
              className="block h-[3px] transition-all duration-500"
              style={{
                width: i === idx ? "44px" : "14px",
                background:
                  i === idx
                    ? "var(--color-key)"
                    : i < idx
                      ? "rgba(126,255,141,0.45)"
                      : "rgba(255,255,255,0.18)",
                boxShadow:
                  i === idx ? "0 0 12px rgba(126,255,141,0.65)" : "none",
              }}
            />
          ))}
        </footer>
      </div>
    </section>
  );
}
