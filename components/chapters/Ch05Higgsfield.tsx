"use client";

import { useEffect, useRef, useState } from "react";
import { higgsfieldIterations, promptVersions, type VideoIter } from "@/lib/videoManifest";
import { ChapterShell } from "@/components/ui/ChapterShell";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { TiltCard } from "@/components/effects/TiltCard";

export function Ch05Higgsfield() {
  const [activePrompt, setActivePrompt] = useState<"v1" | "v2" | "v3">("v1");

  return (
    <ChapterShell
      id="ch06"
      label="HIGGSFIELD · 4 ITERATIONS"
      index="CH 06"
      className="bg-black"
    >
      <header className="px-8 pt-32 pb-16 md:px-16">
        <p className="font-mono text-[11px] tracking-[0.35em] text-white/40">
          CH 06 · FOUR ITERATIONS · ONE SCENARIO
        </p>
        <h2 className="mt-6 font-sans text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tight text-white">
          <SplitTextReveal text="한 시나리오를" />
          <br />
          <SplitTextReveal
            text="네 번 만들었다."
            className="text-[color:var(--color-accent-pale)]"
            delay={0.4}
          />
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          Higgsfield Cinema Studio로 ‘인류 최대의 위기’ 시나리오를 4차에 걸쳐 진화시켰다.
          프롬프트가 진화한 만큼 영상이 자랐다.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-px bg-white/5 px-px md:grid-cols-2 md:grid-rows-2">
        {higgsfieldIterations.map((iter) => (
          <VideoTile key={iter.iter} iter={iter} />
        ))}
      </div>

      <div className="border-t border-white/5 bg-[#06080d] px-6 py-24 md:px-12">
        <p className="font-mono text-[11px] tracking-[0.35em] text-white/40">
          PROMPT EVOLUTION · v1 → v2 → v3
        </p>
        <h3 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
          프롬프트가 길어질수록 톤이 정확해졌다.
        </h3>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <nav className="space-y-2">
            {(["v1", "v2", "v3"] as const).map((v) => {
              const active = activePrompt === v;
              const meta: Record<typeof v, { label: string; len: number }> = {
                v1: { label: "거친 한 줄", len: promptVersions.v1.length },
                v2: { label: "디테일 폭격", len: promptVersions.v2.length },
                v3: { label: "시네마틱 안정화", len: promptVersions.v3.length },
              };
              return (
                <button
                  key={v}
                  type="button"
                  data-cursor="link"
                  onClick={() => setActivePrompt(v)}
                  className={`flex w-full items-baseline justify-between border-l-2 px-4 py-3 text-left transition-all ${
                    active
                      ? "border-[color:var(--color-accent-pale)] bg-white/5"
                      : "border-white/10 hover:border-white/40"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">
                      PROMPT {v.toUpperCase()}
                    </span>
                    <span
                      className={`mt-1 font-sans text-base ${
                        active ? "text-white" : "text-white/70"
                      }`}
                    >
                      {meta[v].label}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-white/40 tabular-nums">
                    {meta[v].len} chars
                  </span>
                </button>
              );
            })}
          </nav>

          <TiltCard strength={2.5}>
            <pre
              data-cursor="text"
              className="overflow-x-auto rounded-md border border-white/10 bg-[#0d1117] p-6 font-mono text-[13px] leading-[1.7] text-white/85 whitespace-pre-wrap"
            >
              <DiffView prev={prevOf(activePrompt)} curr={promptVersions[activePrompt]} />
            </pre>
          </TiltCard>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Lesson
            tag="LESSON 01"
            title="‘speaks/shouts'는 화면에 영문 텍스트가 박혀버린다"
            body="동사로 대사를 명시하면 AI가 자막처럼 글자를 렌더한다. 입 움직임만 ‘talking animatedly'로 유도하고 한국어 더빙은 편집에서."
          />
          <Lesson
            tag="LESSON 02"
            title="캐스팅을 핸들로 고정해야 컷 사이 인물이 일치한다"
            body="@김미영, @박지현 같은 AI 인플루언서 핸들을 등록해 같은 사람으로 컷을 이어 붙인다. 그 전엔 매 컷 다른 얼굴이 나왔다."
          />
          <Lesson
            tag="LESSON 03"
            title="‘한국 병원'만 적으면 미국식 인테리어가 나온다"
            body="301호·형광등·백색 핸드레일 같은 한국 디테일을 넣어야 한국 분위기가 산다."
          />
        </div>
      </div>
    </ChapterShell>
  );
}

function prevOf(v: "v1" | "v2" | "v3") {
  if (v === "v2") return promptVersions.v1;
  if (v === "v3") return promptVersions.v2;
  return "";
}

function DiffView({ prev, curr }: { prev: string; curr: string }) {
  if (!prev) {
    return <span className="text-white/85">{curr}</span>;
  }
  const prevWords = new Set(prev.toLowerCase().split(/[\s,.;]+/).filter(Boolean));
  const tokens = curr.split(/(\s+)/);
  return (
    <>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        const isNew = !prevWords.has(tok.toLowerCase().replace(/[,.;]+/g, ""));
        return (
          <span
            key={i}
            className={
              isNew
                ? "rounded bg-emerald-500/15 px-0.5 text-emerald-300"
                : "text-white/65"
            }
          >
            {tok}
          </span>
        );
      })}
    </>
  );
}

function Lesson({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <article
      data-cursor="card"
      className="rounded-lg border border-white/10 bg-[#0b0d12] p-6"
    >
      <p className="font-mono text-[10px] tracking-[0.3em] text-[color:var(--color-accent-pale)]">
        {tag}
      </p>
      <h4 className="mt-3 font-sans text-base font-medium leading-snug text-white">
        {title}
      </h4>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
    </article>
  );
}

function VideoTile({ iter }: { iter: VideoIter }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      data-cursor="card"
      className="group relative aspect-[16/10] overflow-hidden bg-black"
    >
      <video
        ref={ref}
        src={iter.src480}
        poster={iter.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
      />
      <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 md:p-7">
        <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
          <span>iter {iter.iter}</span>
          <span>{iter.era}</span>
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {iter.label}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70 md:text-[15px]">
            {iter.caption}
          </p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">
            {iter.learnings}
          </p>
        </div>
      </figcaption>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
    </figure>
  );
}
