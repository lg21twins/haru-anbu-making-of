"use client";

import { useEffect, useRef, useState } from "react";
import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { BeforeAfterSlider } from "@/components/effects/BeforeAfterSlider";
import { StageMockup } from "@/components/effects/StageMockup";
import { stages } from "@/lib/evolution";

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 165;
}

export function Ch03Evolution() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const idx = Math.min(
        stages.length - 1,
        Math.floor(p * stages.length + 0.0001)
      );
      setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ChapterShell
      id="ch04"
      label="DESIGN EVOLUTION"
      index="CH 04"
      className="bg-[#0a0c11]"
    >
      <div ref={sectionRef} className="relative" style={{ height: `${stages.length * 80 + 80}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-6 py-20 md:px-12">
          <header className="max-w-5xl">
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
              CH 04 · 13 STAGES · v1 → v12
            </p>
            <h2 className="mt-4 font-sans text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-tight text-white">
              <SplitTextReveal text="13번 다시 그렸다." />
            </h2>
          </header>

          <div className="grid w-full items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)_minmax(0,260px)] md:gap-12">
            <div className="relative order-2 h-[280px] md:order-1 md:h-[480px]">
              {stages.map((s, i) => (
                <div
                  key={s.version}
                  className="absolute inset-0 flex flex-col justify-center transition-all duration-700"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translate3d(0, ${i === active ? 0 : 30}px, 0) scale(${i === active ? 1 : 0.95})`,
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  <div className="flex items-baseline gap-4 font-mono text-[11px] tracking-[0.25em] text-white/40">
                    <span className="text-white">{s.version.toUpperCase()}</span>
                    <span>{s.era}</span>
                  </div>
                  <h3 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                    {s.body}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] text-white/70"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative order-1 flex h-[420px] items-center justify-center md:order-2 md:h-[560px]">
              {stages.map((s, i) => (
                <div
                  key={s.version}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-[900ms]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translate3d(0, ${i === active ? 0 : 40}px, 0) scale(${i === active ? 1 : 0.92})`,
                    pointerEvents: i === active ? "auto" : "none",
                    transitionTimingFunction: "cubic-bezier(0.2, 1, 0.4, 1)",
                  }}
                >
                  <StageMockup stage={s} large />
                </div>
              ))}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="h-72 w-72 rounded-full opacity-40 blur-3xl transition-colors duration-1000 md:h-96 md:w-96"
                  style={{ background: stages[active].swatch }}
                />
              </div>
            </div>

            <aside className="relative order-3 hidden md:block">
              <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
                PALETTE
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-white">
                {String(active + 1).padStart(2, "0")}
                <span className="text-white/30">/{stages.length}</span>
              </p>
              <div className="mt-5 grid grid-cols-3 gap-1.5">
                {stages.map((s, i) => (
                  <button
                    type="button"
                    key={s.version}
                    aria-label={`${s.version} ${s.title}`}
                    data-cursor="link"
                    className="group relative aspect-square overflow-hidden rounded-md transition-all"
                    style={{
                      background: s.swatch,
                      transform: i === active ? "scale(1.08)" : "scale(1)",
                      boxShadow:
                        i === active
                          ? "0 0 0 2px rgba(255,255,255,0.9), 0 12px 30px -8px rgba(124,168,255,0.5)"
                          : "0 0 0 1px rgba(255,255,255,0.06)",
                      opacity: i === active ? 1 : 0.65,
                    }}
                  >
                    <span
                      className="absolute bottom-1 left-1.5 font-mono text-[9px] font-medium tracking-tight"
                      style={{
                        color: isLight(s.swatch) ? "#0a0a0a" : "rgba(255,255,255,0.85)",
                      }}
                    >
                      {s.version}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-mono text-[10px] tracking-[0.3em] text-white/40">
                  ACTIVE
                </p>
                <p
                  className="mt-2 font-mono text-sm font-semibold tabular-nums"
                  style={{ color: stages[active].swatch }}
                >
                  {stages[active].swatch.toUpperCase()}
                </p>
              </div>
            </aside>
          </div>

          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-white/45">
            <span>{String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
            <div className="relative h-px w-full bg-white/10">
              <div
                className="absolute left-0 top-0 h-full bg-[color:var(--color-accent-pale)] transition-[width] duration-500"
                style={{ width: `${((active + 1) / stages.length) * 100}%` }}
              />
            </div>
            <span>SCROLL TO ADVANCE →</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#0e1014] px-6 py-24 md:px-12">
        <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
          BEFORE / AFTER · 드래그해서 비교
        </p>
        <h3 className="mt-4 max-w-3xl font-sans text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
          와이어프레임에서 미려한 UI까지, 한 번에 끌어보세요.
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
          v1 손그림 와이어프레임 ↔ v8 보호자앱 최종 시안. 같은 화면이 어떻게 변했는지.
        </p>

        <div className="mt-10 max-w-5xl">
          <BeforeAfterSlider
            beforeLabel="V1 · 2026.03"
            afterLabel="V8 · 2026.04"
            before={<V1Wireframe />}
            after={<V8Final />}
          />
        </div>
      </div>
    </ChapterShell>
  );
}

function V1Wireframe() {
  return (
    <div className="relative aspect-[16/10] w-full bg-[#f4ece2] p-6 font-mono text-[#2a1f15] md:p-9">
      <div className="flex items-center justify-between text-[10px] tracking-[0.3em] opacity-60">
        <span>WIREFRAME</span>
        <span>SKETCH · 2026.03</span>
      </div>
      <div className="mt-7 h-2.5 w-40 bg-[#2a1f15]/30" />
      <div className="mt-1.5 h-2.5 w-56 bg-[#2a1f15]/15" />
      <div className="mt-7 grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-[#2a1f15]/40 bg-[#2a1f15]/5 p-3"
          >
            <div className="mb-2 h-2 w-12 bg-[#2a1f15]/40" />
            <div className="h-1.5 w-full bg-[#2a1f15]/20" />
            <div className="mt-1 h-1.5 w-3/4 bg-[#2a1f15]/20" />
            <div className="mt-1 h-1.5 w-2/3 bg-[#2a1f15]/20" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-5 gap-2 border-t border-[#2a1f15]/30 pt-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 bg-[#2a1f15]/15" />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function V8Final() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#0a0e16] via-[#0d1320] to-[#1a2440] p-6 text-white md:p-9">
      <div
        aria-hidden
        className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-[#2c7afc] opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#74a8ff] opacity-30 blur-3xl"
      />

      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/60">
        <span className="flex items-center gap-2">
          <span className="relative block h-2 w-2 rounded-full bg-emerald-400">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          </span>
          LIVE
        </span>
        <span>v8 · 2026.04</span>
      </div>

      <h4 className="relative mt-5 font-display text-xl font-semibold leading-tight md:text-2xl">
        좋은 아침이에요, 김미영님.
        <br />
        <span className="text-white/55">어머니가 오늘은 잘 주무셨어요.</span>
      </h4>

      <div className="relative mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-md">
          <p className="font-mono text-[9px] tracking-[0.3em] text-white/40">
            CARE SCORE
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            87
            <span className="ml-1 text-xs text-emerald-300">▲ 4</span>
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-md">
          <p className="font-mono text-[9px] tracking-[0.3em] text-white/40">
            NEXT
          </p>
          <p className="mt-1 text-sm text-white/85">투약 30분 후</p>
        </div>
      </div>

      <div className="relative mt-3 rounded-xl border border-[#2c7afc]/40 bg-[#2c7afc]/10 p-3">
        <p className="font-mono text-[9px] tracking-[0.3em] text-[#74a8ff]">
          AI 일일 리포트
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/75">
          식사 3회 정상, 산책 32분, 컨디션 보통.
        </p>
      </div>

      <div className="relative mt-5 flex gap-1 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-6 flex-1 rounded-full ${
              i === 0 ? "bg-white" : "bg-white/0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
