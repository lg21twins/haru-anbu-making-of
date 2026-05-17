"use client";

import { useEffect, useRef, useState } from "react";

// v11_보호자앱/g-guardian-live.html 구조를 따라 단계별로 등장
// 각 청크는 코드가 그만큼 타이핑되면 화면에 해당 요소가 나타남
type Step =
  | "bg"
  | "gradient"
  | "topbar"
  | "greet"
  | "report"
  | "widgets"
  | "tabbar";

type Chunk = { code: string; step: Step };

const chunks: Chunk[] = [
  {
    step: "bg",
    code: `<!doctype html>
<html lang="ko">
<body class="guardian">
  <main class="canvas">`,
  },
  {
    step: "gradient",
    code: `

  <div class="bg-blob"
       style="background: radial-gradient(
         circle at 50% 60%,
         #93d8ff 0%,
         #b8e6ff 25%,
         #e9f5ff 55%,
         #ffffff 100%
       );" />`,
  },
  {
    step: "topbar",
    code: `

  <header class="topbar">
    <Logo brand="하루안부" />
    <button aria-label="알림">🔔</button>
    <button aria-label="프로필">👤</button>
  </header>`,
  },
  {
    step: "greet",
    code: `

  <section class="greet">
    <h1>오늘도 수고하셨어요,
정희님 잘 있어요</h1>
    <p>저녁 일과도 잘 되고 있어요.</p>
  </section>`,
  },
  {
    step: "report",
    code: `

  <section class="daily-report">
    <header>
      <h2>일일 리포트</h2>
      <time>5월 17일 (일)</time>
    </header>
    <article class="moment-card">
      <img src="mockup.png" alt="오늘의 순간" />
      <blockquote>"오전 산책 때 햇빛이 좋아서
한참 머무르셨어요."</blockquote>
      <cite>— 김미영 간호사 · 10:24</cite>
    </article>
  </section>`,
  },
  {
    step: "widgets",
    code: `

  <section class="widgets">
    <Widget icon="pill"  label="투약"  value="33%" />
    <Widget icon="heart" label="맥박"  value="72 BPM" />
    <Widget icon="emoji" label="기분"  value="87점" />
  </section>`,
  },
  {
    step: "tabbar",
    code: `

  <nav class="tabbar">
    <Tab icon="home" active />
    <Tab icon="records" />
    <Tab icon="chat" />
    <Tab icon="reports" />
    <Tab icon="profile" />
  </nav>
</main>
</body>
</html>`,
  },
];

const fullCode = chunks.map((c) => c.code).join("");
const TOTAL = fullCode.length;

// 각 청크 끝 위치
const checkpoints = chunks.reduce<{ step: Step; at: number }[]>((acc, c) => {
  const prev = acc.length ? acc[acc.length - 1].at : 0;
  acc.push({ step: c.step, at: prev + c.code.length });
  return acc;
}, []);

