"use client";

import { useEffect, useRef, useState } from "react";

// v11_보호자앱/g-guardian-live.html (v13 홈) 에서 따온 실제 코드 청크
// 각 청크가 다 타이핑되면 우측 폰의 해당 UI 요소가 들어옴
const chunks: { code: string; element: number }[] = [
  {
    code: `<header className="hd">
  <Logo />
  <button aria-label="알림" />
  <button aria-label="프로필" />
</header>`,
    element: 1, // header
  },
  {
    code: `
<section className="greet">
  <h1>편안한 밤 되세요,
정희님도 잘 쉬고 있어요</h1>
  <p>오늘 일과 모두 잘 마무리됐어요.</p>
</section>`,
    element: 2, // greeting
  },
  {
    code: `
<section className="report">
  <div className="head">
    <h2>일일 리포트</h2>
    <span>{date}</span>
  </div>
  <Card icon="moon">
    식사 3끼 모두 잘 드셨고
    오전 산책 25분도 완료했어요.
  </Card>
</section>`,
    element: 3, // report card
  },
  {
    code: `
<Widget id="pill">
  <Header icon="pill">
    투약
    <Badge>확인 필요</Badge>
  </Header>
  <Value>33<sub>%</sub></Value>
  <Meta>1/3 복용 완료</Meta>
  <PillWave color="#6EE7B7" />
</Widget>`,
    element: 4, // pill widget
  },
  {
    code: `
<Widget id="mood">
  <Header icon="emoji">기분</Header>
  <Value>87<sub>점</sub></Value>
  <Meta>최근 28일</Meta>
  <DotGrid rows={4} cols={7} />
</Widget>`,
    element: 5, // mood widget
  },
  {
    code: `
<nav className="tabbar">
  <Tab icon="haru" active />
  <Tab icon="records" />
  <Tab icon="chat" />
  <Tab icon="reports" />
  <Tab icon="profile" />
</nav>`,
    element: 6, // tabbar
  },
];

const fullCode = chunks.map((c) => c.code).join("");
const TOTAL = fullCode.length;

// 청크별 누적 글자 위치 — 이 위치까지 타이핑되면 element 등장
const checkpoints = chunks.reduce<{ at: number; element: number }[]>(
  (acc, c) => {
    const prev = acc.length ? acc[acc.length - 1].at : 0;
    acc.push({ at: prev + c.code.length, element: c.element });
    return acc;
  },
  []
);

