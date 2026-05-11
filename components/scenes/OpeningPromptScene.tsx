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
const MAX_CPS = 24; // 스크롤 속도와 무관하게 최대 타이핑 속도 (글자/초)

export function OpeningPromptScene() {
  const outerRef = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const charsRef = useRef(0);
  const targetRef = useRef(0);
  const accRef = useRef(0);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const computeTarget = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) {
        targetRef.current = fullText.length;
        return;
      }
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = scrolled / range;
      const typeProgress = Math.max(
        0,
        Math.min(1, (p - PRE_HOLD) / (1 - PRE_HOLD - POST_HOLD))
      );
      targetRef.current = Math.round(fullText.length * typeProgress);
    };

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
      // 햅틱 (안드로이드)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(2);
        } catch {
          /* ignore */
        }
      }
      // 미세한 키 클릭 사운드
      const ctx = ensureAudio();
      if (!ctx || ctx.state === "closed") return;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
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
        /* ignore */
      }
    };

    const tick = (now: number) => {
      const last = lastFrameRef.current || now;
      lastFrameRef.current = now;
      const dt = Math.min(0.1, (now - last) / 1000);

      const cur = charsRef.current;
      const tgt = targetRef.current;

      if (reduce) {
        if (cur !== tgt) {
          charsRef.current = tgt;
          setChars(tgt);
        }
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      let next = cur;
      if (tgt > cur) {
        accRef.current += MAX_CPS * dt;
        const step = Math.floor(accRef.current);
        if (step > 0) {
          accRef.current -= step;
          next = Math.min(tgt, cur + step);
        }
      } else if (tgt < cur) {
        // 스크롤 되감기 — 즉시 따라감
        next = tgt;
        accRef.current = 0;
      } else {
        // 정지 상태 — 잔여 누적 리셋해서 다음 진입 깔끔하게
        accRef.current = 0;
      }

      if (next !== cur) {
        charsRef.current = next;
        setChars(next);
        if (next > cur) playTick();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    computeTarget();
    rafRef.current = requestAnimationFrame(tick);

    const onScroll = () => computeTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", computeTarget);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", computeTarget);
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
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
