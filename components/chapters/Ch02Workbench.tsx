"use client";

import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { quotes, sketchNotes } from "@/lib/quotes";

const tapeColors = ["#f5d9a4", "#e8b4d0", "#a8d8c4", "#dfe8a3"];
const rotations = [-2.4, 1.6, -1.2, 2.8];

export function Ch02Workbench() {
  return (
    <ChapterShell
      id="ch02"
      label="WORKBENCH · 인간의 목소리"
      index="CH 02"
      className="bg-[#f1ebe1] text-[#1d1410]"
    >
      <div className="relative px-6 pb-32 pt-32 md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <header className="relative mb-14 max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-[#7a6a55]">
            CH 02 · BEFORE THE PIXELS
          </p>
          <h2 className="mt-6 font-sans text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-[#1d1410]">
            <SplitTextReveal text="픽셀 이전에" />
            <br />
            <SplitTextReveal
              text="사람의 말이 있었다."
              className="text-[#a3502c]"
              delay={0.35}
            />
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#3a2c20] md:text-lg">
            현장 인터뷰, 교수님 피드백, 회고 노트 — 디지털로 옮기기 전에 종이 위에 남은 목소리.
            화면에 들어간 모든 결정의 출발점.
          </p>
        </header>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
          {quotes.map((q, i) => (
            <article
              key={q.author}
              className="relative bg-white px-7 pb-7 pt-12"
              style={{
                boxShadow:
                  "0 6px 16px -8px rgba(60,30,10,0.18), 0 1px 0 rgba(0,0,0,0.04)",
                transform: `rotate(${rotations[i % rotations.length]}deg)`,
              }}
            >
              <span
                className="absolute -top-3 left-1/2 block h-7 w-24 -translate-x-1/2 -rotate-3 opacity-70"
                style={{
                  background: tapeColors[i % tapeColors.length],
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.08)",
                }}
                aria-hidden
              />
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#a3502c]">
                {q.tone === "interview"
                  ? "INTERVIEW"
                  : q.tone === "review"
                    ? "REVIEW"
                    : "SELF"}
              </p>
              <blockquote className="mt-3 font-sans text-lg leading-[1.55] text-[#1d1410] md:text-xl">
                “{q.body}”
              </blockquote>
              <footer className="mt-6 flex items-baseline justify-between border-t border-black/10 pt-3">
                <div>
                  <p className="font-display text-base font-semibold text-[#1d1410]">
                    {q.author}
                  </p>
                  <p className="text-xs text-[#6a553f]">{q.role}</p>
                </div>
                <p className="font-mono text-[10px] text-[#7a6a55]">
                  {q.context}
                </p>
              </footer>
            </article>
          ))}
        </div>

        <div className="relative mt-24">
          <p className="font-mono text-[11px] tracking-[0.3em] text-[#7a6a55]">
            SKETCHBOOK · 작업 노트 발췌
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {sketchNotes.map((n, i) => (
              <div
                key={n.body}
                className="px-4 py-3"
                style={{
                  background: "#fff8e8",
                  borderLeft: "4px solid #1d1410",
                  transform: `rotate(${(i % 2 === 0 ? -0.8 : 1.1)}deg)`,
                  boxShadow: "1px 2px 6px rgba(60,30,10,0.12)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "#2a1f15",
                  maxWidth: 280,
                }}
              >
                <span className="mr-3 text-[10px] font-bold tracking-[0.2em] text-[#a3502c]">
                  {n.tag}
                </span>
                {n.body}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
