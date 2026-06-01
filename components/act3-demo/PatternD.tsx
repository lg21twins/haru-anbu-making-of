"use client";

import { useEffect, useRef, useState } from "react";
import { PageKind, PhoneMock, Stage } from "./PhoneMock";

type Event =
  | { kind: "userCmd"; text: string }
  | { kind: "aiThink"; text: string }
  | { kind: "fileEdit"; file: string; plus: number; minus: number }
  | { kind: "diff"; lines: { sign: "+" | "-" | " "; code: string }[] }
  | { kind: "build"; ok: boolean; ms?: number }
  | { kind: "stage"; page: PageKind; stage: Stage };

const FILES = [
  "app/page.tsx",
  "components/Greeting.tsx",
  "components/Report.tsx",
  "components/Chat.tsx",
  "components/Alert.tsx",
  "styles/globals.css",
];

const session: Event[] = [
  { kind: "userCmd", text: "보호자 홈 만들어줘. AI 오브 배경 + 인사 + 리포트 위젯" },
  { kind: "aiThink", text: "구조 짜는 중..." },
  { kind: "fileEdit", file: "app/page.tsx", plus: 32, minus: 0 },
  { kind: "fileEdit", file: "components/Greeting.tsx", plus: 18, minus: 0 },
  {
    kind: "diff",
    lines: [
      { sign: " ", code: 'export function Greeting() {' },
      { sign: "+", code: '  return (' },
      { sign: "+", code: '    <h1 className="text-2xl font-bold">' },
      { sign: "+", code: '      오늘도 수고하셨어요,' },
      { sign: "+", code: '      <br /> 정희님 잘 있어요' },
      { sign: "+", code: '    </h1>' },
      { sign: "+", code: '  );' },
    ],
  },
  { kind: "build", ok: true, ms: 412 },
  { kind: "stage", page: "home", stage: 2 },

  { kind: "userCmd", text: "그라데이션 너무 낮아 — 30% 정도로 올려" },
  { kind: "aiThink", text: "CSS 변수 조정..." },
  { kind: "fileEdit", file: "styles/globals.css", plus: 3, minus: 1 },
  {
    kind: "diff",
    lines: [
      { sign: " ", code: '.ai-orb {' },
      { sign: "-", code: '  filter: blur(48px);' },
      { sign: "+", code: '  filter: blur(24px);' },
      { sign: "+", code: '  opacity: 0.92;' },
      { sign: " ", code: '}' },
    ],
  },
  { kind: "build", ok: true, ms: 187 },
  { kind: "stage", page: "home", stage: 4 },

  { kind: "userCmd", text: "이제 AI 채팅 화면" },
  { kind: "aiThink", text: "컴포넌트 생성 중..." },
  { kind: "fileEdit", file: "components/Chat.tsx", plus: 64, minus: 0 },
  {
    kind: "diff",
    lines: [
      { sign: "+", code: '<Bubble side="ai">' },
      { sign: "+", code: '  오늘 어머님 상태 어땠나요?' },
      { sign: "+", code: '</Bubble>' },
    ],
  },
  { kind: "build", ok: true, ms: 298 },
  { kind: "stage", page: "chat", stage: 4 },

  { kind: "userCmd", text: "일일 리포트 — 사진 카드 + 위젯 2개" },
  { kind: "aiThink", text: "레이아웃 잡는 중..." },
  { kind: "fileEdit", file: "components/Report.tsx", plus: 88, minus: 0 },
  { kind: "build", ok: false },
  { kind: "userCmd", text: "위젯 카드 radius 너무 작아 — 20px" },
  { kind: "fileEdit", file: "components/Report.tsx", plus: 4, minus: 2 },
  { kind: "build", ok: true, ms: 524 },
  { kind: "stage", page: "report", stage: 4 },

  { kind: "userCmd", text: "긴급 알림 리스트" },
  { kind: "fileEdit", file: "components/Alert.tsx", plus: 41, minus: 0 },
  { kind: "build", ok: true, ms: 233 },
  { kind: "stage", page: "alert", stage: 4 },

  { kind: "userCmd", text: "마이페이지까지 마무리" },
  { kind: "fileEdit", file: "components/MyPage.tsx", plus: 52, minus: 0 },
  { kind: "build", ok: true, ms: 198 },
  { kind: "stage", page: "mypage", stage: 4 },
];

const STEP_MS = 900;

