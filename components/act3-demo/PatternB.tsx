"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneMock, Stage } from "./PhoneMock";

const cmds = [
  "와이어프레임으로 구조부터 잡아",
  "그레이스케일로 위계 보자",
  "텍스트와 아이콘 채워줘",
  "하루안부 컬러 시스템 입혀",
  "AI 오브로 정체성 마무리",
];

const STEP_MS = 3200;
const TYPE_MS = 1600;

export function PatternB() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState<-1 | 0 | 1 | 2 | 3 | 4>(-1);
  const [typed, setTyped] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRunning(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    let stepTimer: number | null = null;
    let rafId: number | null = null;

    const playStep = (i: number) => {
      if (i >= cmds.length) {
        // loop
        stepTimer = window.setTimeout(() => {
          setStep(-1);
          setTyped(0);
          playStep(0);
        }, STEP_MS);
        return;
      }
      setStep(i as 0 | 1 | 2 | 3 | 4);
      setTyped(0);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / TYPE_MS);
        setTyped(Math.round(p * cmds[i].length));
        if (p < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      stepTimer = window.setTimeout(() => playStep(i + 1), STEP_MS);
    };

    playStep(0);
    return () => {
      if (stepTimer != null) window.clearTimeout(stepTimer);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [running]);

  const stageNum: Stage = step < 0 ? 0 : ((step + 1) as Stage);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.3em] text-white/40">
        Pattern B · Stack
      </div>

      <div className="grid h-full w-full grid-cols-[1fr_auto] items-center gap-12 px-12">
        {/* left — command stack */}
        <div className="flex h-full flex-col justify-center gap-3">
          <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/30">
            우리가 친 명령
          </div>
          {cmds.map((c, i) => {
            const visible = step >= i;
            const isCurrent = step === i;
            const display = isCurrent ? c.slice(0, typed) : c;
            return (
              <div
                key={i}
                className="font-sans font-medium leading-[1.3]"
                style={{
                  fontSize: "clamp(1.2rem, 1.9vw, 2rem)",
                  color: visible ? "rgba(255,255,255,.92)" : "rgba(255,255,255,0)",
                  opacity: visible ? 1 : 0,
                  transition: "opacity 480ms cubic-bezier(0.2,1,0.4,1)",
                }}
              >
                <span className="mr-3 text-white/30">›</span>
                {display}
                {isCurrent && <span className="caret" aria-hidden />}
              </div>
            );
          })}
        </div>

        {/* right — single phone evolving */}
        <div className="flex h-full items-center justify-center">
          <PhoneMock page="home" stage={stageNum} />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {cmds.map((_, i) => (
          <span
            key={i}
            className="h-1 w-8 rounded-full transition-colors"
            style={{
              background:
                step >= i ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.18)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
