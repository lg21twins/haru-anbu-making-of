"use client";

import { Scene } from "./Scene";
import { TypeText } from "./TypeText";

export function FinalScene() {
  return (
    <Scene id="s-final" height="tall" bg="bg-black">
      <div className="flex h-screen w-full flex-col items-center justify-center px-6 text-center md:px-12">
        <p
          className="font-sans font-semibold leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(4rem, 16vw, 16rem)" }}
        >
          <TypeText text="하루안부." speed={140} startDelay={400} finalCursor />
        </p>
        <a
          href="/v1"
          data-cursor="link"
          className="mt-20 inline-flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-white/45 transition-colors hover:text-[color:var(--color-key)]"
        >
          <span>자세히 보기 →</span>
        </a>
      </div>
    </Scene>
  );
}
