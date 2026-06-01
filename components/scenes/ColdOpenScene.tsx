"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/scrollLock";

// 실제 하루안부 보호자앱 화면 (07_디자인/mockup/v8_보호자앱 캡처)
const SCREENS = [
  "home",
  "chat",
  "report",
  "alert",
  "timeline",
  "prescription",
  "mypage",
  "records",
  "billing",
  "settings",
  "guide",
  "sotong",
];

const CARD_W = 108;
const ASPECT = 430 / 932; // 캡처 비율
const CARD_H = Math.round(CARD_W / ASPECT);

type Phase = "idle" | "flash" | "freeze" | "copy" | "dissolve" | "settle";

/**
 * 콜드 오픈 — 완성된 실제 앱 화면 12장이 쫙 깔림 →
 * "이걸 우리가 어떻게 만들었냐면" → 디졸브 → 곧장 아래 명령(OpeningPromptScene)으로.
 */
export function ColdOpenScene() {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(SCREENS.length);
      setPhase("settle");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          io.disconnect();
          setPhase("flash");
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // flash — 화면 하나씩 빠르게 등장
  useEffect(() => {
    if (phase !== "flash") return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= SCREENS.length) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase("freeze"), 360);
      }
    }, 130);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "freeze") return;
    const id = window.setTimeout(() => setPhase("copy"), 620);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "copy") return;
    const id = window.setTimeout(() => setPhase("dissolve"), 1550);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "dissolve") return;
    const id = window.setTimeout(() => setPhase("settle"), 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  // settle 직후 → 명령(OpeningPromptScene) 시작 지점으로 자동 스크롤
  useEffect(() => {
    if (phase !== "settle") return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nextTop = node.offsetTop + node.offsetHeight;
    if (window.scrollY > nextTop - 40) return; // 이미 내려갔으면 강제 X
    const id = window.setTimeout(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(nextTop, { duration: 1.1, force: true });
      else window.scrollTo({ top: nextTop, behavior: "smooth" });
    }, 450);
    return () => window.clearTimeout(id);
  }, [phase]);

  const dim = phase === "copy" || phase === "dissolve";
  const gone = phase === "dissolve" || phase === "settle";

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      {/* 화면 그리드 */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="flex flex-wrap items-center justify-center"
          style={{
            maxWidth: 768,
            gap: 10,
            opacity: phase === "settle" ? 0 : 1,
            filter: dim
              ? gone
                ? "brightness(0.35) blur(16px) saturate(0.4)"
                : "brightness(0.5)"
              : "none",
            transform: gone ? "scale(0.92)" : "scale(1)",
            transition:
              "opacity 800ms cubic-bezier(0.4,0,0.2,1), filter 800ms cubic-bezier(0.4,0,0.2,1), transform 850ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {SCREENS.map((slug, i) => (
            <div
              key={slug}
              className="relative overflow-hidden rounded-[18px] border border-white/12 bg-[#0b0b0c]"
              style={{
                width: CARD_W,
                height: CARD_H,
                boxShadow:
                  "0 8px 28px -8px rgba(0,0,0,.7), 0 2px 8px rgba(0,0,0,.5)",
                opacity: i < shown ? 1 : 0,
                transform: i < shown ? "translateY(0) scale(1)" : "translateY(22px) scale(0.96)",
                transition:
                  "opacity 320ms cubic-bezier(0.2,1,0.4,1), transform 360ms cubic-bezier(0.2,1,0.4,1)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/media/screens/${slug}.png`}
                alt=""
                draggable={false}
                className="h-full w-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 카피 */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{
          opacity: phase === "copy" || phase === "dissolve" ? 1 : 0,
          transition: "opacity 700ms",
        }}
      >
        <div
          className="font-sans font-semibold leading-[1.12] tracking-tight text-white"
          style={{
            fontSize: "clamp(2rem, 5.5vw, 5rem)",
            textShadow: "0 4px 40px rgba(0,0,0,.9)",
          }}
        >
          이걸 우리가
          <br />
          어떻게 만들었냐면
        </div>
      </div>

    </section>
  );
}
