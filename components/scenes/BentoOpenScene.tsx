"use client";

import { useEffect, useRef, useState } from "react";

type Tile = {
  key: string;
  col: string; // grid-column
  row: string; // grid-row
  order: number; // 등장 순서(스태거)
  kind: "logo" | "headline" | "orb" | "screen";
  src?: string;
  label?: string;
};

// nue 레퍼런스풍 벤또 — 실제 하루안부 화면 + 로고 + 헤드라인 + AI 오브
const TILES: Tile[] = [
  { key: "logo", col: "1", row: "1", order: 0, kind: "logo" },
  { key: "headline", col: "2 / 4", row: "1", order: 2, kind: "headline" },
  { key: "chat", col: "4", row: "1 / 3", order: 1, kind: "screen", src: "chat" },
  { key: "home", col: "1", row: "2", order: 3, kind: "screen", src: "home" },
  { key: "orb", col: "2", row: "2", order: 5, kind: "orb", label: "AI 케어매니저" },
  { key: "report", col: "3", row: "2", order: 4, kind: "screen", src: "report" },
  { key: "alert", col: "1", row: "3", order: 6, kind: "screen", src: "alert" },
  { key: "timeline", col: "2 / 4", row: "3", order: 7, kind: "screen", src: "timeline" },
  { key: "mypage", col: "4", row: "3", order: 8, kind: "screen", src: "mypage" },
];

function TileInner({ t }: { t: Tile }) {
  if (t.kind === "logo") {
    return (
      <div className="flex h-full w-full flex-col items-start justify-between bg-[#2C7AFC] p-4 md:p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cursor-haru.svg" alt="" className="h-7 w-7 md:h-8 md:w-8" draggable={false} />
        <div className="font-sans text-lg font-bold leading-none tracking-tight text-white md:text-2xl">
          하루안부
        </div>
      </div>
    );
  }
  if (t.kind === "headline") {
    return (
      <div className="flex h-full w-full items-center border border-white/10 bg-white/[0.05] p-5 md:p-7">
        <div
          className="font-sans font-semibold leading-[1.16] tracking-tight text-white"
          style={{ fontSize: "clamp(1.3rem, 2.6vw, 2.4rem)" }}
        >
          이걸 우리가
          <br />
          어떻게 만들었냐면
        </div>
      </div>
    );
  }
  if (t.kind === "orb") {
    return (
      <div className="relative flex h-full w-full items-end overflow-hidden bg-[#0b0b0c] p-4">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "118%",
            height: "118%",
            background:
              "radial-gradient(circle at 50% 38%, #1BE7EA 0%, rgba(70,195,230,.95) 40%, #46A8FF 72%, rgba(70,168,255,.25) 88%, transparent 100%)",
            filter: "blur(14px)",
            opacity: 0.72,
          }}
        />
        <div className="relative z-10 font-sans text-[12px] font-medium text-white/90 md:text-[13px]">
          {t.label}
        </div>
      </div>
    );
  }
  // screen
  return (
    <div className="h-full w-full bg-[#0b0b0c]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/media/screens/${t.src}.png`}
        alt=""
        className="h-full w-full object-cover object-top"
        draggable={false}
      />
    </div>
  );
}

/** "이걸 우리가 어떻게 만들었냐면" — nue풍 벤또 그리드로 조립 */
export function BentoOpenScene() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setShown(true);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative w-full bg-black" style={{ height: "100vh" }}>
      <div className="flex h-full w-full items-center justify-center px-4 md:px-10">
        <div
          className="grid w-full"
          style={{
            maxWidth: 1080,
            height: "min(78vh, 760px)",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {TILES.map((t) => (
            <div
              key={t.key}
              className="overflow-hidden rounded-2xl border border-white/8"
              style={{
                gridColumn: t.col,
                gridRow: t.row,
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : "translateY(18px) scale(0.96)",
                transition: `opacity 620ms cubic-bezier(0.2,1,0.4,1) ${t.order * 70}ms, transform 700ms cubic-bezier(0.2,1,0.4,1) ${t.order * 70}ms`,
                boxShadow: "0 10px 36px -12px rgba(0,0,0,.7)",
              }}
            >
              <TileInner t={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
