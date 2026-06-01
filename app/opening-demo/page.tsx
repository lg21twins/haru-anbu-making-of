"use client";

import { useState } from "react";
import { OpenA } from "@/components/opening-demo/OpenA";
import { OpenB } from "@/components/opening-demo/OpenB";
import { OpenC } from "@/components/opening-demo/OpenC";

type Variant = "A" | "B" | "C";

const TABS: { key: Variant; title: string; desc: string }[] = [
  { key: "A", title: "A · 명령 → 규모 폭격", desc: "명령 → 12,236 숫자 → 코드 생성" },
  { key: "B", title: "B · 콜드 오픈 루프", desc: "한 사이클 먼저 → 명령 → 숫자" },
  { key: "C", title: "C · 완성본 → 되감기", desc: "완성 화면 플래시 → 되감기 → 명령" },
];

export default function OpeningDemoPage() {
  const [variant, setVariant] = useState<Variant>("A");
  const [runId, setRunId] = useState(0);

  const select = (v: Variant) => {
    setVariant(v);
    setRunId((r) => r + 1);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* 컨트롤 바 */}
      <header className="absolute left-0 right-0 top-0 z-50 flex flex-wrap items-center gap-2 border-b border-white/8 bg-black/70 px-4 py-2.5 backdrop-blur">
        <div className="mr-3 text-[11px] uppercase tracking-[0.3em] text-white/50">
          오프닝 3안
        </div>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => select(t.key)}
            className="rounded-full px-3 py-1.5 text-[12px] transition"
            style={{
              background:
                variant === t.key ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.06)",
              color: variant === t.key ? "#000" : "rgba(255,255,255,.7)",
            }}
          >
            {t.title}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[11px] text-white/40 md:inline">
            {TABS.find((t) => t.key === variant)?.desc}
          </span>
          <button
            onClick={() => setRunId((r) => r + 1)}
            className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/80 transition hover:bg-white/10"
          >
            ↻ 다시 재생
          </button>
        </div>
      </header>

      {/* 스테이지 */}
      <div className="absolute inset-0 pt-[52px]">
        <div className="relative h-full w-full" key={`${variant}-${runId}`}>
          {variant === "A" && <OpenA />}
          {variant === "B" && <OpenB />}
          {variant === "C" && <OpenC />}
        </div>
      </div>
    </main>
  );
}
