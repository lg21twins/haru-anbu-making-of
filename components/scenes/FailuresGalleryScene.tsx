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

function FailureCard({ item }: { item: Item }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/8 bg-black"
      style={{
        opacity: show ? 1 : 0,
        transform: show
          ? `translateY(0) rotate(${item.rot}deg) scale(1)`
          : `translateY(48px) rotate(${item.rot}deg) scale(0.92)`,
        transition:
          "opacity 720ms cubic-bezier(0.2,1,0.4,1), transform 820ms cubic-bezier(0.2,1,0.4,1)",
        filter: "grayscale(0.35) brightness(0.85)",
      }}
    >
      <img
        src={item.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      <div className="absolute left-3 top-3">
        <span className="rounded-sm border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/75">
          {CAT_LABEL[item.cat]}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <p className="font-sans text-sm font-medium leading-tight text-white">
          {item.label}
        </p>
      </div>
    </div>
  );
}

export function FailuresGalleryScene() {
  return (
    <section className="relative w-full bg-[#0a0908] py-24 md:py-32">
      <div className="mx-auto mb-14 max-w-6xl px-6 text-center md:mb-20">
        <h2
          className="font-sans font-semibold text-white"
          style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)" }}
        >
          수십 번의 <span className="text-[color:var(--color-key)]">다시.</span>
        </h2>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-5 px-6 md:grid-cols-4 md:gap-6">
        {items.map((it, i) => (
          <FailureCard key={`${it.src}-${i}`} item={it} />
        ))}
      </div>
    </section>
  );
}
