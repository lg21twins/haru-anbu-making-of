"use client";

import { Scene } from "./Scene";
import { failures } from "@/lib/failures";

export function FailuresInterlude() {
  return (
    <Scene id="s-failures" height="tall" bg="bg-[#0a0908]">
      <div className="w-full px-6 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {failures.map((f) => (
            <article
              key={f.number}
              className="group relative overflow-hidden rounded-xl border border-[color:var(--color-key)]/20 bg-[#100c08] p-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold leading-none tabular-nums text-[color:var(--color-key)]/40">
                  {f.number}
                </span>
                <span className="font-mono text-[9px] tracking-[0.3em] text-[color:var(--color-key)]/70">
                  {f.category}
                </span>
              </div>
              <h3 className="mt-3 font-sans text-base font-semibold leading-snug text-white md:text-lg">
                {f.what}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/55">
                {f.why}
              </p>
              {f.afterText && (
                <p className="mt-3 truncate rounded border border-white/10 bg-black/60 px-2 py-1 font-mono text-[10px] text-emerald-300/80">
                  → {f.afterText}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </Scene>
  );
}
