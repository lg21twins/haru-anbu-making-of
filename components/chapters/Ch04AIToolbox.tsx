"use client";

import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { TiltCard } from "@/components/effects/TiltCard";
import { Marquee } from "@/components/effects/Marquee";
import { tools } from "@/lib/aiToolbox";

export function Ch04AIToolbox() {
  return (
    <ChapterShell
      id="ch05"
      label="AI TOOLBOX"
      index="CH 05"
      className="bg-[#070a10]"
    >
      <div className="border-y border-white/5 bg-black py-8 md:py-10">
        <Marquee speed={58}>
          <span className="font-display text-xl font-medium tracking-tight text-white/55 md:text-3xl">
            CLAUDE × HIGGSFIELD × MIDJOURNEY × REMOTION × FIGMA × PRETENDARD × ICONIFY ×{" "}
          </span>
        </Marquee>
      </div>

      <div className="px-6 pb-32 pt-32 md:px-12">
        <header className="mb-14 max-w-5xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
            CH 05 · TOOLBOX
          </p>
          <h2 className="mt-6 font-sans text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-white">
            <SplitTextReveal text="혼자 만든 게 아니다." />
            <br />
            <SplitTextReveal
              text="여러 AI가 합작했다."
              className="text-[color:var(--color-accent-pale)]"
              delay={0.35}
            />
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">
            8개 도구가 어디에, 얼마나 — 한눈에.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <TiltCard key={t.name} strength={3}>
              <article
                data-cursor="card"
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12]"
                style={{ boxShadow: `inset 0 0 0 1px ${t.color}25` }}
              >
                <div
                  className="relative flex aspect-square w-full items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${t.color}55 0%, ${t.color}11 50%, transparent 80%)`,
                  }}
                >
                  <span
                    className="font-display font-semibold leading-none tracking-tighter"
                    style={{
                      color: t.color,
                      fontSize: t.initial.length > 1 ? "5rem" : "9rem",
                      filter: `drop-shadow(0 0 30px ${t.color}55)`,
                    }}
                  >
                    {t.initial}
                  </span>
                  <span
                    className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.3em]"
                    style={{ color: t.color }}
                  >
                    {t.category.toUpperCase()}
                  </span>
                  <div className="absolute right-4 top-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="block h-1 w-1 rounded-full"
                        style={{
                          background: i < t.weight ? t.color : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-white">
                    {t.name}
                  </h3>
                  <p className="text-sm text-white/60">{t.role}</p>
                  <div className="mt-auto border-t border-white/5 pt-3">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-white/30">
                      ARTIFACT
                    </p>
                    <p className="mt-1 font-mono text-xs text-white/75">
                      {t.artifact}
                    </p>
                  </div>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
