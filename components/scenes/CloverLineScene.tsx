"use client";

import { useEffect, useRef, useState } from "react";
import { lockScrollAt, releaseAndAdvance, ScrollLock } from "@/lib/scrollLock";
import { waitForSpace, SpaceGate } from "@/lib/waitForSpace";

// 진입 → 락 → 1줄(비유) 떠오름 → 한 박자 뒤 2줄(정체=AI) 공개 → 스페이스바를 누르면 다음 씬으로.
const IN_MS = 600; // line1 등장
const LINE1_HOLD = 1150; // line1 단독 유지
const REVEAL_MS = 600; // line2 등장
const BOTH_HOLD = 1900; // 둘 다 유지 (reduced-motion 전용)
const OUT_MS = 600;

type Phase = "idle" | "line1" | "line2" | "out" | "done";

export function CloverLineScene() {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const startedRef = useRef(false);
  const lockRef = useRef<ScrollLock | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let gate: SpaceGate | null = null;

    const finish = () => {
      const node = ref.current;
      if (!node) {
        lockRef.current?.release();
        lockRef.current = null;
        setPhase("done");
        return;
      }
      const nextTop = node.offsetTop + node.offsetHeight;
      releaseAndAdvance(lockRef.current, nextTop, () => setPhase("done"));
      lockRef.current = null;
    };

    const run = () => {
      if (reduce) {
        setPhase("line2");
        timers.push(window.setTimeout(finish, BOTH_HOLD));
        return;
      }
      setPhase("line1");
      timers.push(
        window.setTimeout(() => {
          setPhase("line2");
          // line2(=AI 팀원)가 다 떠오른 뒤, 자동 진행하지 않고 스페이스바를 기다림.
          timers.push(
            window.setTimeout(() => {
              gate = waitForSpace();
              gate.promise.then(() => {
                setPhase("out");
                timers.push(window.setTimeout(finish, OUT_MS));
              });
            }, REVEAL_MS)
          );
        }, IN_MS + LINE1_HOLD)
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting && e.intersectionRatio >= 0.85 && !startedRef.current) {
          startedRef.current = true;
          io.disconnect();
          const node = ref.current;
          if (node && !reduce) lockRef.current = lockScrollAt(node.offsetTop);
          run();
        }
      },
      { threshold: [0.85, 1] }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      gate?.cancel();
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, []);

  const show1 = phase === "line1" || phase === "line2";
  const show2 = phase === "line2";

  return (
    <section ref={ref} className="relative w-full bg-black" style={{ height: "100vh" }}>
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* 1줄 — 비유 */}
        <p
          className="font-sans font-semibold leading-[1.25] tracking-tight text-white"
          style={{
            fontSize: "clamp(1.6rem, 4.6vw, 3.8rem)",
            opacity: show1 ? 1 : 0,
            transform: show1 ? "translateY(0)" : "translateY(14px)",
            transition:
              "opacity 600ms cubic-bezier(0.2,1,0.4,1), transform 640ms cubic-bezier(0.2,1,0.4,1)",
          }}
        >
          저희에겐
          <br />
          <span className="text-[#34C759]">네잎클로버</span>가 있었거든요.
        </p>

        {/* 2줄 — 정체 공개 (AI) */}
        <p
          className="mt-8 font-sans font-medium leading-[1.3] tracking-tight text-white/65"
          style={{
            fontSize: "clamp(1.15rem, 2.8vw, 2.2rem)",
            opacity: show2 ? 1 : 0,
            transform: show2 ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 600ms cubic-bezier(0.2,1,0.4,1), transform 640ms cubic-bezier(0.2,1,0.4,1)",
          }}
        >
          그게 바로, 저희의 <span className="font-semibold text-white">AI 팀원</span>이었죠.
        </p>
      </div>
    </section>
  );
}