function syntaxColor(line: string) {
  // 매우 단순한 토큰 컬러링 (JSX 풍)
  return line
    .replace(
      /(&lt;\/?[\w]+|<\/?[\w]+)/g,
      '<span style="color:#ff7b9c">$1</span>'
    )
    .replace(
      /([\w]+)=/g,
      '<span style="color:#7eff8d">$1</span>='
    )
    .replace(
      /(\{[^}]*\})/g,
      '<span style="color:#fbbf24">$1</span>'
    )
    .replace(
      /("[^"]*")/g,
      '<span style="color:#74a8ff">$1</span>'
    );
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function CodeMaterializeScene() {
  const ref = useRef<HTMLElement>(null);
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
      // 0.08~0.92 사이에 타이핑 진행
      const t = Math.max(0, Math.min(1, (p - 0.08) / 0.84));
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

  const visibleElement = checkpoints.reduce(
    (max, c) => (chars >= c.at ? Math.max(max, c.element) : max),
    0
  );

  const visibleCode = fullCode.slice(0, chars);
  const lines = visibleCode.split("\n");
  const renderedHtml =
    lines
      .map((l) => `<div>${syntaxColor(escape(l)) || "&nbsp;"}</div>`)
      .join("") + '<span class="caret caret-fat" aria-hidden></span>';

  return (
    <section ref={ref} className="relative w-full" style={{ height: "640vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        <div className="mx-auto mt-10 px-6 text-center md:mt-12">
          <h2
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}
          >
            "이 화면 그대로 코드로 짜줘."
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-6 md:px-10 md:py-10">
          <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
            {/* 코드 패널 */}
            <div className="relative h-[68vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] font-mono">
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  GuardianHome.tsx
                </span>
              </div>
              <pre
                className="h-[calc(68vh-48px)] overflow-hidden whitespace-pre p-5 text-[12px] leading-[1.6] text-white/85 md:text-[13px]"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>

            {/* 폰 프리뷰 */}
            <div className="flex h-[68vh] items-center justify-center">
              <PhonePreview shown={visibleElement} />
            </div>
          </div>
        </div>

        <p
          className="absolute inset-x-0 bottom-6 z-10 px-6 text-center font-sans text-sm text-white/45 md:bottom-8"
          style={{
            opacity: visibleElement >= 6 ? 1 : 0,
            transition: "opacity 600ms ease-out",
          }}
        >
          → 코드가 곧 동작하는 v13 보호자앱 홈이 됨.
        </p>
      </div>
    </section>
  );
}

function PhonePreview({ shown }: { shown: number }) {
  // 폰 크기 — 사이즈 작게 (옆에 코드 패널과 같이 보이게)
  const phoneStyle: React.CSSProperties = {
    height: "min(64vh, 700px)",
    width: "min(calc(64vh * 9 / 19.5), 320px)",
  };

  const reveal = (i: number): React.CSSProperties => ({
    opacity: shown >= i ? 1 : 0,
    transform: shown >= i ? "translateY(0)" : "translateY(12px)",
    transition:
      "opacity 460ms cubic-bezier(0.2, 1, 0.4, 1), transform 520ms cubic-bezier(0.2, 1, 0.4, 1)",
  });

  return (
    <div className="relative" style={phoneStyle}>
      <div
        className="absolute inset-0 rounded-[44px]"
        style={{
          background:
            "linear-gradient(135deg, #e8ecf0 0%, #c2c7cc 28%, #8d9298 62%, #b9bec3 88%, #d6dade 100%)",
          boxShadow:
            "0 24px 72px -18px rgba(44, 122, 252, 0.25), 0 56px 120px -14px rgba(0,0,0,0.75)",
        }}
      />
      <div className="absolute inset-[4px] rounded-[40px] bg-black" />
      <div
        className="absolute inset-[10px] flex flex-col overflow-hidden rounded-[34px]"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #e9f5ff 35%, #b8e6ff 70%, #93d8ff 100%)",
        }}
      >
        {/* 1. Header */}
        <div className="flex items-center justify-between px-4 pt-4" style={reveal(1)}>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rotate-12 rounded-sm bg-[#2c7afc]" />
            <span className="text-[11px] font-semibold tracking-tight text-[#1a2b4a]">
              하루안부
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/80 text-[8px]">
              🔔
            </span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/80 text-[8px]">
              👤
            </span>
          </div>
        </div>

        {/* 2. Greeting */}
        <div className="px-4 pt-3" style={reveal(2)}>
          <p
            className="font-semibold leading-[1.2] tracking-tight text-[#0a1a2e]"
            style={{ fontSize: "13px" }}
          >
            편안한 밤 되세요,
            <br />
            정희님도 잘 쉬고 있어요
          </p>
          <p className="mt-1 text-[9px] text-[#4a5a72]">
            오늘 일과 모두 잘 마무리됐어요.
          </p>
        </div>

        {/* 3. Report card */}
        <div className="mx-3 mt-3 rounded-2xl bg-white/85 p-3 shadow-sm" style={reveal(3)}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#1a2b4a]">일일 리포트</span>
            <span className="text-[8px] text-[#94a3b8]">4월 18일 (토)</span>
          </div>
          <div className="mt-2 rounded-xl bg-white p-2.5">
            <div className="flex gap-2">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#2c7afc] text-[7px] text-white">
                ✦
              </span>
              <p className="text-[8.5px] leading-snug text-[#1a2b4a]">
                식사 3끼 모두 잘 드셨고{" "}
                <span className="text-[#2c7afc]">오전 산책 25분</span>도 완료했어요.
              </p>
            </div>
          </div>
        </div>

        {/* 4 + 5. Widgets */}
        <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/85 p-2.5 shadow-sm" style={reveal(4)}>
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-[#10b981]">💊</span>
              <span className="text-[9px] font-bold text-[#1a2b4a]">투약</span>
              <span className="ml-auto rounded-full bg-orange-100 px-1.5 py-0.5 text-[6.5px] font-semibold text-orange-700">
                확인 필요
              </span>
            </div>
            <div className="mt-1 text-[20px] font-bold leading-none tracking-tight text-[#0a1a2e]">
              33<span className="text-[10px] font-semibold text-black/30">%</span>
            </div>
            <div className="mt-0.5 text-[7px] text-[#94a3b8]">1/3 복용 완료</div>
            <div className="mt-2 h-6 rounded-md bg-gradient-to-t from-[#6EE7B7]/55 to-[#6EE7B7]/15" />
          </div>
          <div className="rounded-2xl bg-white/85 p-2.5 shadow-sm" style={reveal(5)}>
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-[#2c7afc]">😊</span>
              <span className="text-[9px] font-bold text-[#1a2b4a]">기분</span>
            </div>
            <div className="mt-1 text-[20px] font-bold leading-none tracking-tight text-[#0a1a2e]">
              87<span className="text-[10px] font-semibold text-black/30">점</span>
            </div>
            <div className="mt-0.5 text-[7px] text-[#94a3b8]">최근 28일</div>
            <div className="mt-2 grid grid-cols-7 gap-0.5">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: `rgba(44, 122, 252, ${0.25 + ((i % 5) / 5) * 0.7})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* 6. Tabbar */}
        <div
          className="mx-3 mb-3 flex items-center justify-around rounded-full border border-white/40 bg-white/80 px-2 py-2 backdrop-blur"
          style={reveal(6)}
        >
          {["✦", "📄", "💬", "📋", "👤"].map((icon, i) => (
            <span
              key={i}
              className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                i === 0 ? "bg-[#2c7afc] text-white" : "text-[#94a3b8]"
              }`}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
