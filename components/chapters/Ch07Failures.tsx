"use client";

import { useState } from "react";
import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { failures } from "@/lib/failures";

export function Ch07Failures() {
  const [active, setActive] = useState(0);
  const f = failures[active];

  return (
    <ChapterShell
      id="ch07"
      label="FAILURE GALLERY"
      index="CH 07"
      className="bg-[#0a0908]"
    >
      <div className="px-6 pb-32 pt-32 md:px-12">
        <header className="mb-14 max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-[#ff8a65]">
            CH 07 · WHAT WENT WRONG
          </p>
          <h2 className="mt-6 font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
            <SplitTextReveal text="다 처음부터" />
            <br />
            <SplitTextReveal
              text="잘된 게 아니다."
              className="text-[#ff8a65]"
              delay={0.35}
            />
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">
            지우지 않고 모은 망한 결과물. 실패가 가장 정직한 증거.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <nav className="space-y-1.5">
            {failures.map((it, i) => {
              const isActive = i === active;
              return (
                <button
                  key={it.number}
                  type="button"
                  data-cursor="link"
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-all ${
                    isActive
                      ? "bg-[#ff8a65]/10 ring-1 ring-[#ff8a65]/30"
                      : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`font-display text-3xl font-bold tabular-nums leading-none transition-colors ${
                      isActive ? "text-[#ff8a65]" : "text-white/25"
                    }`}
                  >
                    {it.number}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={`truncate font-mono text-[10px] tracking-[0.25em] ${
                        isActive ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {it.category}
                    </span>
                    <span
                      className={`mt-0.5 truncate text-sm leading-snug ${
                        isActive ? "text-white" : "text-white/55"
                      }`}
                    >
                      {it.what}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          <article
            data-cursor="card"
            className="relative overflow-hidden rounded-3xl border border-[#ff8a65]/25 bg-[#0e0c0a]"
          >
            <div className="relative grid grid-cols-1 md:grid-cols-2">
              <div
                className="relative flex aspect-square flex-col justify-end overflow-hidden p-7 md:aspect-auto md:p-10"
                style={{
                  background:
                    "linear-gradient(140deg, #ff8a65 0%, #ff5722 60%, #c4421a 100%)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute -right-6 -top-10 font-display text-[260px] font-bold leading-none tracking-tighter text-white/15 md:text-[340px]"
                >
                  {f.number}
                </span>
                <p className="relative font-mono text-[11px] tracking-[0.3em] text-white/85">
                  {f.category}
                </p>
                <h3 className="relative mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                  {f.what}
                </h3>
              </div>

              <div className="grid grid-rows-3 divide-y divide-white/5 border-l border-white/5">
                <PaneRow
                  tag="WHY"
                  body={f.why}
                  accent="#ffc78a"
                />
                <PaneRow
                  tag="HOW FIXED"
                  body={f.fix}
                  accent="#74a8ff"
                  code={f.afterText}
                />
                <PaneRow
                  tag="RESULT"
                  body={f.result}
                  accent="#7df0a3"
                  resultMode
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 px-7 py-4 font-mono text-[11px] tracking-[0.3em] text-white/40">
              <span>FAILURE {f.number} / {String(failures.length).padStart(2, "0")}</span>
              <span className="hidden md:block">← → 키 또는 좌측에서 선택</span>
            </div>
          </article>
        </div>
      </div>
    </ChapterShell>
  );
}

function PaneRow({
  tag,
  body,
  accent,
  code,
  resultMode = false,
}: {
  tag: string;
  body: string;
  accent: string;
  code?: string;
  resultMode?: boolean;
}) {
  return (
    <div className="relative flex flex-col justify-center px-6 py-6 md:px-8 md:py-8">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="block h-2.5 w-2.5 rounded-full"
          style={{ background: accent }}
        />
        <span
          className="font-mono text-[10px] font-semibold tracking-[0.3em]"
          style={{ color: accent }}
        >
          {tag}
        </span>
      </div>
      <p
        className={`mt-2 leading-snug text-white/85 ${
          resultMode
            ? "text-lg font-semibold md:text-xl"
            : "text-sm md:text-base"
        }`}
        style={resultMode ? { color: accent } : undefined}
      >
        {body}
      </p>
      {code && (
        <pre className="mt-3 overflow-x-auto rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-white/70 whitespace-pre-wrap">
          {code}
        </pre>
      )}
    </div>
  );
}
