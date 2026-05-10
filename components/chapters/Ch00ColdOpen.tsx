"use client";

import { useEffect, useRef } from "react";
import { ChapterShell } from "@/components/ui/ChapterShell";
import { GradientMesh } from "@/components/effects/GradientMesh";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { Marquee } from "@/components/effects/Marquee";

export function Ch00ColdOpen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <ChapterShell id="ch00" label="COLD OPEN" index="CH 00" className="bg-black">
      <div className="relative h-[110vh] w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/media/video/iter4.mp4"
          poster="/media/poster/iter4.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50"
        />
        <GradientMesh className="z-[1] opacity-70" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/10 to-black" />

        <div className="relative z-10 flex h-full flex-col items-start justify-end px-8 pb-32 md:px-16">
          <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.35em] text-white/60">
            <span className="block h-px w-10 bg-white/40" />
            <span>HARU-ANBU · MAKING OF · 2026</span>
          </div>

          <h1 className="mt-8 max-w-6xl text-[clamp(2.75rem,8vw,9rem)] font-semibold leading-[0.95] tracking-tight text-white">
            <SplitTextReveal text="오늘 하루도," />
            <br />
            <SplitTextReveal
              text="안녕하셨습니다."
              className="text-[color:var(--color-accent-pale)]"
              delay={0.45}
            />
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            시니어 케어 앱 ‘하루안부’를 AI와 함께 만들었다. 처음 어떻게 나왔고, 어떻게 디벨롭했고, 어떻게 끝났는지 — 1,845줄의 대화로그, 13단계 디자인 진화, 4차 영상까지 그대로.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton
              href="#ch08"
              cursorState="link"
              strength={0.5}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md hover:border-white/60"
            >
              <span className="mr-3">대화로그 보기</span>
              <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton
              href="#ch06"
              cursorState="link"
              strength={0.5}
              className="rounded-full border border-white/10 px-6 py-3 text-sm text-white/70 hover:text-white"
            >
              <span className="mr-3">힉스필드 4차</span>
              <span aria-hidden>→</span>
            </MagneticButton>
          </div>

          <div className="absolute bottom-8 left-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-white/40 md:left-16">
            <span className="block h-px w-8 bg-white/40" />
            <span>SCROLL</span>
          </div>
        </div>
      </div>

      <div className="border-y border-white/5 bg-black py-7 md:py-9">
        <Marquee speed={52}>
          <span className="font-display text-2xl font-medium tracking-tight text-white/85 md:text-4xl">
            CLAUDE × HIGGSFIELD × MIDJOURNEY × FIGMA × PRETENDARD × ICONIFY × REMOTION ×{" "}
          </span>
        </Marquee>
      </div>
    </ChapterShell>
  );
}
