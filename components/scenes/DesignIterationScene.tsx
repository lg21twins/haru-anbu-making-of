"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/effects/PhoneFrame";

const TOTAL_VH = 820;

const explicit = [
  { v: "v1", caption: "초기 손그림", src: "/media/img/stage-v1.png" },
  { v: "v2", caption: "역할별 분기", src: "/media/img/stage-v2.png" },
  { v: "v3", caption: "정보 위계 정돈", src: "/media/img/stage-v2.png" },
];

const cascade = [
  { v: "v4", src: "/media/img/stage-v4.png" },
  { v: "v6", src: "/media/img/stage-v7.png" },
  { v: "v7", src: "/media/img/stage-v7.png" },
  { v: "v8", src: "/media/img/stage-v8.png" },
  { v: "v9.5", src: "/media/img/stage-v9-5.png" },
  { v: "v10", src: "/media/img/stage-v10.png" },
  { v: "v11", src: "/media/img/stage-v11.png" },
  { v: "v12", src: "/media/img/stage-v9-5.png" },
];

const finalStage = { v: "v13", src: "/media/img/stage-v9.png" };

const M = {
  v1In: 0.04,
  v1Hold: 0.09,
  retry1Peak: 0.16,
  v2In: 0.19,
  v2Hold: 0.24,
  retry2Peak: 0.31,
  v3In: 0.34,
  v3Hold: 0.40,
  v3Out: 0.49,
  cascadeStart: 0.50,
  cascadeEnd: 0.66,
  thatsItIn: 0.67,
  thatsItHold: 0.73,
  thatsItOut: 0.80,
  finalIn: 0.80,
  finalHold: 0.88,
};

function fadeBetween(
  p: number,
  fadeIn: number,
  full: number,
  fadeOutStart: number,
  end: number
): number {
  if (p < fadeIn) return 0;
  if (p < full) return (p - fadeIn) / (full - fadeIn);
  if (p < fadeOutStart) return 1;
  if (p < end) return 1 - (p - fadeOutStart) / (end - fadeOutStart);
  return 0;
}

export function DesignIterationScene() {
  const outerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      setProgress(scrolled / range);
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        compute();
        ticking.current = false;
      });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const p = progress;

  const v1Op = fadeBetween(p, M.v1In, M.v1Hold, M.retry1Peak, M.v2In);
  const v2Op = fadeBetween(p, M.v2In, M.v2Hold, M.retry2Peak, M.v3In);
  const v3Op = fadeBetween(p, M.v3In, M.v3Hold, M.v3Out, M.cascadeStart);

  const retry1 = fadeBetween(p, M.v1Hold + 0.02, M.retry1Peak, M.retry1Peak + 0.005, M.v2In - 0.005);
  const retry2 = fadeBetween(p, M.v2Hold + 0.02, M.retry2Peak, M.retry2Peak + 0.005, M.v3In - 0.005);
  const showRetry = Math.max(retry1, retry2);

  const cascadeOp = fadeBetween(
    p,
    M.cascadeStart,
    M.cascadeStart + 0.02,
    M.cascadeEnd - 0.02,
    M.cascadeEnd
  );
  const cascadeP = Math.max(
    0,
    Math.min(1, (p - M.cascadeStart) / (M.cascadeEnd - M.cascadeStart))
  );
  const cascadeIdx = Math.min(
    cascade.length - 1,
    Math.floor(cascadeP * cascade.length)
  );

  const thatsItOp = fadeBetween(p, M.thatsItIn, M.thatsItHold, M.thatsItOut - 0.04, M.thatsItOut);
  const finalOp = fadeBetween(p, M.finalIn, M.finalHold, 1.5, 2);
  const finalScale = 1 + Math.max(0, Math.min(0.08, (p - M.finalIn) / 0.2));

  return (
    <section
      id="s-design"
      ref={outerRef}
      className="relative w-full"
      style={{ height: `${TOTAL_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        <header className="absolute inset-x-0 top-12 z-20 px-6 md:top-20 md:px-12">
          <p
            className="font-mono leading-[1.1] text-white"
            style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)" }}
          >
            <span className="text-[color:var(--color-key)]">&gt; </span>
            디자인 시작.
          </p>
        </header>

        <div className="relative flex flex-1 items-center justify-center pb-24 pt-28 md:pb-32 md:pt-40">
          <div
            className="relative"
            style={{
              transform: `scale(${finalScale})`,
              transition: "transform 200ms linear",
            }}
          >
            <PhoneFrame size="lg">
              <Layer src={explicit[0].src} opacity={v1Op} />
              <Layer src={explicit[1].src} opacity={v2Op} />
              <Layer src={explicit[2].src} opacity={v3Op} />
              <Layer src={cascade[cascadeIdx].src} opacity={cascadeOp} />
              <Layer src={finalStage.src} opacity={finalOp} priority />
            </PhoneFrame>

            {showRetry > 0 && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ opacity: showRetry }}
              >
                <p
                  className="font-sans font-bold text-white"
                  style={{
                    fontSize: "clamp(4.5rem, 13vw, 12rem)",
                    textShadow:
                      "0 0 40px rgba(0,0,0,0.95), 0 0 90px rgba(0,0,0,0.8)",
                  }}
                >
                  다시.
                </p>
              </div>
            )}

            {thatsItOp > 0 && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ opacity: thatsItOp }}
              >
                <p
                  className="font-sans font-bold text-[color:var(--color-key)]"
                  style={{
                    fontSize: "clamp(4.5rem, 13vw, 13rem)",
                    filter: "drop-shadow(0 0 40px rgba(126,255,141,0.55))",
                  }}
                >
                  이거야!
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="absolute inset-x-0 bottom-10 z-20 flex items-center justify-end px-6 md:bottom-14 md:px-12">
          <Progress p={p} />
        </footer>
      </div>
    </section>
  );
}

function Layer({
  src,
  opacity,
  priority = false,
}: {
  src: string;
  opacity: number;
  priority?: boolean;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{ opacity, transition: "opacity 180ms linear" }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 70vw, 420px"
        className="object-cover object-top"
        priority={priority}
      />
    </div>
  );
}

function Progress({ p }: { p: number }) {
  const segments = [
    { label: "v1", end: M.v2In },
    { label: "v2", end: M.v3In },
    { label: "v3", end: M.cascadeStart },
    { label: "...", end: M.cascadeEnd },
    { label: "v13", end: 1 },
  ];
  const activeIdx = segments.findIndex((s) => p < s.end);
  const idx = activeIdx === -1 ? segments.length - 1 : activeIdx;

  return (
    <div className="flex items-center gap-1.5">
      {segments.map((s, i) => (
        <span
          key={s.label}
          className="block h-[2px] transition-all duration-500"
          style={{
            width: i === idx ? "32px" : "12px",
            background:
              i === idx
                ? "var(--color-key)"
                : i < idx
                  ? "rgba(126,255,141,0.45)"
                  : "rgba(255,255,255,0.18)",
            boxShadow:
              i === idx ? "0 0 10px rgba(126,255,141,0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}
