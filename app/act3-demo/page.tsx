"use client";

import { PaletteSwatch, palettes } from "@/components/act3-demo/PaletteSwatch";

export default function Act3DemoPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-white/8 bg-black/80 px-6 backdrop-blur">
        <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">
          Chaos Palette — 8 시안 비교
        </div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">
          어떤 색이 맞아?
        </div>
      </header>

      <section className="px-8 pt-10 pb-20">
        <div className="mx-auto max-w-[1400px]">
          <h1
            className="font-sans font-semibold leading-[1.1] text-white"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
          >
            ChaosToOrderScene — 색 시안
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.55] text-white/60">
            현재 메인에 적용된 건 C (블루-시안). 다른 7개 톤도 같은 카드 풀로
            렌더했어. 좋은 거 골라줘 — 그 톤으로 메인에 반영할게.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {palettes.map((p) => (
              <PaletteSwatch
                key={p.name}
                name={p.name}
                desc={p.desc}
                bg={p.bg}
                color={p.color}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
