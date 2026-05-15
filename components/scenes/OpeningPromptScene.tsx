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

// 섹션 높이 = 100vh(고정 뷰) + SCROLL_VH(타이핑 구간)
const SCROLL_VH = 260; // 이만큼 스크롤해야 타이핑 끝
const TAIL_VH = 60; // 타이핑 끝난 뒤 잠시 머무는 여유

export function OpeningPromptScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const lastCharsRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setChars(fullText.length);
      return;
    }

    // 새로고침/뒤로가기 시 브라우저가 이전 스크롤 위치를 복원하면 타이핑이 즉시 끝난 것처럼 보임
    let prevRestoration: ScrollRestoration | null = null;
    if ("scrollRestoration" in history) {
      prevRestoration = history.scrollRestoration;
      history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const ensureAudio = () => {
      if (audioCtxRef.current) return audioCtxRef.current;
      const win = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const Ctx = win.AudioContext ?? win.webkitAudioContext;
      if (!Ctx) return null;
      try {
        audioCtxRef.current = new Ctx();
      } catch {
        audioCtxRef.current = null;
      }
      return audioCtxRef.current;
    };

    const playTick = () => {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(2);
        } catch {
          /* noop */
        }
      }
      const ctx = ensureAudio();
      if (!ctx || ctx.state === "closed") return;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 1400 + Math.random() * 300;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.018, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch {
        /* noop */
      }
    };

    const compute = () => {
      pendingRef.current = null;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 타이핑 구간: 섹션 top이 0(뷰포트 상단)에 도달한 순간부터 SCROLL_VH 만큼 스크롤
      const scrolled = Math.max(0, -rect.top);
      const total = (SCROLL_VH / 100) * vh;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const next = Math.round(progress * fullText.length);
      if (next !== lastCharsRef.current) {
        if (next > lastCharsRef.current) playTick();
        lastCharsRef.current = next;
        setChars(next);
      }
    };

    const onScroll = () => {
      if (pendingRef.current != null) return;
      pendingRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (pendingRef.current != null) cancelAnimationFrame(pendingRef.current);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (prevRestoration && "scrollRestoration" in history) {
        history.scrollRestoration = prevRestoration;
      }
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `calc(100vh + ${SCROLL_VH + TAIL_VH}vh)` }}
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
