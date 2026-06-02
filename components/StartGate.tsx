"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { lockScrollAt, ScrollLock } from "@/lib/scrollLock";

// 로드 직후 자동 시작하지 않고 대기 → 스페이스바(또는 클릭)로 숫자 폭격부터 시작.
type Phase = "wait" | "go" | "gone";

export function StartGate() {
  const [phase, setPhase] = useState<Phase>("wait");
  const lockRef = useRef<ScrollLock | null>(null);
  const goneTimer = useRef<number | null>(null);

  const start = useCallback(() => {
    const w = window as { __haruStarted?: boolean };
    if (w.__haruStarted) return;
    w.__haruStarted = true;
    // AutoStats가 같은 틱에 락을 넘겨받음 → 그 후 게이트 락 해제 (스크롤 풀림 방지)
    window.dispatchEvent(new CustomEvent("haru:start"));
    lockRef.current?.release();
    lockRef.current = null;
    setPhase("go");
    goneTimer.current = window.setTimeout(() => setPhase("gone"), 700);
  }, []);

  useEffect(() => {
    // 시작 전 스크롤/자동재생 잠금
    lockRef.current = lockScrollAt(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (goneTimer.current) window.clearTimeout(goneTimer.current);
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, [start]);

  if (phase === "gone") return null;

  // 발표용 — 아무 표시 없는 검은 화면. 스페이스바(또는 클릭)로 시작.
  return (
    <div
      onClick={start}
      aria-hidden
      className="fixed inset-0 z-[200] bg-black"
      style={{
        opacity: phase === "wait" ? 1 : 0,
        transition: "opacity 650ms ease",
        pointerEvents: phase === "wait" ? "auto" : "none",
      }}
    />
  );
}
