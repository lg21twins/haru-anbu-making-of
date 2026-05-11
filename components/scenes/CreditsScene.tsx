"use client";

import { useEffect, useRef, useState } from "react";

type Line =
  | { kind: "title"; text: string }
  | { kind: "section"; text: string }
  | { kind: "header"; text: string }
  | { kind: "name"; text: string }
  | { kind: "role"; role: string; name: string }
  | { kind: "prompt"; n: string; text: string }
  | { kind: "sub"; text: string }
  | { kind: "thanks"; text: string }
  | { kind: "spacer"; h: number };

const credits: Line[] = [
  { kind: "title", text: "MAKING OF" },
  { kind: "title", text: "하루안부." },
  { kind: "spacer", h: 14 },

  { kind: "section", text: "DIRECTED BY" },
  { kind: "name", text: "김지욱" },
  { kind: "spacer", h: 9 },

  { kind: "section", text: "WRITTEN BY" },
  { kind: "name", text: "김지욱" },
  { kind: "name", text: "하루안부 팀" },
  { kind: "name", text: "Claude" },
  { kind: "spacer", h: 9 },

  { kind: "section", text: "CAST" },
  { kind: "role", role: "보호자", name: "김미영, 52" },
  { kind: "role", role: "간호사", name: "박지현, 34" },
  { kind: "role", role: "환자", name: "김순자, 78" },
  { kind: "spacer", h: 16 },

  { kind: "header", text: "AI ENSEMBLE" },
  { kind: "spacer", h: 6 },
  { kind: "role", role: "Claude (Opus 4)", name: "기획 · 디자인 · 코드" },
  { kind: "role", role: "Higgsfield · Cinema Studio", name: "AI 영상" },
  { kind: "role", role: "Midjourney v6", name: "AI 이미지 · 페르소나" },
  { kind: "role", role: "Remotion", name: "프로그래매틱 영상" },
  { kind: "role", role: "Figma", name: "초기 와이어프레임" },
  { kind: "role", role: "Pretendard Variable", name: "타이포그래피" },
  { kind: "role", role: "Iconify · Fluent", name: "아이콘" },
  { kind: "role", role: "Next.js 16 · GSAP · R3F", name: "이 사이트" },
  { kind: "spacer", h: 16 },

  { kind: "header", text: "PROMPTS" },
  { kind: "spacer", h: 6 },

  { kind: "sub", text: "── 제 1 막 · 기획" },
  { kind: "spacer", h: 4 },
  { kind: "prompt", n: "01", text: "시장 조사 및 경쟁사 분석" },
  { kind: "prompt", n: "02", text: "시스템 아키텍처 + 실행 계획서" },
  { kind: "prompt", n: "03", text: "신규 기능 3개 → AI 가이드 5모드로 통합" },
  { kind: "prompt", n: "04", text: "수업 타임라인 반영" },
  { kind: "prompt", n: "05", text: "전체 파일 일괄 업데이트" },
  { kind: "prompt", n: "06", text: "주제 발표 자료 16장 구성안" },
  { kind: "prompt", n: "07", text: "서비스 브랜딩 — 10개 → 하루안부 확정" },
  { kind: "prompt", n: "08", text: "다국어 서체 — Pretendard Variable" },
  { kind: "prompt", n: "09", text: "팀 회의 결과 + 비주얼 벤치마킹 6개" },
  { kind: "prompt", n: "10", text: "의료인 인터뷰 질문지 — 21문항" },
  { kind: "prompt", n: "11", text: "프로젝트 폴더 6개 구조화" },
  { kind: "prompt", n: "12", text: "UX 교과서 25챕터 → 프로젝트 대입" },
  { kind: "prompt", n: "13", text: "디자인 레퍼런스 — Caring Village, Medisafe" },
  { kind: "prompt", n: "14", text: "컬러 팔레트 — 역할 분기" },
  { kind: "prompt", n: "15", text: "키비주얼 3안 + 디자인 키워드 5개" },
  { kind: "prompt", n: "16", text: "퍼소나·JTBD·포지셔닝맵·린캔버스 5종" },
  { kind: "prompt", n: "17", text: "현장 인터뷰 — AI 자동 인수인계 발견" },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "── 제 2 막 · 디자인" },
  { kind: "spacer", h: 4 },
  { kind: "prompt", n: "18", text: "13기능 확정 + Apple Health 매핑" },
  { kind: "prompt", n: "19", text: "v6 전체 목업 26페이지" },
  { kind: "prompt", n: "20", text: "AI스럽지 않게 — 반복 디테일 개선" },
  { kind: "prompt", n: "21", text: "iOS 프레임 시뮬레이션" },
  { kind: "prompt", n: "22", text: "스크린샷 자동화 — 26장 PNG" },
  { kind: "prompt", n: "23", text: "컬러 시스템 v4 — Teal·Emerald·Amber" },
  { kind: "prompt", n: "24", text: "로고 SVG 적용" },
  { kind: "prompt", n: "25", text: "UX/UI 스킬 기반 개선 — 터치타겟 44px" },
  { kind: "prompt", n: "26", text: "파일 정리 + 3에이전트 코드 리뷰" },
  { kind: "prompt", n: "27", text: "컬러 시스템 최적성 검증" },
  { kind: "prompt", n: "28", text: "GitHub 푸시 — 594 files" },
  { kind: "prompt", n: "29", text: "v7 Liquid Glass 홈" },
  { kind: "prompt", n: "30", text: "v7 KPI 3정거장 원칙" },
  { kind: "prompt", n: "31", text: "홈 인디케이터 safe area" },
  { kind: "prompt", n: "32", text: "온보딩 7페이지 + Apple Fitness 톤" },
  { kind: "prompt", n: "33", text: "온보딩 — 유리같이, 친화적이게" },
  { kind: "prompt", n: "34", text: "v7 스크롤스냅 2섹션" },
  { kind: "prompt", n: "35", text: "v7 케어 대시보드 상세 리포트" },
  { kind: "prompt", n: "36", text: "v7 퀵칩 Liquid Glass 적용" },
  { kind: "prompt", n: "37", text: "온보딩 배경색 role 연동" },
  { kind: "prompt", n: "38", text: "벤토 그리드 — MyFitnessPal · Cash App" },
  { kind: "prompt", n: "39", text: "v7 탭바 높이 채팅 동기화" },
  { kind: "prompt", n: "40", text: "보호자앱 5탭 IA 재작성" },
  { kind: "prompt", n: "41", text: "홈 스와이프 + 채팅 다자간 구조" },
  { kind: "prompt", n: "42", text: "v6 전체 탭바 5탭 통일" },
  { kind: "prompt", n: "43", text: "v6 홈화면 라디알 그라디언트 통일" },
  { kind: "prompt", n: "44", text: "Safe Area — 다이나믹 아일랜드 대응" },
  { kind: "prompt", n: "45", text: "채팅 입력바·탭바 통합" },
  { kind: "prompt", n: "46", text: "Liquid Glass 통일 4페이지" },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "── 제 3 막 · 정밀화" },
  { kind: "spacer", h: 4 },
  { kind: "prompt", n: "47", text: "v8 글라스 opacity 통일 — 뷰포트 독립" },
  { kind: "prompt", n: "48", text: "탭바 common.css 단일 소스" },
  { kind: "prompt", n: "49", text: "결제 납부 이력 더보기 토글" },
  { kind: "prompt", n: "50", text: "결제 차트 CSS 구조 수정" },
  { kind: "prompt", n: "51", text: "g08 결제 콘텐츠 5종 확장" },
  { kind: "prompt", n: "52", text: "iPhone 목업 갤러리 14개" },
  { kind: "prompt", n: "53", text: "iPhone 스크롤 재캡처 38장" },
  { kind: "prompt", n: "54", text: "v6 → v8 이식 + 글라스 정밀화" },
  { kind: "prompt", n: "55", text: "iOS 26 HIG 정렬 + 디자인 토큰" },
  { kind: "prompt", n: "56", text: "채팅 간호사 중복 제거" },
  { kind: "prompt", n: "57", text: "결제 브랜드 통일 + 섹션 간격" },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "── 제 4 막 · 메이킹 오브 (이 사이트)" },
  { kind: "spacer", h: 4 },
  {
    kind: "prompt",
    n: "M-1",
    text: "넌 이제부터 \"하루안부\"를 담당할 기획자이자 디자이너이자 영상 제작자야.",
  },
  { kind: "prompt", n: "M-2", text: "누구를 위해 만들지부터 정해." },
  { kind: "prompt", n: "M-3", text: "그들이 진짜 원하는 게 뭔지 찾아내." },
  { kind: "prompt", n: "M-4", text: "시장에서 우리만 할 수 있는 게 뭔지도." },
  { kind: "prompt", n: "M-5", text: "우리 기획서 가지고 로고 만들어봐." },
  { kind: "prompt", n: "M-6", text: "이건 로고가 아니라 다이어그램이잖아. 다시." },
  { kind: "prompt", n: "M-7", text: "캐릭터 같아. 의료 신뢰감이 없어. 다시." },
  { kind: "prompt", n: "M-8", text: "색이 너무 많아 무거워. 단순하게 다시." },
  { kind: "prompt", n: "M-9", text: "기능 그대로네. 시그니처 한 곡선으로 가자." },
  { kind: "prompt", n: "M-10", text: "디자인 시작." },
  { kind: "prompt", n: "M-11", text: "다시." },
  { kind: "prompt", n: "M-12", text: "다시." },
  { kind: "prompt", n: "M-13", text: "다시." },
  { kind: "prompt", n: "M-14", text: "열세 번 다시 그렸다." },
  { kind: "prompt", n: "M-15", text: "이거야!" },
  { kind: "prompt", n: "M-16", text: "근데 자주 틀렸다." },
  { kind: "prompt", n: "M-17", text: "영상까지 가자." },
  { kind: "prompt", n: "M-18", text: "다시." },
  { kind: "prompt", n: "M-19", text: "다시." },
  { kind: "prompt", n: "M-20", text: "4차에서 멈췄다." },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "── 재사용 프롬프트" },
  { kind: "spacer", h: 4 },
  { kind: "prompt", n: "A-1", text: "세션 인수인계 — v9 / v9.5 / v10 / v11 공통" },
  { kind: "prompt", n: "A-2", text: "v10 이어가기 — 0419 중단 시점" },
  { kind: "prompt", n: "A-3", text: "0509 UX/UI 리팩터링 — 4 역할 통합" },
  { kind: "spacer", h: 16 },

  { kind: "header", text: "ARTIFACTS" },
  { kind: "spacer", h: 6 },
  { kind: "role", role: "13 design iterations", name: "v1 → v13" },
  { kind: "role", role: "5 logo iterations", name: "v1 → v5" },
  { kind: "role", role: "4 Higgsfield videos", name: "iter1 → iter4" },
  { kind: "role", role: "168 cells", name: "14 × 12 경쟁사" },
  {
    kind: "role",
    role: "4 blue oceans",
    name: "AI 가이드 / 본인 앱 / 챗봇 / UI",
  },
  { kind: "role", role: "3,059줄의 대화", name: "57 entries · 55 days" },
  { kind: "role", role: "1 making-of site", name: "이 화면" },
  { kind: "spacer", h: 16 },

  { kind: "section", text: "FOR" },
  { kind: "name", text: "엄마와, 엄마의 엄마와," },
  { kind: "name", text: "그리고 우리 모두를 위한 하루." },
  { kind: "spacer", h: 18 },

  { kind: "thanks", text: "THANK YOU." },
  { kind: "spacer", h: 8 },
  { kind: "title", text: "─ FIN ─" },
  { kind: "spacer", h: 8 },
];