function syntaxColor(escaped: string) {
  let s = escaped
    .replace(/&quot;([^&]*?)&quot;/g, "§S§&quot;$1&quot;§E§")
    .replace(/(&lt;\/?[\w][\w-]*)/g, "§T§$1§E§")
    .replace(/(\/?&gt;)/g, "§T§$1§E§")
    .replace(/\b([\w-]+)=/g, "§A§$1§E§=")
    .replace(/(\{[^}]*\})/g, "§X§$1§E§");
  s = s
    .replace(/§T§/g, '<span style="color:#ff7b9c">')
    .replace(/§A§/g, '<span style="color:#7eff8d">')
    .replace(/§S§/g, '<span style="color:#74a8ff">')
    .replace(/§X§/g, '<span style="color:#fbbf24">')
    .replace(/§E§/g, "</span>");
  return s;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function CodeMaterializeScene() {
  const ref = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let tick = false;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = range > 0 ? scrolled / range : 0;
      const t = Math.max(0, Math.min(1, (p - 0.02) / 0.92));
      setChars(Math.round(t * TOTAL));
    };
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        compute();
        tick = false;
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

  useEffect(() => {
    const pre = codeRef.current;
    if (!pre) return;
    pre.scrollTop = pre.scrollHeight;
  }, [chars]);

  const visibleCode = fullCode.slice(0, chars);
  const lines = visibleCode.split("\n");
  const renderedHtml =
    lines
      .map((l) => `<div>${syntaxColor(escapeHtml(l)) || "&nbsp;"}</div>`)
      .join("") + '<span class="caret caret-fat" aria-hidden></span>';

  // 단계별 노출 여부 — 해당 청크 끝까지 타이핑됐을 때 등장
  const reached = (step: Step) => {
    const cp = checkpoints.find((c) => c.step === step);
    return cp ? chars >= cp.at : false;
  };
  const partial = (step: Step) => {
    // 청크 진행도(0~1)
    const idx = checkpoints.findIndex((c) => c.step === step);
    if (idx === -1) return 0;
    const prev = idx === 0 ? 0 : checkpoints[idx - 1].at;
    const cur = checkpoints[idx].at;
    return Math.max(0, Math.min(1, (chars - prev) / (cur - prev)));
  };

  const reveal = (step: Step, base = 0): React.CSSProperties => ({
    opacity: reached(step) ? 1 : partial(step) > 0.5 ? partial(step) : 0,
    transform: reached(step)
      ? `translateY(${base}px)`
      : `translateY(${base + 24}px)`,
    transition:
      "opacity 540ms cubic-bezier(0.2, 1, 0.4, 1), transform 620ms cubic-bezier(0.2, 1, 0.4, 1)",
  });

  return (
    <section ref={ref} className="relative w-full" style={{ height: "780vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        {/* 1) 흰 배경 — 첫 청크 진행만큼 나타남 */}
        <div
          className="absolute inset-0 bg-white"
          style={{
            opacity: partial("bg"),
            transition: "opacity 480ms ease-out",
          }}
        />

        {/* 2) 블루 라디얼 그라데이션 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 62%, #93d8ff 0%, #b8e6ff 22%, #e9f5ff 55%, #ffffff 100%)",
            opacity: reached("gradient") ? 1 : partial("gradient"),
            transition: "opacity 720ms cubic-bezier(0.2, 1, 0.4, 1)",
          }}
        />

        {/* 본문 컨테이너 — 폰 비율 안에 UI 요소들이 차곡차곡 */}
        <div className="relative z-10 flex h-screen w-full flex-col items-center justify-start px-6 pt-[10vh] md:pt-[12vh]">
          <div className="flex w-full max-w-[460px] flex-col">
            {/* 3) 탑바 — 로고 + 알림 + 프로필 */}
            <div
              className="flex items-center justify-between"
              style={reveal("topbar")}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-7 w-7 rotate-12">
                  <svg viewBox="0 0 512 512" className="h-full w-full">
                    <g
                      transform="translate(50, 50) scale(0.163)"
                      fill="#2c7afc"
                    >
                      <path d="M2521.32 2506.66C1239.65 2657.48 1239.65 1895.6 1239.65 1279.34L2497.69 0.000170058C2518.68 494.198 2522.27 1157.92 1658.86 1262.48C2641.88 1314.25 2521.32 2101.84 2521.32 2506.66Z" />
                      <path d="M4.6772 19.3353C1286.35 -131.481 1286.35 630.399 1286.35 1246.66L28.3145 2526C7.32194 2031.8 3.73014 1368.08 867.143 1263.52C-115.881 1211.75 4.6772 424.157 4.6772 19.3353Z" />
                    </g>
                  </svg>
                </span>
                <span className="font-sans font-bold tracking-tight text-[#0a1a2e]">
                  하루안부
                </span>
              </div>
              <div className="flex gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-[#2c7afc] shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-[#2c7afc] shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* 4) 인사말 */}
            <div className="mt-10" style={reveal("greet")}>
              <h1 className="font-sans text-[26px] font-bold leading-[1.25] tracking-tight text-[#0a1a2e] md:text-[30px]">
                오늘도 수고하셨어요,
                <br />
                정희님 잘 있어요
              </h1>
              <p className="mt-2 text-sm text-[#4a5a72] md:text-base">
                저녁 일과도 잘 되고 있어요.
              </p>
            </div>

            {/* 5) 일일 리포트 카드 */}
            <div className="mt-8" style={reveal("report")}>
              <div className="rounded-3xl bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0a1a2e]">
                    일일 리포트
                  </h2>
                  <time className="text-xs text-[#94a3b8]">5월 17일 (일)</time>
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="h-[140px] w-full bg-cover bg-center md:h-[160px]"
                    style={{ backgroundImage: "url(/v11-preview/mockup.png)" }}
                  />
                </div>
                <blockquote className="mt-3 text-sm text-[#0a1a2e]">
                  "오전 산책 때 햇빛이 좋아서 한참 머무르셨어요."
                </blockquote>
                <cite className="mt-2 block text-xs not-italic text-[#94a3b8]">
                  — 김미영 간호사 · 10:24
                </cite>
              </div>
            </div>

            {/* 6) 위젯 3개 */}
            <div className="mt-3 grid grid-cols-3 gap-2" style={reveal("widgets")}>
              <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                <div className="flex items-center gap-1 text-[10px] text-[#10b981]">
                  💊 <span className="font-bold text-[#0a1a2e]">투약</span>
                </div>
                <div className="mt-1 text-[22px] font-bold leading-none text-[#0a1a2e]">
                  33<span className="text-xs text-black/40">%</span>
                </div>
                <div className="text-[10px] text-[#94a3b8]">1/3 복용</div>
              </div>
              <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                <div className="flex items-center gap-1 text-[10px] text-[#ef4444]">
                  ❤ <span className="font-bold text-[#0a1a2e]">맥박</span>
                </div>
                <div className="mt-1 text-[22px] font-bold leading-none text-[#0a1a2e]">
                  72<span className="text-xs text-black/40">BPM</span>
                </div>
                <div className="text-[10px] text-[#94a3b8]">정상 범위</div>
              </div>
              <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                <div className="flex items-center gap-1 text-[10px] text-[#2c7afc]">
                  😊 <span className="font-bold text-[#0a1a2e]">기분</span>
                </div>
                <div className="mt-1 text-[22px] font-bold leading-none text-[#0a1a2e]">
                  87<span className="text-xs text-black/40">점</span>
                </div>
                <div className="text-[10px] text-[#94a3b8]">최근 28일</div>
              </div>
            </div>
          </div>

          {/* 7) 탭바 — 화면 하단 고정 */}
          <div
            className="absolute inset-x-0 bottom-6 z-10 flex justify-center px-6"
            style={reveal("tabbar")}
          >
            <div className="flex items-center gap-6 rounded-full border border-white/50 bg-white/65 px-5 py-2.5 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
              {[
                { icon: "🏠", active: true },
                { icon: "📄" },
                { icon: "💬" },
                { icon: "📋" },
                { icon: "👤" },
              ].map((t, i) => (
                <span
                  key={i}
                  className={`grid h-9 w-9 place-items-center rounded-full text-lg ${
                    t.active ? "bg-[#2c7afc] text-white" : "text-[#64748b]"
                  }`}
                >
                  {t.icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 타이틀 — 항상 상단 */}
        <div className="absolute inset-x-0 top-6 z-30 px-6 text-center md:top-10">
          <h2
            className="font-sans font-semibold text-white mix-blend-difference"
            style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.9rem)" }}
          >
            "이 화면 그대로 코드로 짜줘."
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mix-blend-difference md:text-xs">
            v11_보호자앱 / g-guardian-live.html
          </p>
        </div>

        {/* 코드 패널 — 좌측 하단 플로팅 */}
        <div className="pointer-events-none absolute bottom-6 left-4 z-20 md:bottom-10 md:left-8">
          <div className="w-[min(40vw,460px)] overflow-hidden rounded-2xl border border-white/15 bg-[#0d1117]/95 font-mono shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                g-guardian-live.html
              </span>
            </div>
            <pre
              ref={codeRef}
              className="h-[36vh] overflow-hidden whitespace-pre px-4 py-3 text-[11px] leading-[1.55] text-white/85 md:text-[12px]"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
