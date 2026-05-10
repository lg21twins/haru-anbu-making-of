"use client";

import { Scene } from "./Scene";
import { jtbds } from "@/lib/personas";

export function JtbdInterlude() {
  return (
    <Scene id="s-jtbd" height="screen" bg="bg-black">
      <div className="w-full px-6 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 md:gap-14">
          {jtbds.map((j, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr] items-baseline gap-6 md:gap-10">
              <span className="font-mono text-3xl tabular-nums text-white/25 md:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-sans text-2xl leading-[1.25] text-white md:text-4xl">
                <span className="text-white/45">{j.when}, </span>
                <span className="text-white/45">{j.user} </span>
                <span className="text-white">{j.job}.</span>
                <br />
                <span className="text-[color:var(--color-accent-pale)] text-xl md:text-2xl">
                  ─ {j.why}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}
