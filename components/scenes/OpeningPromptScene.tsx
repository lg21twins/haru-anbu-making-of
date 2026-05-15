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
const SCROLL_VH = 260;
const TAIL_VH = 60;
// 스크롤이 아무리 빨라도 한 글자당 최소 이 ms는 걸린다 (≈ 33 cps 캡)
const MIN_MS_PER_CHAR = 30;

export function OpeningPromptScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const charsRef = useRef(0);
  const targetRef = useRef(0);
  const lastTickMsRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setChars(fullText.length);
      return;
    }

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

    // 기계식 키 클릭 — noise 트랜션트(클랙) + 짧은 저역 thunk + 살짝의 고역 팝
    const playKeyClick = () => {
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

        // 1) 클랙(고역 noise 버스트)
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
        nGain.gain.setValueAtTime(0.0001, now);
        nGain.gain.exponentialRampToValueAtTime(0.085, now + 0.002);
        nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        noise.connect(bp);
        bp.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(now);

        // 2) thunk(저역 짧은 사인)
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(95 + Math.random() * 25, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);
        const oGain = ctx.createGain();
        oGain.gain.setValueAtTime(0.0001, now);
        oGain.gain.exponentialRampToValueAtTime(0.055, now + 0.003);
        oGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        osc.connect(oGain);
        oGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);

        // 3) 살짝의 고역 클릭(세밀한 tick)
        const tickOsc = ctx.createOscillator();
        tickOsc.type = "triangle";
        tickOsc.frequency.value = 3200 + Math.random() * 400;
        const tGain = ctx.createGain();
        tGain.gain.setValueAtTime(0.0001, now);
        tGain.gain.exponentialRampToValueAtTime(0.02, now + 0.001);
        tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
        tickOsc.connect(tGain);
        tGain.connect(ctx.destination);
        tickOsc.start(now);
        tickOsc.stop(now + 0.025);
      } catch {
        /* noop */
      }
    };

    const computeTarget = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const scrolled = Math.max(0, -rect.top);
      const total = (SCROLL_VH / 100) * vh;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      targetRef.current = Math.round(progress * fullText.length);
    };

    const loop = (now: number) => {
      // 타겟 따라잡기 — 한 글자당 MIN_MS_PER_CHAR 간격 유지, 글자마다 클릭음
      const tgt = targetRef.current;
      const cur = charsRef.current;
      if (cur < tgt) {
        if (!lastTickMsRef.current) lastTickMsRef.current = now;
        if (now - lastTickMsRef.current >= MIN_MS_PER_CHAR) {
          const next = cur + 1;
          charsRef.current = next;
          setChars(next);
          playKeyClick();
          lastTickMsRef.current = now;
        }
      } else if (cur > tgt) {
        // 스크롤 뒤로가면 즉시 줄임 (사운드 X)
        charsRef.current = tgt;
        setChars(tgt);
        lastTickMsRef.current = 0;
      } else {
        // 같음 — 다음 진행 때 즉시 시작 가능하게
        lastTickMsRef.current = 0;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    computeTarget();
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget);

    return () => {
      window.removeEventListener("scroll", computeTarget);
      window.removeEventListener("resize", computeTarget);
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
