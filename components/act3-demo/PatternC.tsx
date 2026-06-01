"use client";

import { useEffect, useRef, useState } from "react";
import { PageKind, PAGE_LABEL, PhoneMock } from "./PhoneMock";

type Frame = { page: PageKind; cmd: string };

const frames: Frame[] = [
  { page: "home", cmd: "보호자 홈 만들어줘" },
  { page: "chat", cmd: "AI 케어매니저 채팅" },
  { page: "report", cmd: "일일 리포트 화면" },
  { page: "alert", cmd: "긴급 알림 리스트" },
  { page: "mypage", cmd: "마이페이지" },
];

const FRAME_MS = 3800;

export function PatternC() {
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRunning(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % frames.length);
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.3em] text-white/40">
        Pattern C · Montage
      </div>

      {/* horizontal phone reel */}
      <div className="flex h-full w-full flex-col items-center justify-center gap-10">
        {/* current cmd */}
        <div
          key={`cmd-${idx}`}
          className="font-sans font-semibold leading-[1.1] text-white"
          style={{
            fontSize: "clamp(1.8rem, 3.4vw, 3.6rem)",
            animation: `slideUp 600ms cubic-bezier(0.2,1,0.4,1) both`,
          }}
        >
          &ldquo;{frames[idx].cmd}&rdquo;
        </div>

        {/* phone reel — current center, others to sides */}
        <div className="relative h-[600px] w-full">
          <div
            className="absolute left-1/2 top-1/2 flex -translate-y-1/2 items-center gap-12"
            style={{
              transform: `translate(calc(-50% - ${idx * 360}px), -50%)`,
              transition: "transform 900ms cubic-bezier(0.6,0,0.2,1)",
            }}
          >
            {frames.map((f, i) => {
              const dist = Math.abs(i - idx);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.32 : 0.12;
              const scale = dist === 0 ? 1 : 0.86;
              return (
                <div
                  key={i}
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                    transition: "opacity 800ms, transform 800ms",
                  }}
                >
                  <PhoneMock page={f.page} stage={4} />
                </div>
              );
            })}
          </div>
        </div>

        {/* labels under reel */}
        <div className="flex gap-8 text-[11px] uppercase tracking-[0.3em]">
          {frames.map((f, i) => (
            <span
              key={i}
              className="transition-colors"
              style={{
                color: i === idx ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.25)",
              }}
            >
              {PAGE_LABEL[f.page]}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
