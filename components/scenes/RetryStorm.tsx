"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Scene } from "./Scene";
import { TypeText } from "./TypeText";

const reelImages = [
  "/media/img/stage-v4.png",
  "/media/img/stage-v7.png",
  "/media/img/stage-v9.png",
  "/media/img/stage-v9-5.png",
  "/media/img/stage-v10.png",
  "/media/img/stage-v11.png",
];

const reelLabels = ["v4", "v7", "v9", "v9.5", "v10", "v11"];

export function RetryStorm() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
          } else {
            setActive(false);
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % reelImages.length);
    }, 460);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <Scene id="s-storm" height="tall" bg="bg-black">
      <div ref={ref} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <BackgroundEchoes active={active} />

        <div className="relative z-10 w-full px-6 text-center md:px-12">
          <p
            className="font-sans font-semibold leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
          >
            <TypeText text={"다시.\n다시.\n다시."} speed={120} startDelay={200} />
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-12 z-10 flex justify-center md:bottom-16">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/70 px-4 py-2 backdrop-blur-sm md:gap-4 md:px-5">
            <div className="relative h-12 w-7 overflow-hidden rounded-md bg-[#0e1014] md:h-16 md:w-9">
              <Image
                key={reelImages[idx]}
                src={reelImages[idx]}
                alt={reelLabels[idx]}
                fill
                sizes="36px"
                className="object-cover object-top"
              />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/55 md:text-xs">
              {reelLabels[idx]} · 진행 중
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
}

function BackgroundEchoes({ active }: { active: boolean }) {
  const echoes = Array.from({ length: 14 }).map((_, i) => {
    const top = (i * 53) % 90 + 5;
    const left = (i * 71) % 90 + 3;
    const rot = ((i * 17) % 30) - 15;
    const size = 12 + ((i * 7) % 28);
    const delay = (i * 0.13) % 1.4;
    return { top, left, rot, size, delay, key: i };
  });

  return (
    <div aria-hidden className="absolute inset-0">
      {echoes.map((e) => (
        <span
          key={e.key}
          className="absolute font-sans font-semibold tracking-tight text-white/8 transition-opacity duration-700"
          style={{
            top: `${e.top}%`,
            left: `${e.left}%`,
            fontSize: `${e.size}px`,
            transform: `rotate(${e.rot}deg)`,
            opacity: active ? 0.18 : 0,
            transitionDelay: `${e.delay}s`,
          }}
        >
          다시.
        </span>
      ))}
    </div>
  );
}
