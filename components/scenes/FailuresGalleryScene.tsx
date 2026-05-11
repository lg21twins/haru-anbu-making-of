"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  src: string;
  label: string;
  cat: "logo" | "app" | "video";
  rot: number;
};

const items: Item[] = [
  { src: "/media/logo/attempt-1.png", label: "로고 시도 01", cat: "logo", rot: -2.4 },
  { src: "/media/img/stage-v1.png", label: "보호자앱 v1", cat: "app", rot: 1.8 },
  { src: "/media/poster/iter1.jpg", label: "영상 1차", cat: "video", rot: -1.6 },
  { src: "/media/logo/attempt-2.png", label: "로고 시도 02", cat: "logo", rot: 2.2 },
  { src: "/media/img/patient-early.png", label: "환자앱 초기", cat: "app", rot: -2.8 },
  { src: "/media/img/stage-v2.png", label: "보호자앱 v2", cat: "app", rot: 1.4 },
  { src: "/media/poster/iter2.jpg", label: "영상 2차", cat: "video", rot: 2.6 },
  { src: "/media/logo/attempt-3.png", label: "로고 시도 03", cat: "logo", rot: -1.8 },
  { src: "/media/img/nurse-early.png", label: "의료진웹 초기", cat: "app", rot: 2.0 },
  { src: "/media/img/stage-v4.png", label: "보호자앱 v4", cat: "app", rot: -2.2 },
  { src: "/media/poster/iter3.jpg", label: "영상 3차", cat: "video", rot: 1.6 },
  { src: "/media/logo/attempt-4.png", label: "로고 시도 04", cat: "logo", rot: -1.4 },
  { src: "/media/img/stage-v7.png", label: "보호자앱 v7", cat: "app", rot: 2.4 },
];

const CAT_LABEL: Record<Item["cat"], string> = {
  logo: "LOGO",
  app: "APP",
  video: "FILM",
};

export function FailuresGalleryScene() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = range > 0 ? scrolled / range : 0;
      const t = Math.max(0, Math.min(1, (p - 0.05) / 0.85));
      setShown(Math.round(t * items.length));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <section ref={ref} className="relative w-full" style={{ height: "880vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0908]">
        <div className="mb-8 px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-key)]/60">
            wall of mistakes
          </p>
          <h2
            className="mt-2 font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            수십 번의 <span className="text-[color:var(--color-key)]">다시.</span>
          </h2>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-3 gap-4 px-6 md:grid-cols-4 md:gap-5">
          {items.map((it, i) => {
            const show = i < shown;
            return (
              <div
                key={`${it.src}-${i}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-white/8 bg-black"
                style={{
                  opacity: show ? 1 : 0,
                  transform: show
                    ? `translateY(0) rotate(${it.rot}deg) scale(1)`
                    : `translateY(40px) rotate(${it.rot}deg) scale(0.9)`,
                  transition: `opacity 540ms cubic-bezier(0.2,1,0.4,1), transform 620ms cubic-bezier(0.2,1,0.4,1)`,
                  filter: "grayscale(0.4) brightness(0.85)",
                }}
              >
                <img
                  src={it.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                <div className="absolute left-2.5 top-2.5">
                  <span className="rounded-sm border border-white/20 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/70">
                    {CAT_LABEL[it.cat]}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-baseline justify-between">
                  <span className="font-sans text-[11px] font-medium text-white/80">
                    {it.label}
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--color-key)]/70">
                    다시.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
