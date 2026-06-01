"use client";

import { useEffect, useRef, useState } from "react";
import { PageKind, PhoneMock } from "./PhoneMock";

const cmds = [
  "보호자 홈 만들어줘",
  "AI 오브 배경에 깔아",
  "그라데이션 30% 올려",
  "AI 채팅 화면",
  "Bubble 컴포넌트",
  "ai persona 추가",
  "일일 리포트 — 사진 카드",
  "위젯 카드 radius 20",
  "투약/맥박 위젯",
  "긴급 알림 리스트",
  "맥박 이상 빨강으로",
  "마이페이지",
  "아바타 그라데이션",
  "설정 행 4개",
];

const diffs: { sign: "+" | "-"; code: string }[] = [
  { sign: "+", code: 'className="text-2xl font-bold"' },
  { sign: "+", code: '<Bubble side="ai">' },
  { sign: "-", code: 'padding: 16px' },
  { sign: "+", code: 'padding: 24px' },
  { sign: "+", code: 'borderRadius: 28' },
  { sign: "+", code: 'background: radial-gradient(' },
  { sign: "+", code: '  #1BE7EA 0%, #46A8FF 72%' },
  { sign: "+", code: ')' },
  { sign: "+", code: 'filter: blur(24px)' },
  { sign: "-", code: 'fontSize: 18' },
  { sign: "+", code: 'fontSize: 28' },
  { sign: "+", code: 'fontWeight: 700' },
  { sign: "+", code: '<MomentCard quote="..." />' },
  { sign: "+", code: '<Widget kind="meds" />' },
  { sign: "+", code: '<Widget kind="pulse" />' },
  { sign: "+", code: 'background: rgba(255,255,255,.92)' },
  { sign: "-", code: 'borderColor: #ccc' },
  { sign: "+", code: 'borderColor: rgba(0,0,0,.04)' },
  { sign: "+", code: '<AlertList urgent />' },
  { sign: "+", code: 'animation: orbBreath 7s' },
];

const thumbHues = [200, 215, 230, 245, 205, 220, 235, 195, 210, 225];
const PAGES: PageKind[] = ["home", "chat", "report", "alert", "mypage"];

export function PatternF() {
  const ref = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);
  const [cmdIdx, setCmdIdx] = useState(0);
  const [diffIdx, setDiffIdx] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [phonePage, setPhonePage] = useState<PageKind>("home");

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
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t1 = window.setInterval(
      () => setCmdIdx((i) => (i + 1) % cmds.length),
      900
    );
    const t2 = window.setInterval(
      () => setDiffIdx((i) => (i + 1) % diffs.length),
      550
    );
    const t3 = window.setInterval(() => setThumbOffset((o) => o + 1), 700);
    const t4 = window.setInterval(
      () => setPhonePage((p) => {
        const i = PAGES.indexOf(p);
        return PAGES[(i + 1) % PAGES.length];
      }),
      2200
    );
    return () => {
      window.clearInterval(t1);
      window.clearInterval(t2);
      window.clearInterval(t3);
      window.clearInterval(t4);
    };
  }, [running]);

  // 보이는 명령 로그 = 마지막 8개
  const visibleCmds: string[] = [];
  for (let i = 0; i < 8; i++) {
    const idx = (cmdIdx - i + cmds.length) % cmds.length;
    visibleCmds.push(cmds[idx]);
  }

  // 보이는 diff = 마지막 12개
  const visibleDiffs: { sign: "+" | "-"; code: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const idx = (diffIdx - i + diffs.length) % diffs.length;
    visibleDiffs.push(diffs[idx]);
  }

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black font-mono"
    >
      <div className="absolute left-6 top-3 z-50 text-[11px] uppercase tracking-[0.3em] text-white/40">
        Pattern F · Quad Simulcast
      </div>

      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1px] bg-white/10 pt-8">
        {/* 좌상 — 명령 로그 */}
        <div className="overflow-hidden bg-[#0a0d11] p-5">
          <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
            명령 로그
          </div>
          <div className="flex flex-col gap-1">
            {visibleCmds.map((c, i) => (
              <div
                key={`${cmdIdx}-${i}`}
                className="text-[14px] leading-[1.3]"
                style={{
                  color: `rgba(255,255,255,${(1 - i * 0.11).toFixed(2)})`,
                  transform: `translateY(${i === 0 ? 0 : 0}px)`,
                }}
              >
                <span className="mr-2 text-white/30">›</span>
                {c}
                {i === 0 && <span className="caret" aria-hidden />}
              </div>
            ))}
          </div>
        </div>

        {/* 우상 — 코드 diff 흐름 */}
        <div className="overflow-hidden bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              diff stream
            </div>
            <div className="flex gap-3 text-[11px]">
              <span className="text-[#7eff8d]">+{diffs.filter((d) => d.sign === "+").length * 13}</span>
              <span className="text-[#ff7b9c]">-{diffs.filter((d) => d.sign === "-").length * 4}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {visibleDiffs.map((d, i) => (
              <div
                key={`${diffIdx}-${i}`}
                className="whitespace-pre text-[11px] leading-[1.5]"
                style={{
                  color:
                    d.sign === "+"
                      ? `rgba(126,255,141,${(1 - i * 0.075).toFixed(2)})`
                      : `rgba(255,123,156,${(1 - i * 0.075).toFixed(2)})`,
                }}
              >
                {d.sign} {d.code}
              </div>
            ))}
          </div>
        </div>

        {/* 좌하 — 시안 갤러리 */}
        <div className="overflow-hidden bg-[#0a0d11] p-5">
          <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
            시안 갤러리
          </div>
          <div className="grid h-[calc(100%-2rem)] grid-cols-4 gap-2 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => {
              const hue = thumbHues[(i + thumbOffset) % thumbHues.length];
              return (
                <div
                  key={i}
                  className="aspect-[3/5] overflow-hidden rounded-md border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 45%, 28%), hsl(${hue + 25}, 55%, 18%))`,
                    opacity: 0.55 + (i % 5) * 0.08,
                    transform: `translateY(${(i * 7 + thumbOffset * 4) % 12 - 6}px)`,
                    transition: "transform 700ms cubic-bezier(0.2,1,0.4,1)",
                  }}
                >
                  <div className="flex h-full flex-col p-1">
                    <div className="h-1 w-3/4 rounded bg-white/40" />
                    <div className="mt-auto h-3 w-full rounded bg-white/15" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우하 — 완성 폰 미리보기 */}
        <div className="flex items-center justify-center overflow-hidden bg-[#0a0d11] p-5">
          <div className="absolute right-7 top-[calc(50%+10px)] text-[10px] uppercase tracking-[0.3em] text-white/30">
            preview
          </div>
          <div style={{ transform: "scale(0.78)" }}>
            <PhoneMock page={phonePage} stage={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