const TOTAL_VH = 900;

export function CreditsScene() {
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

  const vh = 100 - 112 * progress;
  const pct = progress * 100;
  const transform = `translateY(calc(${vh}vh - ${pct}%))`;

  return (
    <section
      ref={outerRef}
      id="s-credits"
      className="relative w-full"
      style={{ height: `${TOTAL_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent"
        />

        <div
          className="absolute inset-x-0 mx-auto max-w-3xl px-6 text-center md:px-12"
          style={{ transform, willChange: "transform" }}
        >
          {credits.map((line, i) => (
            <CreditLine key={i} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CreditLine({ line }: { line: Line }) {
  switch (line.kind) {
    case "title":
      return (
        <div
          className="my-10 font-sans font-semibold leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)" }}
        >
          {line.text}
        </div>
      );
    case "section":
      return (
        <div className="mb-3 font-mono text-[11px] tracking-[0.45em] text-[color:var(--color-key)]/85 md:text-xs">
          {line.text}
        </div>
      );
    case "header":
      return (
        <div className="font-mono text-sm tracking-[0.5em] text-[color:var(--color-key)] md:text-base">
          {line.text}
        </div>
      );
    case "sub":
      return (
        <div className="my-2 font-mono text-xs tracking-[0.3em] text-white/40 md:text-sm">
          {line.text}
        </div>
      );
    case "name":
      return (
        <div className="my-0.5 font-sans text-2xl leading-tight text-white md:text-3xl">
          {line.text}
        </div>
      );
    case "role":
      return (
        <div className="my-1 grid grid-cols-2 items-baseline gap-6 md:gap-12">
          <div className="text-right font-mono text-xs leading-relaxed text-white/55 md:text-sm">
            {line.role}
          </div>
          <div className="text-left font-sans text-base font-medium leading-relaxed text-white md:text-lg">
            {line.name}
          </div>
        </div>
      );
    case "prompt":
      return (
        <div className="my-1.5 grid grid-cols-[auto_1fr] items-baseline gap-4 text-left md:gap-6">
          <div className="font-mono text-xs tabular-nums text-[color:var(--color-key)]/70 md:text-sm">
            #{line.n}
          </div>
          <div className="font-mono text-sm leading-relaxed text-white/85 md:text-base">
            {line.text}
          </div>
        </div>
      );
    case "thanks":
      return (
        <div
          className="my-6 font-sans font-bold leading-none tracking-tight text-[color:var(--color-key)]"
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)",
            filter: "drop-shadow(0 0 30px rgba(126, 255, 141, 0.5))",
          }}
        >
          {line.text}
        </div>
      );
    case "spacer":
      return <div style={{ height: `${line.h * 0.45}rem` }} />;
  }
}
