"use client";

import { useEffect, useRef, useState } from "react";
import { Typed } from "./Typed";
import { PhoneMock, PageKind, Stage } from "@/components/act3-demo/PhoneMock";

const PAGES: PageKind[] = ["home", "chat", "report", "alert", "mypage"];
const COMMAND = "넌 이제부터 우리 팀이다.";

type Phase = "flash" | "freeze" | "copy" | "rewind" | "command" | "end";

/** C · 완성본 플래시 → 되감기 → 명령 (영화식 콜드 오픈) */
export function OpenC() {
  const [phase, setPhase] = useState<Phase>("flash");
  const [shown, setShown] = useState(0); // 0~5
  const [rewindStage, setRewindStage] = useState<Stage>(4);
  const onceRef = useRef(false);

  // flash — 폰 하나씩 등장
  useEffect(() => {
    if (phase !== "flash") return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= PAGES.length) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase("freeze"), 350);
      }
    }, 280);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "freeze") return;
    const id = window.setTimeout(() => setPhase("copy"), 700);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "copy") return;
    const id = window.setTimeout(() => setPhase("rewind"), 1500);
    return () => window.clearTimeout(id);
  }, [phase]);

  // rewind — stage 4→0
  useEffect(() => {
    if (phase !== "rewind") return;
    let s = 4;
    setRewindStage(4);
    const id = window.setInterval(() => {
      s -= 1;
      setRewindStage(Math.max(0, s) as Stage);
      if (s <= 0) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase("command"), 500);
      }
    }, 360);
    return () => window.clearInterval(id);
  }, [phase]);

  const stripDim = phase === "copy" || phase === "rewind";
  const stripVisible = phase !== "command" && phase !== "end";

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      {/* 폰 스트립 */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-3 px-4"
        style={{
          opacity: stripVisible ? 1 : 0,
          filter: stripDim ? "brightness(0.5)" : "none",
          transform: phase === "rewind" ? "scale(0.92)" : "scale(1)",
          transition:
            "opacity 600ms, filter 600ms, transform 700ms cubic-bezier(0.2,1,0.4,1)",
        }}
      >
        {PAGES.map((p, i) => (
          <div
            key={p}
            style={{
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 360ms, transform 360ms cubic-bezier(0.2,1,0.4,1)",
            }}
          >
            <PhoneMock
              page={p}
              stage={phase === "rewind" || phase === "command" ? rewindStage : 4}
              scale={0.46}
            />
          </div>
        ))}
      </div>

      {/* 카피 */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{
          opacity: phase === "copy" || phase === "rewind" ? 1 : 0,
          transition: "opacity 700ms",
        }}
      >
        <div
          className="font-sans font-semibold leading-[1.12] tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)" }}
        >
          이걸 우리가
          <br />
          어떻게 만들었냐면
        </div>
      </div>

      {/* 명령 */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{
          opacity: phase === "command" || phase === "end" ? 1 : 0,
          transition: "opacity 600ms",
          pointerEvents: "none",
        }}
      >
        <h1
          className="font-sans font-semibold leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}
        >
          {phase === "command" && (
            <Typed
              text={COMMAND}
              msPerChar={48}
              onDone={() => {
                if (onceRef.current) return;
                onceRef.current = true;
                window.setTimeout(() => setPhase("end"), 600);
              }}
            />
          )}
          {phase === "end" && (
            <>
              {COMMAND}
              <span className="caret" aria-hidden />
            </>
          )}
        </h1>
      </div>

      {phase === "end" && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[12px] uppercase tracking-[0.3em] text-white/40">
          ↑ 다시 재생
        </div>
      )}
    </div>
  );
}
