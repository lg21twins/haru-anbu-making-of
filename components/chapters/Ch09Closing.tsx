"use client";

import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { Marquee } from "@/components/effects/Marquee";

const CREDITS = [
  "DESIGN  김지욱",
  "AI 협업  Claude (Opus 4)",
  "비디오  Higgsfield Cinema Studio",
  "이미지  Midjourney v6",
  "타이포  Pretendard Variable",
  "아이콘  Iconify · Fluent",
  "프레임  Next.js 16 · React 19",
  "모션  GSAP · Framer Motion · Lenis",
  "3D  React Three Fiber",
  "호스팅  Vercel",
];

export function Ch09Closing() {
  return (
    <ChapterShell id="ch09" label="CLOSING" index="CH 09" className="bg-black">
      <div className="relative overflow-hidden">
        <div className="px-8 py-32 md:px-16 md:py-48">
          <p className="font-mono text-[11px] tracking-[0.35em] text-white/40">
            END · 2026 · MADE WITH AI
          </p>

          <h2 className="mt-8 max-w-5xl text-[clamp(2.75rem,7vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
            <SplitTextReveal text="다음 하루도," />
            <br />
            <SplitTextReveal
              text="안녕하시길."
              className="text-[color:var(--color-accent-pale)]"
              delay={0.4}
            />
          </h2>

          <p className="mt-10 max-w-xl text-base leading-relaxed text-white/60">
            이 사이트는 시니어 케어 앱 하루안부의 제작 과정을 기록한 메이킹-오브 사이트입니다.
            앱 자체에 대한 소개는 별도 사이트에서 만나보실 수 있습니다.
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-3">
            <MagneticButton
              href="#ch00"
              cursorState="link"
              strength={0.5}
              className="rounded-full border border-white/20 bg-white px-7 py-3.5 text-sm font-medium text-black hover:bg-white/90"
            >
              <span>처음으로</span>
            </MagneticButton>
            <MagneticButton
              href="https://github.com/kimjiwook123"
              cursorState="link"
              strength={0.5}
              className="rounded-full border border-white/10 px-6 py-3.5 text-sm text-white/70 hover:text-white"
            >
              <span className="mr-2">GitHub</span>
              <span aria-hidden>↗</span>
            </MagneticButton>
          </div>
        </div>

        <div className="border-y border-white/5 bg-[color:var(--color-bg-soft)] py-12 md:py-16">
          <Marquee speed={78}>
            <span className="font-display text-[8vw] font-semibold tracking-tighter text-white md:text-[7vw]">
              하루안부 · HARU-ANBU · 하루안부 · HARU-ANBU ·{" "}
            </span>
          </Marquee>
        </div>

        <div className="px-8 py-24 md:px-16">
          <p className="mb-6 font-mono text-[11px] tracking-[0.35em] text-white/40">
            CREDITS
          </p>
          <ul className="grid grid-cols-1 gap-x-12 gap-y-3 font-mono text-sm text-white/70 md:grid-cols-2 lg:grid-cols-3">
            {CREDITS.map((c) => (
              <li key={c} className="flex items-baseline gap-3 border-b border-white/5 pb-3">
                <span className="text-white">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChapterShell>
  );
}
