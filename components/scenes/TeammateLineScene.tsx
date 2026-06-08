"use client";

import { useEffect, useRef, useState } from "react";
import { lockScrollAt, releaseAndAdvance, ScrollLock } from "@/lib/scrollLock";
import { waitForSpace, SpaceGate } from "@/lib/waitForSpace";

// 프롬프트("…프롬프트 엔지니어야.") 다음 검은 화면 전환:
// 1줄(그러나 …않았다) 떠오름 → 한 박자 뒤 2줄(한 명의 팀원으로서…) → 스페이스바로 다음 씬(로고 채팅).
const IN_MS = 600; // line1 등장
const LINE1_HOLD = 1250; // line1 단독 유지
const REVEAL_MS = 650; // line2 등장
const BOTH_HOLD = 2000; // 둘 다 유지 (reduced-motion 전용)
const OUT_MS = 600;

type Phase = "idle" | "line1" | "line2" | "out" | "done";

export function TeammateLineScene() {
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
          // 2줄까지 다 떠오른 뒤, 자동 진행하지 않고 스페이스바를 기다림.
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
        {/* 1줄 — 대조 */}
        <p
          className="font-sans font-semibold leading-[1.3] tracking-tight text-white"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 3.4rem)",
            opacity: show1 ? 1 : 0,
            transform: show1 ? "translateY(0)" : "translateY(14px)",
            transition:
              "opacity 600ms cubic-bezier(0.2,1,0.4,1), transform 640ms cubic-bezier(0.2,1,0.4,1)",
          }}
        >
          그러나 우리는 AI를
          <br />
          <span className="text-[var(--color-accent-green)]">수동적으로</span> 이용하지 않았다.
        </p>

        {/* 2줄 — 결론 */}
        <p
          className="mt-9 font-sans font-medium leading-[1.4] tracking-tight text-white/70"
          style={{
            fontSize: "clamp(1.1rem, 2.7vw, 2.1rem)",
            opacity: show2 ? 1 : 0,
            transform: show2 ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 620ms cubic-bezier(0.2,1,0.4,1), transform 660ms cubic-bezier(0.2,1,0.4,1)",
          }}
        >
          한 명의 <span className="font-semibold text-white">팀원</span>으로서,
          함께 부딪치며 만들었다.
        </p>
      </div>
    </section>
  );
}
