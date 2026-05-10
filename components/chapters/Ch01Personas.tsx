"use client";

import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { TiltCard } from "@/components/effects/TiltCard";
import { personas, jtbds } from "@/lib/personas";

export function Ch01Personas() {
  return (
    <ChapterShell
      id="ch01"
      label="PERSONAS · JTBD"
      index="CH 01"
      className="bg-[#0e1014]"
    >
      <div className="px-6 pb-32 pt-32 md:px-12">
        <header className="mb-16 max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
            CH 01 · PROBLEM FRAMING
          </p>
          <h2 className="mt-6 font-sans text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-white">
            <SplitTextReveal text="누구를 위해" />
            <br />
            <SplitTextReveal
              text="만드는가."
              className="text-[color:var(--color-accent-pale)]"
              delay={0.35}
            />
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">
            한 앱에 세 사람이 만난다. 보호자 · 의료진 · 환자.
          </p>
        </header>

        <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-3">
          {personas.map((p, idx) => (
            <TiltCard key={p.name} strength={4}>
              <article
                data-cursor="card"
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12]"
                style={{ boxShadow: `inset 0 0 0 1px ${p.color}30` }}
              >
                <div
                  className="relative aspect-[5/3] w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, ${p.color}aa)`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute right-5 top-4 font-display text-[120px] font-semibold leading-none tracking-tight text-white/15"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-6 bottom-5 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[11px] font-medium tracking-[0.3em] text-white/85">
                        {p.role.toUpperCase()}
                      </p>
                      <h3 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white">
                        {p.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-black/30 px-3 py-1 font-mono text-xs tabular-nums text-white/90 backdrop-blur-md">
                      {p.age}세
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-5 p-6">
                  <blockquote
                    className="border-l-2 pl-4 font-sans text-base leading-[1.5] text-white md:text-lg"
                    style={{ borderColor: p.color }}
                  >
                    “{p.quote}”
                  </blockquote>

                  <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                    <div>
                      <p
                        className="font-mono text-[10px] font-semibold tracking-[0.3em]"
                        style={{ color: p.color }}
                      >
                        GOAL
                      </p>
                      <p className="mt-2 text-sm leading-snug text-white/85">
                        {p.goals[0]}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-semibold tracking-[0.3em] text-white/35">
                        PAIN
                      </p>
                      <p className="mt-2 text-sm leading-snug text-white/65">
                        {p.frustrations[0]}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[11px]">
                    <span className="tracking-[0.25em] text-white/40">
                      {p.device.toUpperCase()}
                    </span>
                    <span
                      className="tracking-[0.25em]"
                      style={{ color: p.color }}
                    >
                      {p.priority.split(" ")[1]?.toUpperCase() ?? ""}
                    </span>
                  </div>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>

        <div className="max-w-6xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
            JOBS TO BE DONE · 5 WHYS
          </p>
          <h3 className="mt-4 max-w-3xl font-sans text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            표면적 요청 뒤의
            <br />
            <span className="text-[color:var(--color-accent-pale)]">진짜 Job.</span>
          </h3>
          <ul className="mt-10 space-y-3">
            {jtbds.map((j, i) => (
              <li
                key={i}
                data-cursor="card"
                className="group relative grid grid-cols-1 items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-[#0b0d12]/60 p-6 transition-all hover:border-[color:var(--color-accent-pale)]/40 hover:bg-[#0b0d12] md:grid-cols-[80px_1fr_2fr_1.2fr] md:gap-8 md:p-7"
              >
                <span className="font-display text-3xl font-semibold tabular-nums tracking-tight text-white/30 md:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-white/35">
                    WHEN
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-white/70 md:text-base">
                    {j.when}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-white/35">
                    WANTS TO
                  </p>
                  <p className="mt-1.5 text-base leading-snug font-medium text-white md:text-lg">
                    {j.job}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-white/35">
                    SO THAT
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[color:var(--color-accent-pale)] md:text-base">
                    {j.why}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChapterShell>
  );
}
