"use client";

import { useEffect, useRef, useState } from "react";
import { Scene } from "./Scene";

type Props = {
  id?: string;
  src: string;
  src480?: string;
  poster: string;
  caption?: string;
  hero?: boolean;
};

export function VideoScene({ id, src, src480, poster, caption, hero = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.45 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const useLowRes =
    typeof window !== "undefined" &&
    "connection" in navigator &&
    // @ts-expect-error connection types
    (navigator.connection?.saveData || /2g|3g/.test(navigator.connection?.effectiveType ?? ""));

  return (
    <Scene id={id} height={hero ? "tall" : "screen"} bg="bg-black">
      <div className="relative h-screen w-full overflow-hidden">
        <video
          ref={ref}
          src={useLowRes && src480 ? src480 : src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-[8vh] bg-black" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[8vh] bg-black" />

        {caption && (
          <div className="absolute inset-x-6 bottom-[calc(8vh+1.5rem)] md:inset-x-12">
            <p className="max-w-3xl font-mono text-xs leading-relaxed text-white/85 md:text-sm">
              {caption}
            </p>
          </div>
        )}

        {!active && <div className="absolute inset-0 bg-black" />}
      </div>
    </Scene>
  );
}
