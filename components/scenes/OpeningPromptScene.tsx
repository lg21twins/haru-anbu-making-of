"use client";

import { useEffect, useRef, useState } from "react";

const fullText = `자 넌 이제부터
우리의 프로젝트 "하루안부"를 담당할
기획자이자
UX 리서처이자
시장 분석가이자
정보 설계자이자
브랜드 전략가이자
디자이너이자
로고 디자이너이자
모션 디자이너이자
프론트엔드 개발자이자
시나리오 작가이자
영상 제작자이자
카피라이터이자
프롬프트 엔지니어야.`;

const PRE_HOLD = 0.05;
const POST_HOLD = 0.08;

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
        setChars(fullText.length);
        return;
      }
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = scrolled / range;
      const typeProgress = Math.max(
        0,
        Math.min(1, (p - PRE_HOLD) / (1 - PRE_HOLD - POST_HOLD))
      );
      setChars(Math.round(fullText.length * typeProgress));
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
    <section
      ref={outerRef}
      className="relative w-full"
      style={{ height: "560vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-end justify-center overflow-hidden bg-black">
        <div className="w-full px-6 pb-[14vh] md:px-16 md:pb-[16vh]">
          <h1
            className="font-sans font-semibold leading-[1.06] tracking-tight text-white whitespace-pre-line"
            style={{ fontSize: "clamp(2.4rem, 6.4vw, 6rem)" }}
          >
            {fullText.slice(0, chars)}
            <span className="caret" aria-hidden />
          </h1>
        </div>
      </div>
    </section>
  );
}
