"use client";

import { useState } from "react";
import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { CountUp } from "@/components/effects/CountUp";
import {
  FEATURES,
  COMPETITORS,
  MATRIX,
  FINDINGS,
} from "@/lib/research";

export function Ch02Research() {
  const [hover, setHover] = useState<{ f: number; c: number } | null>(null);

  const featuredCount = (idx: number) =>
    MATRIX[idx].reduce((s, v) => s + v, 0);
  const competitorCount = (idx: number) =>
    MATRIX.reduce((s, row) => s + row[idx], 0);

  return (
    <ChapterShell
      id="ch03"
      label="RESEARCH MATRIX"
      index="CH 03"
      className="bg-[#0a0c11]"
    >
      <div className="px-6 pb-32 pt-32 md:px-12">
        <header className="mb-12 grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
              CH 03 · COMPETITIVE LANDSCAPE
            </p>
            <h2 className="mt-6 font-sans text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
              <SplitTextReveal text="14 기능 × 12 경쟁사" />
              <br />
              <SplitTextReveal
                text="블루오션을 찾았다."
                className="text-[color:var(--color-accent-pale)]"
                delay={0.35}
              />
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 md:gap-10">
            <Stat label="기능" value={14} />
            <Stat label="경쟁사" value={12} />
            <Stat label="매핑" value={MATRIX.flat().filter(Boolean).length} />
          </div>
        </header>

        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/50">
          국내 6 + 해외 6 경쟁사를 14개 기능 기준으로 매핑. 매트릭스가 비어있는 칸이 곧 우리 차별화 영역.
          오른쪽 패널의 빈 가로 줄 = ‘아무도 안 만든 기능’.
        </p>

        <div className="mb-16 overflow-x-auto">
          <table
            className="w-full min-w-[760px] border-collapse text-left text-xs"
            onMouseLeave={() => setHover(null)}
          >
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-[200px] bg-[#0a0c11] py-3 pr-4 font-mono text-[10px] tracking-[0.25em] text-white/40">
                  FUNCTION ↓ / COMPETITOR →
                </th>
                {COMPETITORS.map((c, ci) => (
                  <th
                    key={c.name}
                    className="px-1 pb-3 align-bottom"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      height: 130,
                    }}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.2em] ${
                        hover?.c === ci ? "text-white" : "text-white/50"
                      }`}
                    >
                      {c.name} · {c.origin === "KR" ? "🇰🇷" : "🌐"} ·{" "}
                      <span className="text-white/30">
                        {competitorCount(ci)}/14
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, fi) => {
                const count = featuredCount(fi);
                const isOurs = count === 0;
                return (
                  <tr key={feat} className="border-t border-white/5">
                    <td
                      className={`sticky left-0 z-10 bg-[#0a0c11] py-2 pr-4 font-sans text-sm ${
                        isOurs
                          ? "font-medium text-[color:var(--color-accent-pale)]"
                          : hover?.f === fi
                            ? "text-white"
                            : "text-white/65"
                      }`}
                    >
                      {feat}
                      <span className="ml-2 font-mono text-[10px] text-white/30">
                        {count}/12
                      </span>
                    </td>
                    {MATRIX[fi].map((v, ci) => (
                      <td
                        key={ci}
                        onMouseEnter={() => setHover({ f: fi, c: ci })}
                        data-cursor="link"
                        className={`h-8 cursor-cell border-l border-white/5 transition-colors`}
                        style={{
                          background:
                            v === 1
                              ? hover?.f === fi || hover?.c === ci
                                ? "rgba(124,168,255,0.85)"
                                : "rgba(124,168,255,0.55)"
                              : isOurs
                                ? hover?.f === fi
                                  ? "rgba(44,122,252,0.18)"
                                  : "rgba(44,122,252,0.06)"
                                : hover?.f === fi || hover?.c === ci
                                  ? "rgba(255,255,255,0.05)"
                                  : "transparent",
                        }}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FINDINGS.map((f, i) => (
            <article
              key={f.title}
              data-cursor="card"
              className="h-full rounded-xl border border-[color:var(--color-accent)]/30 bg-[#0b0d12] p-7 transition-colors hover:border-[color:var(--color-accent-pale)]"
            >
                <p className="font-mono text-[10px] tracking-[0.3em] text-[color:var(--color-accent-pale)]">
                  KEY FINDING · {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-sans text-xl font-semibold leading-snug text-white">
                  {f.title}
                </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-start border-l border-white/10 pl-5">
      <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">
        {label}
      </span>
      <span className="mt-2 font-display text-3xl font-semibold tracking-tight text-white tabular-nums md:text-5xl">
        <CountUp to={value} />
      </span>
    </div>
  );
}
