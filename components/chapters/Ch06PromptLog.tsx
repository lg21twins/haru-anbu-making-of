"use client";

import { useEffect, useMemo, useState } from "react";
import { ChapterShell } from "@/components/ui/ChapterShell";
import { TiltCard } from "@/components/effects/TiltCard";
import { CountUp } from "@/components/effects/CountUp";
import { SplitTextReveal } from "@/components/effects/SplitTextReveal";
import { Marquee } from "@/components/effects/Marquee";
import type { LogEntry } from "@/lib/parseLog";

const FEATURED_IDS = [1, 18, 25, 38, 47, 51];

export function Ch06PromptLog({ entries }: { entries: LogEntry[] }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [fuse, setFuse] = useState<{
    search: (q: string) => Array<{ item: LogEntry }>;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const Fuse = (await import("fuse.js")).default;
      const f = new Fuse(entries, {
        keys: [
          { name: "title", weight: 2 },
          { name: "promptSummary", weight: 2 },
          { name: "process", weight: 1 },
          { name: "output", weight: 1 },
          { name: "tags", weight: 1.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      });
      if (mounted) setFuse({ search: (q) => f.search(q) });
    })();
    return () => {
      mounted = false;
    };
  }, [entries]);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries.slice().reverse();
    if (!fuse) return entries.slice().reverse();
    return fuse.search(query.trim()).map((r) => r.item);
  }, [entries, fuse, query]);

  const featured = entries.filter(
    (e) => FEATURED_IDS.includes(e.id) && e.occurrence === 1
  );

  return (
    <ChapterShell
      id="ch08"
      label="PROMPT LOG"
      index="CH 08"
      className="bg-[#0b0d12]"
    >
      <div className="border-y border-white/5 bg-black py-9 md:py-11">
        <Marquee speed={72}>
          <span className="font-display text-xl font-medium tracking-tight text-white/60 md:text-3xl">
            PROMPT × OUTPUT × JUDGEMENT × PROMPT × OUTPUT × JUDGEMENT ×{" "}
          </span>
        </Marquee>
      </div>

      <div className="px-6 pb-32 pt-32 md:px-12">
        <header className="mb-14 grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/40">
              CH 08 · PROMPT ENGINEERING LOG
            </p>
            <h2 className="mt-6 font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
              <SplitTextReveal text="모든 프롬프트를" />
              <br />
              <SplitTextReveal
                text="기록했다."
                className="text-[color:var(--color-accent-pale)]"
                delay={0.35}
              />
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6 md:gap-10">
            <Stat label="LINES" value={1845} />
            <Stat label="ENTRIES" value={entries.length} />
            <Stat label="DAYS" value={28} />
          </div>
        </header>

        <p className="mb-10 max-w-2xl font-sans text-base leading-relaxed text-white/60 md:text-lg">
          Claude와 나눈 모든 사이클. 무엇을 던졌고, AI가 어떻게 풀었고, 무엇이 남았나 — 프롬프트, 작업 단계, 출력 결과를 그대로 보존했다.
        </p>

        <div
          data-cursor="text"
          className="mb-10 flex w-full max-w-2xl items-center gap-3 border-b border-white/10 px-1 pb-3 transition-colors focus-within:border-[color:var(--color-accent-pale)]"
        >
          <span className="font-mono text-xs tracking-[0.25em] text-white/40">
            SEARCH
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="결제, 탭바, 글라스, Higgsfield..."
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-white/25 focus:outline-none"
          />
          <span className="font-mono text-xs text-white/40">
            {filtered.length} / {entries.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((e) => (
              <TiltCard key={e.uid} strength={4} scale={1.01} className="h-full">
                <PromptCard
                  entry={e}
                  open={openId === e.uid}
                  onToggle={() => setOpenId(openId === e.uid ? null : e.uid)}
                  featured={FEATURED_IDS.includes(e.id) && e.occurrence === 1}
                />
              </TiltCard>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-16 text-center font-mono text-sm text-white/30">
                검색 결과 없음
              </p>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-white/40">
                FEATURED · 6
              </p>
              <ul className="space-y-2">
                {featured.map((e) => (
                  <li key={e.uid}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenId(e.uid);
                        document
                          .getElementById(`entry-${e.uid}`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="group block w-full border-l-2 border-white/10 pl-4 text-left transition hover:border-[color:var(--color-accent-pale)]"
                    >
                      <div className="flex items-baseline gap-2 font-mono text-[11px] text-white/40">
                        <span>#{String(e.id).padStart(2, "0")}</span>
                        <span>{e.date}</span>
                      </div>
                      <p className="mt-1 font-sans text-sm text-white/80 group-hover:text-white">
                        {e.title}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
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

function PromptCard({
  entry,
  open,
  onToggle,
  featured,
}: {
  entry: LogEntry;
  open: boolean;
  onToggle: () => void;
  featured: boolean;
}) {
  return (
    <article
      id={`entry-${entry.uid}`}
      data-cursor="card"
      className={`group relative h-full overflow-hidden rounded-md border bg-[#0e1117]/80 backdrop-blur-sm transition-colors ${
        featured
          ? "border-[color:var(--color-accent)]/40"
          : "border-white/[0.06] hover:border-white/25"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col items-start gap-3 p-5 text-left"
      >
        <div className="flex w-full items-baseline justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-white/40">
          <span className="flex items-baseline gap-2">
            <span className="text-white/60">#{String(entry.id).padStart(2, "0")}</span>
            <span>{entry.date}</span>
            {featured && (
              <span className="text-[color:var(--color-accent-pale)]">★</span>
            )}
          </span>
          <span className="opacity-50">
            {entry.process.length} steps
          </span>
        </div>

        <h3 className="font-sans text-base font-medium leading-snug text-white md:text-lg">
          {entry.title}
        </h3>

        {entry.promptSummary && (
          <p className="font-mono text-xs leading-relaxed text-[#7c9aff]/80">
            <span className="text-white/30">prompt &gt; </span>
            <span>{entry.promptSummary}</span>
          </p>
        )}

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/50"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="border-t border-white/5 bg-black/40 px-5 py-4">
            {entry.process.length > 0 && (
              <ol className="space-y-1.5 font-mono text-xs leading-relaxed text-white/70">
                {entry.process.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 w-5 shrink-0 text-right text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
            {entry.output && (
              <p className="mt-3 border-t border-white/5 pt-3 font-mono text-xs text-emerald-300/80">
                <span className="text-white/30">output &gt; </span>
                {entry.output}
              </p>
            )}
            {entry.finding && (
              <p className="mt-2 font-mono text-xs text-[color:var(--color-accent-pale)]/80">
                <span className="text-white/30">finding &gt; </span>
                {entry.finding}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