export function PatternD() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(-1);
  const [page, setPage] = useState<PageKind>("home");
  const [stage, setStage] = useState<Stage>(0);
  const [touchedFiles, setTouchedFiles] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

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
    let timer: number | null = null;
    const advance = (i: number) => {
      if (i >= session.length) {
        // loop
        timer = window.setTimeout(() => {
          setStep(-1);
          setTouchedFiles(new Set());
          setStage(0);
          setPage("home");
          advance(0);
        }, 2400);
        return;
      }
      setStep(i);
      const ev = session[i];
      if (ev.kind === "fileEdit") {
        setTouchedFiles((prev) => new Set(prev).add(ev.file));
      }
      if (ev.kind === "stage") {
        setPage(ev.page);
        setStage(ev.stage);
      }
      timer = window.setTimeout(() => advance(i + 1), STEP_MS);
    };
    advance(0);
    return () => {
      if (timer != null) window.clearTimeout(timer);
    };
  }, [running]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [step]);

  const visible = session.slice(0, step + 1);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[#0d1117] font-mono text-[12px] text-white/85"
    >
      {/* IDE chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-white/8 bg-[#161b22] px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="ml-3 text-[11px] text-white/50">
          cursor · haru-anbu/v8-보호자앱
        </div>
        <div className="ml-auto text-[10px] uppercase tracking-[0.3em] text-white/30">
          Pattern D · IDE Live
        </div>
      </div>

      <div className="grid h-[calc(100%-2.25rem)] grid-cols-[180px_1fr_360px]">
        {/* file tree */}
        <div className="border-r border-white/8 bg-[#0d1117] px-3 py-3">
          <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/30">
            files
          </div>
          {FILES.map((f) => {
            const touched = touchedFiles.has(f);
            const recent =
              step >= 0 &&
              session[step]?.kind === "fileEdit" &&
              (session[step] as { file: string }).file === f;
            return (
              <div
                key={f}
                className="flex items-center gap-2 px-1 py-[3px] text-[11px]"
                style={{
                  color: recent
                    ? "rgba(255,255,255,.95)"
                    : touched
                    ? "rgba(255,255,255,.7)"
                    : "rgba(255,255,255,.3)",
                  background: recent ? "rgba(44,122,252,.18)" : "transparent",
                  transition: "background 200ms, color 200ms",
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: recent
                      ? "#74a8ff"
                      : touched
                      ? "rgba(255,255,255,.4)"
                      : "transparent",
                  }}
                />
                {f}
              </div>
            );
          })}
        </div>

        {/* chat + diff stream */}
        <div className="flex flex-col overflow-hidden">
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto px-5 py-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {visible.map((ev, i) => (
              <EventRow key={i} ev={ev} isLast={i === visible.length - 1} />
            ))}
          </div>
          <div className="border-t border-white/8 bg-[#161b22] px-4 py-2 text-[11px] text-white/50">
            <span className="text-white/30">▸</span> 대기 중...
          </div>
        </div>

        {/* preview */}
        <div className="flex flex-col border-l border-white/8 bg-[#0a0d11]">
          <div className="border-b border-white/8 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
            preview · localhost:3000
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div style={{ transform: "scale(0.85)" }}>
              <PhoneMock page={page} stage={stage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventRow({ ev, isLast }: { ev: Event; isLast: boolean }) {
  if (ev.kind === "userCmd") {
    return (
      <div className="mt-3 flex gap-2">
        <span className="text-[#74a8ff]">▸</span>
        <div className="text-white">
          {ev.text}
          {isLast && <span className="caret" aria-hidden />}
        </div>
      </div>
    );
  }
  if (ev.kind === "aiThink") {
    return (
      <div className="mt-1 flex gap-2 text-white/55">
        <span>···</span>
        <div>{ev.text}</div>
      </div>
    );
  }
  if (ev.kind === "fileEdit") {
    return (
      <div className="mt-1 flex items-center gap-2 text-[11px] text-white/65">
        <span className="text-[#7eff8d]/60">✎</span>
        <span className="text-white/80">{ev.file}</span>
        <span className="text-[#7eff8d]">+{ev.plus}</span>
        {ev.minus > 0 && <span className="text-[#ff7b9c]">-{ev.minus}</span>}
      </div>
    );
  }
  if (ev.kind === "diff") {
    return (
      <div className="mt-2 overflow-hidden rounded-md border border-white/8 bg-black/40 px-3 py-2 text-[10.5px]">
        {ev.lines.map((l, i) => (
          <div
            key={i}
            className="whitespace-pre"
            style={{
              color:
                l.sign === "+"
                  ? "#7eff8d"
                  : l.sign === "-"
                  ? "#ff7b9c"
                  : "rgba(255,255,255,.55)",
            }}
          >
            {l.sign} {l.code}
          </div>
        ))}
      </div>
    );
  }
  if (ev.kind === "build") {
    if (ev.ok) {
      return (
        <div className="mt-1 flex items-center gap-2 text-[11px]">
          <span className="text-[#7eff8d]">⚡</span>
          <span className="text-[#7eff8d]/90">build success</span>
          {ev.ms && <span className="text-white/40">{ev.ms}ms</span>}
        </div>
      );
    }
    return (
      <div className="mt-1 flex items-center gap-2 text-[11px]">
        <span className="text-[#ff7b9c]">✕</span>
        <span className="text-[#ff7b9c]/90">build failed — retry</span>
      </div>
    );
  }
  if (ev.kind === "stage") {
    return (
      <div className="mt-1 text-[11px] text-white/40">
        preview → {ev.page}
      </div>
    );
  }
  return null;
}
