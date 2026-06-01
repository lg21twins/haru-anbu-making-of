"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/effects/PhoneFrame";

// 섹션 끝 = "이거야!" 페이드아웃 끝 시점에 맞춰 빈 검은 구간 제거
// 원래 820vh + 페이드아웃 0.80 진행 → 1.0까지 144vh 빈 구간 발생
// 676vh + M 값 1.25배 → 모든 진행 단계의 절대 위치는 동일하게 유지하면서 끝부분만 잘라냄
const TOTAL_VH = 676;

// 사람 일러스트/캐릭터 아바타 없는 audit-screenshot들로만 구성
const explicit = [
  { v: "v01", caption: "초기 시안", src: "/media/img/stages/v01.png" },
  { v: "v02", caption: "인트로 정리", src: "/media/img/stages/v02.png" },
  { v: "v03", caption: "타이포 위계", src: "/media/img/stages/v03.png" },
];

const cascade = [
  { v: "v04", src: "/media/img/stages/v04.png" },
  { v: "v05", src: "/media/img/stages/v05.png" },
  { v: "v06", src: "/media/img/stages/v06.png" },
  { v: "v07", src: "/media/img/stages/v07.png" },
  { v: "v08", src: "/media/img/stages/v08.png" },
  { v: "v09", src: "/media/img/stages/v09.png" },
  { v: "v10", src: "/media/img/stages/v10.png" },
  { v: "v11", src: "/media/img/stages/v11.png" },
  { v: "v12", src: "/media/img/stages/v12.png" },
];

const finalStage = { v: "v11_보호자앱", src: "/media/img/stages/v13.png" };

// 원래 0.80에서 페이드아웃 끝 → 1.0이 되도록 1.25배 매핑
// 절대 vh 위치는 TOTAL_VH 단축과 함께 동일하게 유지됨
const M = {
  v1In: 0.05,
  v1Hold: 0.11,
  retry1Peak: 0.20,
  v2In: 0.24,
  v2Hold: 0.30,
  retry2Peak: 0.39,
  v3In: 0.42,
  v3Hold: 0.50,
  v3Out: 0.61,
  cascadeStart: 0.625,
  cascadeEnd: 0.825,
  thatsItIn: 0.84,
  thatsItHold: 0.91,
  thatsItOut: 1.0,
  finalIn: 1.0,
  finalHold: 1.1,
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
  const finalScale = 1 + Math.max(0, Math.min(0.04, (p - M.finalIn) / 0.4));

  // 좌상단 하루안부 로고(HamburgerNav)는 별도 컴포넌트로 유지되므로,
  // 씬 내부의 모든 UI(헤더 텍스트, 버전 라벨, Progress, PhoneFrame)를
  // "이거야!" 페이드아웃과 동시에 사라뜨려 검은 배경만 남도록 한다.
  const sceneFadeOutOp =
    p < M.thatsItOut - 0.04
      ? 1
      : Math.max(0, 1 - (p - (M.thatsItOut - 0.04)) / 0.04);

  // 현재 활성 버전 라벨 — opacity 가장 큰 레이어 기준
  const layers = [
    { v: explicit[0].v, op: v1Op },
    { v: explicit[1].v, op: v2Op },
    { v: explicit[2].v, op: v3Op },
    { v: cascade[cascadeIdx].v, op: cascadeOp },
    { v: finalStage.v, op: finalOp },
  ];
  const top = layers.reduce((a, b) => (b.op > a.op ? b : a), layers[0]);
  const versionLabel = top.op > 0.1 ? top.v : "";

  return (
    <section
      id="s-design"
      ref={outerRef}
      className="relative w-full"
      style={{ height: `${TOTAL_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        <header
          className="absolute inset-x-0 top-12 z-20 flex items-start justify-between gap-6 px-6 md:top-20 md:px-12"
          style={{
            opacity: sceneFadeOutOp,
            transition: "opacity 280ms ease-out",
          }}
        >
          <p
            className="font-mono leading-[1.1] text-white"
            style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)" }}
          >
            <span className="text-[color:var(--color-key)]">&gt; </span>
            디자인 시작.
          </p>
          <div
            className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-mono uppercase tracking-[0.18em] text-white/85 backdrop-blur md:px-5 md:py-2.5"
            style={{
              fontSize: "clamp(0.95rem, 1.4vw, 1.25rem)",
              opacity: versionLabel ? 1 : 0,
              transition: "opacity 320ms ease-out",
            }}
          >
            {versionLabel}
          </div>
        </header>

        <div className="relative flex flex-1 items-center justify-center pb-16 pt-24 md:pb-20 md:pt-28">
          <div
            className="relative"
            style={{
              transform: `scale(${finalScale})`,
              transition: "transform 200ms linear",
            }}
          >
            {/* '이거야!' 시점 이후 폰 프레임 영구 사라짐 — 다시 나타나지 않음 */}
            <div
              style={{
                opacity:
                  p < M.thatsItIn - 0.02
                    ? 1
                    : Math.max(0, 1 - (p - (M.thatsItIn - 0.02)) / 0.03),
                transition: "opacity 280ms ease-out",
                pointerEvents: p >= M.thatsItIn ? "none" : "auto",
              }}
            >
              <PhoneFrame size="lg">
                <Layer src={explicit[0].src} opacity={v1Op} />
                <Layer src={explicit[1].src} opacity={v2Op} />
                <Layer src={explicit[2].src} opacity={v3Op} />
                <Layer src={cascade[cascadeIdx].src} opacity={cascadeOp} />
              </PhoneFrame>
            </div>

            {showRetry > 0 && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
                style={{ opacity: showRetry }}
              >
                <p
                  className="whitespace-nowrap font-sans font-bold text-white"
                  style={{
                    fontSize: "clamp(3.5rem, 11vw, 10rem)",
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
                className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-visible"
                style={{ opacity: thatsItOp }}
              >
                <p
                  className="whitespace-nowrap font-sans font-bold text-[color:var(--color-key)]"
                  style={{
                    fontSize: "clamp(3.5rem, 11vw, 11rem)",
                    filter: "drop-shadow(0 0 40px rgba(255,255,255,0.55))",
                  }}
                >
                  이거야!
                </p>
              </div>
            )}
          </div>
        </div>

        <footer
          className="absolute inset-x-0 bottom-10 z-20 flex items-center justify-end px-6 md:bottom-14 md:px-12"
          style={{
            opacity: sceneFadeOutOp,
            transition: "opacity 280ms ease-out",
          }}
        >
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
    { label: "v01", end: M.v2In },
    { label: "v02", end: M.v3In },
    { label: "v03", end: M.cascadeStart },
    { label: "...", end: M.cascadeEnd },
    { label: "v11_보호자앱", end: 1 },
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
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.18)",
            boxShadow:
              i === idx ? "0 0 10px rgba(255,255,255,0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}
