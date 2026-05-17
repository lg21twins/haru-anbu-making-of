"use client";

import { useEffect, useRef, useState } from "react";

// v11_보호자앱/g-guardian-live.html 첫 화면을 정확히 재현
// 스크롤 단계별 등장: bg → orb → topnav → greet → report → tabbar
type Step = "bg" | "orb" | "topnav" | "greet" | "report" | "tabbar";

type Chunk = { code: string; step: Step };

const chunks: Chunk[] = [
  {
    step: "bg",
    code: `<!DOCTYPE html>
<html lang="ko">
<head>
  <title>하루안부 — 보호자 홈</title>
  <style>
    html, body { background:#f8fbff; }
  </style>
</head>
<body>`,
  },
  {
    step: "orb",
    code: `

  <!-- AI 오브 (영구 배경) -->
  <div class="ai-orb-bg">
    <div class="ai-orb"
         style="background: radial-gradient(
           circle at 50% 32%,
           #1BE7EA 0%,
           rgba(70,195,230,.95) 38%,
           #46A8FF 72%,
           rgba(70,168,255,.3) 88%,
           transparent 100%
         );
         filter: blur(24px);" />
  </div>`,
  },
  {
    step: "topnav",
    code: `

  <div class="chat-fixed">
    <nav class="top-nav">
      <button class="logo" aria-label="대화 기록">
        <svg viewBox="0 0 512 512">
          <path d="M2521.32 2506.66C1239.65..."
                fill="#2C7AFC"/>
        </svg>
      </button>
      <div class="top-nav-right">
        <a class="nav-btn" aria-label="알림">
          <iconify-icon icon="fluent:alert-24-filled"/>
          <span class="notif-dot"/>
        </a>
        <a class="nav-btn" aria-label="프로필">
          <iconify-icon icon="fluent:person-24-filled"/>
        </a>
      </div>
    </nav>`,
  },
  {
    step: "greet",
    code: `

    <div class="greeting-zone">
      <h1 class="greeting-main">
        오늘도 수고하셨어요,<br>
        정희님 잘 있어요
      </h1>
      <p class="greeting-sub">
        저녁 일과도 잘 되고 있어요.
      </p>
    </div>
  </div>`,
  },
  {
    step: "report",
    code: `

  <div class="app">
    <div class="report-sheet">
      <div class="sheet-drag">
        <div class="sheet-drag-pill"/>
      </div>
      <div class="section-header">
        <div class="section-title">일일 리포트</div>
        <div class="section-date">5월 17일 (일)</div>
      </div>
      <a class="moment-card">
        <div class="moment-photo"/>
        <div class="moment-body">
          <div class="moment-quote">
            "오전 산책 때 햇빛이 좋아서
한참 머무르셨어요."
          </div>
          <div class="moment-meta">
            김미영 간호사 · 10:24
          </div>
        </div>
      </a>
    </div>
  </div>`,
  },
  {
    step: "tabbar",
    code: `

  <div class="bottom-bar">
    <nav class="tabbar">
      <a class="tab active"><home/></a>
      <a class="tab"><book/></a>
      <a class="tab"><chat/></a>
      <a class="tab"><folder/></a>
      <a class="tab"><person/></a>
    </nav>
    <button class="ai-fab">
      <svg viewBox="0 0 2526 2526">
        <path fill="#2C7AFC" d="..."/>
      </svg>
    </button>
  </div>

</body>
</html>`,
  },
];

const fullCode = chunks.map((c) => c.code).join("");
const TOTAL = fullCode.length;

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

