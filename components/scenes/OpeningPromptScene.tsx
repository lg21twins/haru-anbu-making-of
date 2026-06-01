"use client";

import { useEffect, useRef, useState } from "react";
import { lockScrollAt, releaseAndAdvance, ScrollLock } from "@/lib/scrollLock";

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

// 자동 타이핑 — 들어오면 락 걸리고, 다 쳐질 때까지 스크롤 막힌 뒤 다음 씬으로.
const PLAY_MS = 5200;
const HOLD_AFTER_MS = 1000;
const MIN_CLICK_GAP_MS = 38;

export function OpeningPromptScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const startedRef = useRef(false);
  const lockRef = useRef<ScrollLock | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastClickRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (typeof window === "undefined" || !el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    // 첫 사용자 제스처에 오디오 컨텍스트 미리 해제 (자동재생이라도 소리 나게)
    const unlockAudio = () => {
      const ctx = ensureAudio();
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("wheel", unlockAudio, { once: true, passive: true });
    window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });

    const playKeyClick = () => {
      const now = performance.now();
      if (now - lastClickRef.current < MIN_CLICK_GAP_MS) return;
      lastClickRef.current = now;
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
        const t = ctx.currentTime;
        // 클랙 (고역 noise 버스트)
        const burstLen = Math.floor(ctx.sampleRate * 0.045);
        const noiseBuf = ctx.createBuffer(1, burstLen, ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < burstLen; i++) {
          const decay = Math.pow(1 - i / burstLen, 2.6);
          data[i] = (Math.random() * 2 - 1) * decay;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 2400 + Math.random() * 600;
        bp.Q.value = 1.4;
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.0001, t);
        nGain.gain.exponentialRampToValueAtTime(0.085, t + 0.002);
        nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        noise.connect(bp);
        bp.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(t);
        // thunk (저역 짧은 사인)
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(95 + Math.random() * 25, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);
        const oGain = ctx.createGain();
        oGain.gain.setValueAtTime(0.0001, t);
        oGain.gain.exponentialRampToValueAtTime(0.055, t + 0.003);
        oGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        osc.connect(oGain);
        oGain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      } catch {
        /* noop */
      }
    };

    let rafId: number | null = null;
    let holdTimer: number | null = null;

    const finish = () => {
      const node = sectionRef.current;
      if (!node) {
        lockRef.current?.release();
        lockRef.current = null;
        return;
      }
      const nextTop = node.offsetTop + node.offsetHeight;
      releaseAndAdvance(lockRef.current, nextTop, () => {});
      lockRef.current = null;
    };

    const start = () => {
      if (reduce) {
        setChars(fullText.length);
        return;
      }
      const t0 = performance.now();
      let last = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / PLAY_MS);
        const n = Math.round(p * fullText.length);
        if (n !== last) {
          if (n > last) playKeyClick();
          last = n;
          setChars(n);
        }
        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setChars(fullText.length);
          holdTimer = window.setTimeout(finish, HOLD_AFTER_MS);
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting && e.intersectionRatio >= 0.85 && !startedRef.current) {
          startedRef.current = true;
          io.disconnect();
          const node = sectionRef.current;
          if (node && !reduce) lockRef.current = lockScrollAt(node.offsetTop);
          start();
        }
      },
      { threshold: [0.85, 1] }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
      if (holdTimer != null) window.clearTimeout(holdTimer);
      lockRef.current?.release();
      lockRef.current = null;
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("wheel", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: "100vh" }}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
        <div className="w-full px-6 md:px-16">
          <h1
            className="font-sans font-semibold tracking-tight text-white whitespace-pre-line"
            style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.7rem)", lineHeight: 1.2 }}
          >
            {fullText.slice(0, chars)}
            <span className="caret" aria-hidden />
          </h1>
        </div>
      </div>
    </section>
  );
}
