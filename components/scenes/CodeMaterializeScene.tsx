"use client";

import { useEffect, useRef, useState } from "react";

// v11_보호자앱/g-guardian-live.html 의 실제 구조에서 따온 코드 청크
// 위에서부터 한 글자씩 타이핑되며, 청크가 끝나면 우측 라이브 프리뷰가 점점 또렷해짐
const chunks: string[] = [
  `<!doctype html>
<html lang="ko">
<head>
  <title>하루안부 — 보호자</title>
  <link rel="stylesheet" href="common.css" />
</head>`,
  `

<body class="guardian">
  <header class="topbar">
    <Logo />
    <button aria-label="알림">🔔</button>
    <button aria-label="프로필">👤</button>
  </header>`,
  `

  <section class="greet">
    <h1>오늘도 수고하셨어요,
정희님 잘 있어요</h1>
    <p>저녁 일과도 잘 되고 있어요.</p>
  </section>`,
  `

  <section class="daily-report">
    <h2>일일 리포트 <span>{date}</span></h2>
    <article class="moment-card">
      <img src="mockup.png" alt="오늘의 순간" />
      <blockquote>"오전 산책 때 햇빛이 좋아서
한참 머무르셨어요."</blockquote>
      <cite>— 김미영 간호사 · 10:24</cite>
    </article>
  </section>`,
  `

  <section class="widgets">
    <Widget id="pill" icon="pill" tint="#6EE7B7">
      투약 33% · 1/3 복용 완료
      <PillWave />
    </Widget>
    <Widget id="vital" icon="heart" tint="#2C7AFC">
      맥박 72 BPM
      <VitalLine />
    </Widget>
    <Widget id="mood" icon="emoji">
      기분 87점 · 최근 28일
    </Widget>
    <FoodCard image="image (16).png" />
  </section>`,
  `

  <nav class="tabbar">
    <Tab icon="home" active />
    <Tab icon="records" />
    <Tab icon="chat" />
    <Tab icon="reports" />
    <Tab icon="profile" />
  </nav>
  <FabAI />
</body>
</html>`,
];

const fullCode = chunks.join("");
const TOTAL = fullCode.length;

function syntaxColor(line: string) {
  return line
    .replace(/(&lt;\/?[\w!][\w-]*)/g, '<span style="color:#ff7b9c">$1</span>')
    .replace(/([\w-]+)=/g, '<span style="color:#7eff8d">$1</span>=')
    .replace(/(\{[^}]*\})/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/("[^"]*")/g, '<span style="color:#74a8ff">$1</span>');
}

function escape(s: string) {
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
      const t = Math.max(0, Math.min(1, (p - 0.06) / 0.86));
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

  // 코드 패널 자동 스크롤 — 항상 최신 줄이 보이게
  useEffect(() => {
    const pre = codeRef.current;
    if (!pre) return;
    pre.scrollTop = pre.scrollHeight;
  }, [chars]);

  const visibleCode = fullCode.slice(0, chars);
  const lines = visibleCode.split("\n");
  const renderedHtml =
    lines
      .map((l) => `<div>${syntaxColor(escape(l)) || "&nbsp;"}</div>`)
      .join("") + '<span class="caret caret-fat" aria-hidden></span>';

  // 진행도 0~0.4: 코드만, 0.4~1: 프리뷰가 점점 또렷
  const codeProgress = chars / TOTAL;
  const previewBlur = Math.max(0, 16 - codeProgress * 20);
  const previewOpacity = Math.max(0.3, Math.min(1, codeProgress * 1.3));

  return (
    <section ref={ref} className="relative w-full" style={{ height: "780vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        <div className="absolute inset-x-0 top-6 z-30 px-6 text-center md:top-10">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.9rem)" }}
          >
            "이 화면 그대로 코드로 짜줘."
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 md:text-xs">
            v11_보호자앱 / g-guardian-live.html
          </p>
        </div>

        {/* 라이브 프리뷰 — 화면 가득 (iframe) */}
        <div
          className="absolute inset-0 flex items-center justify-center pt-24 md:pt-28"
          style={{
            opacity: previewOpacity,
            filter: `blur(${previewBlur}px)`,
            transition: "opacity 240ms linear, filter 240ms linear",
          }}
        >
          <iframe
            src="/v11-preview/index.html"
            title="v11 보호자앱 라이브 프리뷰"
            className="h-[78vh] w-[min(420px,90vw)] rounded-[40px] border border-white/10 bg-white shadow-[0_30px_80px_-20px_rgba(44,122,252,0.45)]"
            style={{ pointerEvents: "none" }}
          />
        </div>

        {/* 코드 패널 — 좌측 하단 플로팅 */}
        <div className="pointer-events-none absolute bottom-6 left-4 z-20 md:bottom-10 md:left-8">
          <div className="w-[min(46vw,540px)] overflow-hidden rounded-2xl border border-white/15 bg-[#0d1117]/95 font-mono shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur">
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
              className="h-[38vh] overflow-hidden whitespace-pre px-4 py-3 text-[11px] leading-[1.55] text-white/85 md:text-[12px]"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