// 하루안부 X 로고 (실제 v11 코드와 동일)
function HaruLogo({ size = 30, fill = "#2C7AFC" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <g transform="translate(50,50) scale(0.163)">
        <path
          d="M2521.32 2506.66C1239.65 2657.48 1239.65 1895.6 1239.65 1279.34L2497.69 0C2518.68 494.198 2522.27 1157.92 1658.86 1262.48C2641.88 1314.25 2521.32 2101.84 2521.32 2506.66Z"
          fill={fill}
        />
        <path
          d="M4.677 19.335C1286.35 -131.481 1286.35 630.399 1286.35 1246.66L28.315 2526C7.322 2031.8 3.73 1368.08 867.143 1263.52C-115.881 1211.75 4.677 424.157 4.677 19.335Z"
          fill={fill}
        />
      </g>
    </svg>
  );
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

  const reached = (step: Step) => {
    const cp = checkpoints.find((c) => c.step === step);
    return cp ? chars >= cp.at : false;
  };
  const partial = (step: Step) => {
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
        {/* 1) 흰 캔버스 (#f8fbff) — 첫 청크 진행만큼 페이드 인 */}
        <div
          className="absolute inset-0"
          style={{
            background: "#f8fbff",
            opacity: partial("bg"),
            transition: "opacity 480ms ease-out",
          }}
        />

        {/* 2) AI orb — 큰 원형 그라데이션 (560x560), v11 정확 재현 */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1]"
          style={{
            width: "min(560px, 110vw)",
            height: "min(560px, 110vw)",
            transform: "translate(-50%, -50%)",
            opacity: reached("orb") ? 1 : partial("orb"),
            transition: "opacity 720ms cubic-bezier(0.2, 1, 0.4, 1)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 32%, #1BE7EA 0%, rgba(70,195,230,0.95) 38%, #46A8FF 72%, rgba(70,168,255,0.3) 88%, transparent 100%)",
              filter: "blur(24px)",
              animation: reached("orb") ? "orb-breath 7s ease-in-out infinite" : undefined,
            }}
          />
        </div>

        <style>{`
          @keyframes orb-breath {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.12) translateY(-12px); }
          }
        `}</style>

        {/* 본문 컨테이너 — max-width 430px 모바일 앱 영역 */}
        <div className="relative z-10 flex h-screen w-full justify-center px-4">
          <div className="relative flex h-full w-full max-w-[430px] flex-col pt-[max(env(safe-area-inset-top),24px)] pb-[100px]">
            {/* 3) top-nav — 좌측 X 로고 버튼 + 우측 알림/프로필 */}
            <div className="px-6" style={reveal("topnav")}>
              <nav className="flex items-center justify-between">
                <button
                  className="-m-1 flex items-center gap-2 bg-transparent p-1"
                  aria-label="대화 기록"
                >
                  <HaruLogo size={30} fill="#2C7AFC" />
                </button>
                <div className="flex items-center gap-2">
                  <a
                    aria-label="알림"
                    className="relative grid h-9 w-9 place-items-center rounded-full bg-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.6)] ring-[0.5px] ring-white/55"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#2C7AFC]" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FF3B30] ring-[1.5px] ring-white/70" />
                  </a>
                  <a
                    aria-label="프로필"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.6)] ring-[0.5px] ring-white/55"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#2C7AFC]" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </a>
                </div>
              </nav>
            </div>

            {/* 4) greeting-zone — "오늘도 수고하셨어요, 정희님 잘 있어요" */}
            <div className="px-6 pt-[46px]" style={reveal("greet")}>
              <h1
                className="font-bold leading-[1.18] tracking-[-0.85px] text-[#2a1810]"
                style={{
                  fontSize: "28px",
                  textShadow: "0 1px 0 rgba(255,255,255,.2)",
                }}
              >
                오늘도 수고하셨어요,
                <br />
                정희님 잘 있어요
              </h1>
              <p
                className="mt-2 font-medium leading-[1.45] text-[rgba(42,24,16,0.62)]"
                style={{ fontSize: "15px" }}
              >
                저녁 일과도 잘 되고 있어요.
              </p>
            </div>

            {/* 5) 일일 리포트 sheet — 하단에 카드 형태로 슬라이드 업 */}
            <div
              className="absolute bottom-[100px] left-0 right-0 mx-auto w-full"
              style={reveal("report")}
            >
              <div className="mx-3 rounded-t-[28px] bg-white/96 px-5 pt-3 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur">
                {/* drag pill */}
                <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-black/15" />
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[15px] font-bold tracking-[-0.4px] text-[#1C1C1E]">
                    일일 리포트
                  </div>
                  <div className="text-[11px] font-medium text-black/40">
                    5월 17일 (일)
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="h-[160px] w-full bg-cover bg-center"
                    style={{ backgroundImage: "url(/v11-preview/mockup.png)" }}
                  />
                </div>
                <div className="mt-3 text-[13.5px] leading-[1.5] font-medium text-[#1C1C1E]">
                  "오전 산책 때 햇빛이 좋아서 한참 머무르셨어요.
                  <br />
                  기분이 정말 좋아 보이셨어요."
                </div>
                <div className="mt-2 text-[11.5px] font-medium text-black/45">
                  ─ 김미영 간호사 · 10:24
                </div>
              </div>
            </div>

            {/* 6) bottom-bar — 둥근 탭바 + AI FAB */}
            <div
              className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
              style={reveal("tabbar")}
            >
              <nav className="flex items-center gap-1 rounded-full border border-white/55 bg-white/65 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur">
                {/* 홈 (active) */}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2C7AFC] text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 3l9 8h-2v9h-5v-6h-4v6H5v-9H3l9-8z" />
                  </svg>
                </span>
                {/* 가이드(책) */}
                <span className="grid h-10 w-10 place-items-center text-[#64748b]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M6 2h11a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h11V4H6z" />
                  </svg>
                </span>
                {/* 소통(말풍선) */}
                <span className="grid h-10 w-10 place-items-center text-[#64748b]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 2C6.48 2 2 5.81 2 10.5c0 2.65 1.56 5.02 4 6.56V22l4.34-2.41c.54.07 1.1.11 1.66.11 5.52 0 10-3.81 10-8.5S17.52 2 12 2z" />
                  </svg>
                </span>
                {/* 기록(폴더) */}
                <span className="grid h-10 w-10 place-items-center text-[#64748b]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
                  </svg>
                </span>
                {/* 마이(사람) */}
                <span className="grid h-10 w-10 place-items-center text-[#64748b]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
              </nav>
              {/* AI FAB — 둥근 흰 버튼 + X 로고 */}
              <button
                aria-label="AI와 대화하기"
                className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              >
                <HaruLogo size={22} fill="#2C7AFC" />
              </button>
            </div>
          </div>
        </div>

        {/* 타이틀 — 상단 (mix-blend-difference로 흰/검 자동 대응) */}
        <div className="absolute inset-x-0 top-6 z-30 px-6 text-center md:top-10">
          <h2
            className="font-sans font-semibold text-white mix-blend-difference"
            style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.9rem)" }}
          >
            "이 화면 그대로 코드로 짜줘."
          </h2>
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
