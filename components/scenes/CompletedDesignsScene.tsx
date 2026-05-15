"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  src: string;
  label: string;
  caption: string;
  span?: "wide" | "tall";
};

const items: Item[] = [
  {
    src: "/media/logo/final.svg",
    label: "BRAND",
    caption: "하루안부 심볼",
    span: "wide",
  },
  {
    src: "/media/img/stage-v11.png",
    label: "GUARDIAN",
    caption: "보호자앱",
  },
  {
    src: "/media/img/patient-final.png",
    label: "PATIENT",
    caption: "환자앱",
  },
  {
    src: "/media/img/nurse-final.png",
    label: "MEDICAL",
    caption: "의료진웹",
  },
  {
    src: "/media/poster/iter4.jpg",
    label: "FILM",
    caption: "Higgsfield 4차",
    span: "wide",
  },
];

export function CompletedDesignsScene() {
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
      const t = Math.max(0, Math.min(1, (p - 0.05) / 0.8));
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
    <section ref={ref} className="relative w-full" style={{ height: "640vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-10 px-6 text-center">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            <span className="text-[color:var(--color-key)]">이게</span> 우리가 원한 것.
          </h2>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-6 md:gap-5">
          {items.map((it, i) => {
            const show = i < shown;
            const span = it.span === "wide" ? "md:col-span-3" : "md:col-span-2";
            const isVideo = it.label === "FILM";
            const isLogo = it.label === "BRAND";
            return (
              <article
                key={`${it.src}-${i}`}
                className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0d12] ${span}`}
                style={{
                  aspectRatio: it.span === "wide" ? "16/10" : "9/16",
                  opacity: show ? 1 : 0,
                  transform: show ? "translateY(0) scale(1)" : "translateY(48px) scale(0.96)",
                  transition: `opacity 720ms cubic-bezier(0.2,1,0.4,1) ${
                    i * 70
                  }ms, transform 760ms cubic-bezier(0.2,1,0.4,1) ${i * 70}ms`,
                }}
              >
                <img
                  src={it.src}
                  alt={it.caption}
                  className={`absolute inset-0 h-full w-full ${
                    isLogo ? "object-contain p-10" : "object-cover"
                  }`}
                  draggable={false}
                />
                {isVideo && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                )}
                <div className="absolute left-3 top-3">
                  <span className="rounded-sm border border-[color:var(--color-key)]/40 bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-key)]">
                    {it.label}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-sans text-sm font-semibold text-white">
                    {it.caption}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
