"use client";

import { useState } from "react";
import { Typed } from "./Typed";
import { NumbersSlam } from "./NumbersSlam";
import { MiniMaterialize } from "./MiniMaterialize";

const COMMAND = `넌 이제부터
우리 팀의 디자이너이자
개발자이자
영상 감독이자
프롬프트 엔지니어다.`;

type Phase = "command" | "hold" | "numbers" | "materialize" | "end";

/** A · 명령 → 규모 폭격 → 코드 생성 */
export function OpenA() {
  const [phase, setPhase] = useState<Phase>("command");

  return (
    <div className="relative h-full w-full bg-black text-white">
      {/* 명령 */}
      <div
        className="absolute inset-0 flex items-end justify-center px-6 pb-[16vh] md:px-16"
        style={{
          opacity: phase === "command" || phase === "hold" ? 1 : 0,
          transition: "opacity 600ms",
          pointerEvents: "none",
        }}
      >
        <h1
          className="w-full whitespace-pre-line font-sans font-semibold leading-[1.06] tracking-tight"
          style={{ fontSize: "clamp(2.2rem, 6vw, 5.4rem)" }}
        >
          {phase === "command" ? (
            <Typed
              text={COMMAND}
              msPerChar={34}
              onDone={() =>
                window.setTimeout(() => setPhase("numbers"), 700)
              }
            />
          ) : (
            <>
              {COMMAND}
              <span className="caret" aria-hidden />
            </>
          )}
        </h1>
      </div>

      {/* 숫자 */}
      {phase === "numbers" && (
        <div className="absolute inset-0">
          <NumbersSlam onDone={() => setPhase("materialize")} />
        </div>
      )}

      {/* 코드 생성 */}
      {(phase === "materialize" || phase === "end") && (
        <div
          className="absolute inset-0"
          style={{ opacity: phase === "end" ? 0.35 : 1, transition: "opacity 600ms" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[10vh] z-10 -translate-x-1/2 whitespace-nowrap font-sans font-semibold text-white/90"
            style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)" }}>
            명령이 화면이 되는 순간.
          </div>
          <MiniMaterialize onDone={() => setPhase("end")} />
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
