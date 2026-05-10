"use client";

import { Scene } from "./Scene";
import { personas } from "@/lib/personas";

export function PersonasInterlude() {
  return (
    <Scene id="s-personas" height="screen" bg="bg-black">
      <div className="w-full px-6 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {personas.map((p, i) => (
            <article
              key={p.name}
              className="relative flex h-[58vh] flex-col justify-between overflow-hidden rounded-3xl p-8 md:h-[66vh] md:p-10"
              style={{
                background: `linear-gradient(160deg, ${p.color} 0%, ${p.color}cc 50%, #0a0b0e 100%)`,
              }}
            >
              <div>
                <span className="font-mono text-[10px] tracking-[0.4em] text-white/85 md:text-xs">
                  {String(i + 1).padStart(2, "0")} · {p.role.toUpperCase()}
                </span>
                <h3 className="mt-6 font-sans text-5xl font-semibold leading-[0.95] tracking-tight text-white md:text-6xl">
                  {p.name}
                </h3>
                <p className="mt-3 font-mono text-xs text-white/75 md:text-sm">
                  {p.age}세 · {p.device}
                </p>
              </div>

              <blockquote className="border-l-2 border-white/40 pl-4 font-sans text-base leading-snug text-white md:text-lg">
                “{p.quote}”
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </Scene>
  );
}
