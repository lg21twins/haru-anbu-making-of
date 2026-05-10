"use client";

import { useEffect, useRef, useState } from "react";

const text = `자 넌 이제부터
우리의 프로젝트 "하루안부"를 담당할
기획자이자
디자이너이자
영상 제작자야.`;

const PRE_HOLD = 0.08;
const POST_HOLD = 0.12;

export function OpeningPromptScene() {
  const outerRef = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) {
        setChars(text.length);
        return;
      }
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = scrolled / range;
      const typeProgress = Math.max(
        0,
        Math.min(1, (p - PRE_HOLD) / (1 - PRE_HOLD - POST_HOLD))
      );
      setChars(Math.round(text.length * typeProgress));
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

  return (
    <section ref={outerRef} className="relative w-full" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center bg-black">
        <div className="w-full px-6 md:px-16">
          <h1
            className="font-sans font-semibold leading-[1.05] tracking-tight text-white whitespace-pre-line"
            style={{ fontSize: "clamp(2.6rem, 7.5vw, 7.5rem)" }}
          >
            {text.slice(0, chars)}
            <span className="caret" aria-hidden />
          </h1>
        </div>
      </div>
    </section>
  );
}
