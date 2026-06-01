"use client";

import { useEffect, useRef, useState } from "react";
import { Typed } from "./Typed";
import { NumbersSlam } from "./NumbersSlam";
import { PhoneMock, Stage } from "@/components/act3-demo/PhoneMock";

const PROMPT = '"노인 안부 앱 — 보호자 홈 화면"';
const COMMAND = "넌 이제부터 우리 팀이다.";

type Phase =
  | "prompt"
  | "think"
  | "render"
  | "grammar"
  | "command"
  | "numbers"
  | "end";

/** B · 콜드 오픈 루프 — 한 사이클(명령→AI→결과) 먼저 보여주고 본막으로 */
export function OpenB() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [stage, setStage] = useState<Stage>(0);

  // render 단계 — 폰 stage 0→4
  useEffect(() => {
    if (phase !== "render") return;
    setStage(0);
    let s = 0;
    const id = window.setInterval(() => {
      s += 1;
      setStage(Math.min(4, s) as Stage);
      if (s >= 4) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase("grammar"), 700);
      }
    }, 520);
    return () => window.clearInterval(id);
  }, [phase]);

  // think → render
  useEffect(() => {
    if (phase !== "think") return;
    const id = window.setTimeout(() => setPhase("render"), 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  // grammar → command
  useEffect(() => {
    if (phase !== "grammar") return;
    const id = window.setTimeout(() => setPhase("command"), 1500);
    return () => window.clearTimeout(id);
  }, [phase]);

  const showPhone =
    phase === "render" || phase === "grammar";

  return (
    <div className="relative h-full w-full bg-black text-white">
      {/* 1. 프롬프트 입력 (터미널) */}
      <div
        className="absolute left-1/2 top-[16vh] z-20 -translate-x-1/2 font-mono"
        style={{
          fontSize: "clamp(1rem, 2.4vw, 1.7rem)",
          opacity:
            phase === "prompt" || phase === "think" || phase === "render"
              ? 1
              : 0,
          transition: "opacity 500ms",
        }}
      >
        <span className="text-white/40">$ </span>
        {phase === "prompt" ? (
          <Typed
            text={PROMPT}
            msPerChar={42}
            className="text-white"
            onDone={() => window.setTimeout(() => setPhase("think"), 350)}
          />
        ) : (
          <span className="text-white">
            {PROMPT}
            {phase === "think" && (
              <span className="ml-2 text-white/50">··· AI ···</span>
            )}
          </span>
        )}
      </div>

      {/* 2~3. 폰 렌더 */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: showPhone ? 1 : 0,
          transition: "opacity 500ms",
          paddingTop: "6vh",
        }}
      >
        <PhoneMock page="home" stage={stage} scale={0.92} />
      </div>

      {/* 4. 문법 자막 */}
      <div
        className="pointer-events-none absolute bottom-[14vh] left-1/2 -translate-x-1/2 text-center font-sans font-semibold text-white"
        style={{
          fontSize: "clamp(1.1rem, 2.6vw, 2rem)",
          opacity: phase === "grammar" ? 1 : 0,
          transition: "opacity 600ms",
        }}
      >
        = 이 사이트가 작동하는 방식.
      </div>

      {/* 5. 본막 — 명령 */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{
          opacity: phase === "command" ? 1 : 0,
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
              onDone={() => window.setTimeout(() => setPhase("numbers"), 800)}
            />
          )}
        </h1>
      </div>

      {/* 6. 숫자 */}
      {(phase === "numbers" || phase === "end") && (
        <div
          className="absolute inset-0"
          style={{ opacity: phase === "end" ? 0.3 : 1, transition: "opacity 500ms" }}
        >
          <NumbersSlam onDone={() => setPhase("end")} />
        </div>
      )}

      {phase === "end" && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[12px] uppercase tracking-[0.3em] text-white/40">
          ↑ 다시 재생
        </div>
      )}
    </div>
  );
}
