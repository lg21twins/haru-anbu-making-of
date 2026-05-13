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

const CPS = 28; // 글자/초
const START_DELAY_MS = 250;
const DWELL_AFTER_MS = 1300; // 타이핑 끝나고 풀릴 때까지 잡고 있는 시간

type LenisLike = { stop: () => void; start: () => void };

export function OpeningPromptScene() {
  const outerRef = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const charsRef = useRef(0);
  const accRef = useRef(0);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false);
  const lockedRef = useRef(false);
  const dwellTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setChars(fullText.length);
      return;
    }

    const getLenis = (): LenisLike | null => {
      const w = window as unknown as { __lenis?: LenisLike };
      return w.__lenis ?? null;
    };

    const lock = () => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    };

    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      getLenis()?.start();
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
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
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(2);
        } catch {
          /* noop */
        }
      }
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
        /* noop */
      }
    };

    const tick = (now: number) => {
      const last = lastFrameRef.current || now;
      lastFrameRef.current = now;
      const dt = Math.min(0.1, (now - last) / 1000);
      const cur = charsRef.current;
      if (cur < fullText.length) {
        accRef.current += CPS * dt;
        const step = Math.floor(accRef.current);
        if (step > 0) {
          accRef.current -= step;
          const next = Math.min(fullText.length, cur + step);
          charsRef.current = next;
          setChars(next);
          playTick();
          if (next === fullText.length) {
            dwellTimerRef.current = window.setTimeout(unlock, DWELL_AFTER_MS);
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      }
      // 타이핑이 끝나면 rAF도 멈춤 — 더 할 일 없음
    };

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      lock();
      lastFrameRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    // 브라우저 스크롤 복원이 켜져있으면 오프닝이 스킵돼 보이는 문제 방지
    let prevRestoration: ScrollRestoration | null = null;
    if ("scrollRestoration" in history) {
      prevRestoration = history.scrollRestoration;
      history.scrollRestoration = "manual";
    }
    // 페이지 첫 진입은 항상 최상단에서 시작 — 해시가 없을 때만
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const initTimer = window.setTimeout(start, START_DELAY_MS);

    return () => {
      window.clearTimeout(initTimer);
      if (dwellTimerRef.current) window.clearTimeout(dwellTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      unlock();
      if (prevRestoration && "scrollRestoration" in history) {
        history.scrollRestoration = prevRestoration;
      }
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
  }, []);

  return (
    <section
      ref={outerRef}
      className="relative w-full"
      style={{ height: "100vh" }}
    >
      <div className="flex h-full w-full items-end justify-center overflow-hidden bg-black">
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
