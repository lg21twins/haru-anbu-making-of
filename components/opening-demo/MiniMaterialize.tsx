"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneMock, Stage } from "@/components/act3-demo/PhoneMock";

const STEPS = [
  "> build(\"보호자 홈\")",
  "  ↳ layout      ✓",
  "  ↳ tokens      ✓",
  "  ↳ content     ✓",
  "  ↳ ai-orb      ✓",
  "done.",
];

const STEP_MS = 620;

/** 코드가 한 줄씩 찍히면서 폰이 와이어프레임 → 완성으로 진화. 끝나면 onDone */
export function MiniMaterialize({ onDone }: { onDone?: () => void }) {
  const [step, setStep] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= STEPS.length) {
        window.clearInterval(id);
        window.setTimeout(() => onDoneRef.current?.(), 900);
      }
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  // step 1~4 → stage 1~4
  const stage = Math.max(0, Math.min(4, step - 1)) as Stage;

  return (
    <div className="flex h-full w-full items-center justify-center gap-8 px-8 md:gap-16">
      {/* 코드 */}
      <div className="hidden w-[340px] flex-col gap-1.5 font-mono text-[14px] leading-relaxed md:flex">
        {STEPS.map((line, i) => (
          <div
            key={i}
            style={{
              opacity: i < step ? 1 : 0,
              transform: i < step ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 300ms, transform 300ms",
              color: line.includes("✓")
                ? "rgba(255,255,255,.55)"
                : line.startsWith(">")
                ? "#ffffff"
                : "rgba(255,255,255,.4)",
            }}
          >
            {line}
            {i === step - 1 && i < STEPS.length && (
              <span className="caret" aria-hidden />
            )}
          </div>
        ))}
      </div>

      {/* 폰 */}
      <div
        style={{
          transition: "transform 500ms cubic-bezier(0.2,1,0.4,1)",
          transform: `scale(${0.9 + stage * 0.025})`,
        }}
      >
        <PhoneMock page="home" stage={stage} scale={0.92} />
      </div>
    </div>
  );
}
