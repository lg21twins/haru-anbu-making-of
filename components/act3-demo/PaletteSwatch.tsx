"use client";

import { useMemo } from "react";

export type ColorFn = (i: number, r1: number, r2: number) => string;

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const N = 56; // 미니 풀 카드 개수
const COLS = 8;
const ROWS = 7;

type Card = {
  id: number;
  x: number;
  y: number;
  r: number;
  scale: number;
  c1: string;
  c2: string;
};

export function PaletteSwatch({
  name,
  desc,
  bg = "#000000",
  color,
}: {
  name: string;
  desc: string;
  bg?: string;
  color: ColorFn;
}) {
  const cards = useMemo<Card[]>(() => {
    const list: Card[] = [];
    for (let i = 0; i < N; i++) {
      const r1 = rand(i + 1);
      const r2 = rand(i + 7);
      const r3 = rand(i + 13);
      const r4 = rand(i + 19);
      list.push({
        id: i,
        x: r1 * 100,
        y: r2 * 100,
        r: (r3 - 0.5) * 60,
        scale: 0.55 + r4 * 0.55,
        c1: color(i, r1, r2),
        c2: color(i + 100, r2, r1),
      });
    }
    return list;
  }, [color]);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10"
      style={{ background: bg }}
    >
      {cards.map((c) => (
        <div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: `translate(-50%, -50%) rotate(${c.r}deg) scale(${c.scale})`,
            width: 30,
            height: 48,
          }}
        >
          <div
            className="h-full w-full rounded-[3px] border border-white/8"
            style={{
              background: `linear-gradient(135deg, ${c.c1} 0%, ${c.c2} 100%)`,
              opacity: 0.82,
              boxShadow: "0 2px 6px rgba(0,0,0,.35)",
            }}
          >
            <div className="flex h-full flex-col p-[2px]">
              <div className="h-[2px] w-3/4 rounded-full bg-white/40" />
              <div className="mt-0.5 h-[1px] w-1/2 rounded-full bg-white/20" />
              <div className="mt-auto h-2 w-full rounded-sm bg-white/15" />
            </div>
          </div>
        </div>
      ))}

      {/* 라벨 오버레이 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3">
        <div className="text-[13px] font-semibold text-white">{name}</div>
        <div className="mt-0.5 text-[11px] text-white/55">{desc}</div>
      </div>
    </div>
  );
}

// 8개 시안 -------------------------------------------------
export const palettes: {
  name: string;
  desc: string;
  bg?: string;
  color: ColorFn;
}[] = [
  {
    name: "A · Mono White",
    desc: "흰색 알파 변주 — 가장 미니멀",
    color: (_i, r1) => `rgba(255,255,255,${0.18 + r1 * 0.32})`,
  },
  {
    name: "B · Haru Blue",
    desc: "브랜드 블루(#2C7AFC) 단색 변주",
    color: (_i, r1) => {
      const l = 30 + r1 * 30;
      return `hsl(218, 85%, ${l}%)`;
    },
  },
  {
    name: "C · Blue → Cyan (현재)",
    desc: "현재 적용 — 블루-시안 그라데이션",
    color: (_i, r1) => `hsl(${200 + r1 * 80}, 55%, 32%)`,
  },
  {
    name: "D · Mono Dark",
    desc: "검정~회색만 — 차분",
    color: (_i, r1) => `hsl(220, 8%, ${10 + r1 * 22}%)`,
  },
  {
    name: "E · Pastel",
    desc: "파스텔 — 부드러운 다양 hue",
    color: (i, r1) => {
      const hues = [205, 250, 290, 165, 35, 195, 320];
      return `hsl(${hues[i % hues.length] + (r1 - 0.5) * 20}, 45%, 70%)`;
    },
    bg: "#0a0a0e",
  },
  {
    name: "F · Neon Accent",
    desc: "다크 + 시안/마젠타 액센트",
    color: (i, r1) => {
      if (i % 7 === 0) return `hsl(180, 90%, ${45 + r1 * 15}%)`;
      if (i % 11 === 0) return `hsl(320, 80%, ${50 + r1 * 15}%)`;
      return `hsl(220, 12%, ${14 + r1 * 18}%)`;
    },
  },
  {
    name: "G · Warm",
    desc: "오렌지/레드/노랑 — 따뜻",
    color: (_i, r1) => `hsl(${10 + r1 * 50}, 65%, ${28 + r1 * 15}%)`,
  },
  {
    name: "H · Full Rainbow",
    desc: "360도 hue — 카오스 강조",
    color: (i, r1) => `hsl(${(i * 23 + r1 * 40) % 360}, 55%, ${35 + r1 * 12}%)`,
  },
];
