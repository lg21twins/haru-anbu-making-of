"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { to: number; label: string; format?: (n: number) => string };

const STATS: Stat[] = [
  { to: 12236, label: "줄의 대화.", format: (n) => n.toLocaleString() },
  { to: 612, label: "줄의 수정 명령.", format: (n) => n.toLocaleString() },
  { to: 228, label: "번의 재제작." },
  { to: 106, label: "일." },
];

const COUNT_MS = 620;
const HOLD_MS = 760;
const FADE_MS = 320;
const GAP_MS = 90;

/** 숫자가 카운트업 → 라벨 붙고 hold → 페이드아웃, 4개 연속. 끝나면 onDone */
export function NumbersSlam({ onDone }: { onDone?: () => void }) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let raf = 0;
    const timers: number[] = [];

    const runStat = (i: number) => {
      if (i >= STATS.length) {
        onDoneRef.current?.();
        return;
      }
      const stat = STATS[i];
      setIndex(i);
      setValue(0);
      setLabel(false);
      setShow(true);

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / COUNT_MS);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(stat.to * eased));
        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setValue(stat.to);
          setLabel(true);
          timers.push(
            window.setTimeout(() => {
              setShow(false);
              timers.push(
                window.setTimeout(() => runStat(i + 1), FADE_MS + GAP_MS)
              );
            }, HOLD_MS)
          );
        }
      };
      raf = requestAnimationFrame(tick);
    };

    runStat(0);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const current = STATS[index];

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div
        className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2"
        style={{
          fontSize: "clamp(2.4rem, 8vw, 8rem)",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(-10px)",
          transition: `opacity ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1), transform ${FADE_MS}ms cubic-bezier(0.2,1,0.4,1)`,
        }}
      >
        <span className="font-sans font-semibold leading-none tracking-tight text-white tabular-nums">
          {current.format ? current.format(value) : value}
        </span>
        <span
          className="font-sans font-semibold leading-none tracking-tight text-white"
          style={{
            opacity: label ? 1 : 0,
            transform: label ? "translateX(0)" : "translateX(-12px)",
            transition:
              "opacity 480ms cubic-bezier(0.2,1,0.4,1), transform 520ms cubic-bezier(0.2,1,0.4,1)",
          }}
        >
          {current.label}
        </span>
      </div>
    </div>
  );
}
