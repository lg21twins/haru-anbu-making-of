"use client";

import Image from "next/image";
import { Scene } from "./Scene";

type Props = {
  id?: string;
  version: string;
  era: string;
  caption?: string;
  src?: string;
  hero?: boolean;
};

export function MockupScene({ id, version, era, caption, src, hero = false }: Props) {
  return (
    <Scene id={id} height={hero ? "tall" : "screen"} bg="bg-[#0a0b0e]">
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-16 md:px-12">
        <div className="absolute inset-x-6 top-10 flex items-center justify-between font-mono text-[10px] tracking-[0.4em] text-white/40 md:inset-x-12 md:text-xs">
          <span>{version.toUpperCase()}</span>
          <span>{era}</span>
        </div>

        <div
          className="relative mx-auto"
          style={{
            width: "min(420px, 78vw)",
            aspectRatio: "9 / 19.5",
          }}
        >
          <div className="absolute inset-0 rounded-[42px] border border-white/10 bg-black shadow-[0_40px_120px_-20px_rgba(44,122,252,0.35)] md:rounded-[52px]" />
          <div className="absolute inset-[6px] overflow-hidden rounded-[36px] bg-[#0e1014] md:inset-[8px] md:rounded-[46px]">
            {src ? (
              <Image
                src={src}
                alt={`${version} mockup`}
                fill
                sizes="(max-width: 768px) 78vw, 420px"
                className="object-cover object-top"
                priority={hero}
              />
            ) : (
              <FallbackPlaceholder version={version} />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[42px] ring-1 ring-white/5 md:rounded-[52px]" />
        </div>

        {caption && (
          <p className="mt-10 max-w-xl text-center font-mono text-xs leading-relaxed text-white/55 md:text-sm">
            {caption}
          </p>
        )}

        {hero && (
          <p className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-white/30">
            HOLD —
          </p>
        )}
      </div>
    </Scene>
  );
}

function FallbackPlaceholder({ version }: { version: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0e1014] to-[#1a1d24]">
      <span className="font-mono text-2xl text-white/20">{version}</span>
    </div>
  );
}
