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
  { kind: "spacer", h: 4 },
  {
    kind: "sub",
    text: "── 우리가 실제로 작성한 명령 그대로 ──",
  },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "제 1 막 · 기획" },
  { kind: "spacer", h: 4 },
  {
    kind: "prompt",
    n: "01",
    text: "안에 있는 파일 분석해서 우리가 이 프로젝트를 만들기 전에 경쟁사 및 시장 조사를 할꺼야",
  },
  { kind: "prompt", n: "02", text: "plan.md, architecture.md 도 작성해" },
  { kind: "prompt", n: "03", text: "워드 파일로 만들어줘" },
  {
    kind: "prompt",
    n: "04",
    text: "바로 반영하지말고 어떻게 구체적으로 구현하면 좋을지 알려줘",
  },
  { kind: "prompt", n: "05", text: "우리 타임라인은 이거 보고 반영해줘" },
  {
    kind: "prompt",
    n: "06",
    text: "추가하면 좋을 것 같다는 거도 추가하고, 타임라인도 모든 파일에 적용하고 예전 파일은 삭제해줘",
  },
  { kind: "prompt", n: "07", text: "기능들을 한장에 하나씩 설명하도록 추가" },
  { kind: "prompt", n: "08", text: "정리해서 만들어줘" },
  { kind: "prompt", n: "09", text: "벤치마킹부터 해보자" },
  { kind: "prompt", n: "10", text: "간호사한테 인터뷰할 질문" },
  {
    kind: "prompt",
    n: "11",
    text: "의료인으로 단어 대체해서 다시 만들어줘",
  },
  {
    kind: "prompt",
    n: "12",
    text: "안에 있는 문서들 폴더별로 정리좀 해줄래",
  },
  {
    kind: "prompt",
    n: "13",
    text: "기반이 될 책 한권을 정리한 파일이 있어",
  },
  { kind: "prompt", n: "14", text: "파일 전체 다 읽어봐" },
  {
    kind: "prompt",
    n: "15",
    text: "디자인을 참고할 레퍼런스 3개랑 의료 서비스 3가지 구해와",
  },
  {
    kind: "prompt",
    n: "16",
    text: "컬러 팔레트 추천해줘, 사용자별 컬러를 다르게하자는 얘기도 나왔는데",
  },
  { kind: "prompt", n: "17", text: "키비주얼은 어케하는게 좋을지" },
  {
    kind: "prompt",
    n: "18",
    text: "디자인을 대충 어떤 느낌으로 가는게 좋을 것 같아",
  },
  {
    kind: "prompt",
    n: "19",
    text: "책 내용 다시 분석해서 없는 것들 하나하나 문서로 만든다 실시",
  },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "제 2 막 · 디자인" },
  { kind: "spacer", h: 4 },
  { kind: "prompt", n: "20", text: "순차적으로 다 만들어" },
  { kind: "prompt", n: "21", text: "AI스러운 배치 싫다" },
  { kind: "prompt", n: "22", text: "산만하다" },
  { kind: "prompt", n: "23", text: "불필요한 요소 삭제" },
  { kind: "prompt", n: "24", text: "이모지 절대 쓰지마" },
  { kind: "prompt", n: "25", text: "실제 앱처럼 보여줘" },
  { kind: "prompt", n: "26", text: "카메라 구멍 여백 추가" },
  { kind: "prompt", n: "27", text: "스테이터스바 삭제" },
  { kind: "prompt", n: "28", text: "간호사 메인화면 이런식으로" },
  { kind: "prompt", n: "29", text: "이거 두줄로" },
  { kind: "prompt", n: "30", text: "기획에서 반영되지 않은 것 찾아봐" },
  {
    kind: "prompt",
    n: "31",
    text: "하단바 밑에 아이폰 홈으로 가는 버튼 생각해서 여유 공간 마련해봐",
  },
  { kind: "prompt", n: "32", text: "유리같이" },
  { kind: "prompt", n: "33", text: "사용자 친화적이게" },
  { kind: "prompt", n: "34", text: "통일감 있게" },
  { kind: "prompt", n: "35", text: "행간 자간 점검" },
  {
    kind: "prompt",
    n: "36",
    text: "얘처럼 아예 채팅창만 남기고 밑으로 내리면 탭바 생기면서 밑에 AI 요약하는거 보여달라고",
  },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "제 3 막 · 정밀화" },
  { kind: "spacer", h: 4 },
  {
    kind: "prompt",
    n: "37",
    text: "글래스 요소들이 뷰포트 상관없이 잘 보이는 방법 없어?",
  },
  {
    kind: "prompt",
    n: "38",
    text: "스크롤 내린버전으로 각각 다시 뽑아라, 온보딩 화면도",
  },
  { kind: "prompt", n: "39", text: "온보딩 플로우 띄워봐" },
  { kind: "prompt", n: "40", text: "파일 정리해라" },
  { kind: "prompt", n: "41", text: "v8로 옮겨라" },
  { kind: "prompt", n: "42", text: "v8-1로 보호자 홈 만들어봐" },
  {
    kind: "prompt",
    n: "43",
    text: "결제창 카드 글라스 느낌 안 나는데?",
  },
  { kind: "prompt", n: "44", text: "홈화면 오늘의 케어도 동일하게" },
  {
    kind: "prompt",
    n: "45",
    text: "피그마 링크 던져줄건데 iOS 디자인 가이드다, 샅샅이 분석해라",
  },
  {
    kind: "prompt",
    n: "46",
    text: "v8-1 네비게이션 아이콘 v8처럼 하고 텍스트 삭제해",
  },
  { kind: "prompt", n: "47", text: "투약 위젯 파란색으로 통일" },
  {
    kind: "prompt",
    n: "48",
    text: "식사 표도 파란색으로 하고 명도 차이",
  },
  { kind: "prompt", n: "49", text: "채팅에 같은 간호사가 왜 두 개야" },
  {
    kind: "prompt",
    n: "50",
    text: "납부하기 버튼 컬러도 우리 파란색으로 가자",
  },
  {
    kind: "prompt",
    n: "51",
    text: "콘텐츠간 여유 공간 좀 더 만들어보자",
  },
  { kind: "spacer", h: 10 },

  { kind: "sub", text: "제 4 막 · 메이킹 오브 (이 사이트)" },
  { kind: "spacer", h: 4 },
  {
    kind: "prompt",
    n: "M-01",
    text: "넌 이제부터 우리의 프로젝트 \"하루안부\"를 담당할 기획자이자 디자이너이자 영상 제작자야.",
  },
  { kind: "prompt", n: "M-02", text: "누구를 위해 만들지부터 정해." },
  { kind: "prompt", n: "M-03", text: "그들이 진짜 원하는 게 뭔지 찾아내." },
  { kind: "prompt", n: "M-04", text: "시장에서 우리만 할 수 있는 게 뭔지도." },
  { kind: "prompt", n: "M-05", text: "우리 기획서 가지고 로고 만들어봐." },
  {
    kind: "prompt",
    n: "M-06",
    text: "이건 로고가 아니라 다이어그램이잖아. 다시.",
  },
  {
    kind: "prompt",
    n: "M-07",
    text: "캐릭터 같아. 의료 신뢰감이 없어. 다시.",
  },
  { kind: "prompt", n: "M-08", text: "색이 너무 많아 무거워. 단순하게 다시." },
  { kind: "prompt", n: "M-09", text: "기능 그대로네. 시그니처 한 곡선으로 가자." },
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
  { kind: "spacer", h: 14 },
];

const ANIMATION_DURATION_S = 100;
const TRIGGER_THRESHOLD = 0.75;

type LenisLike = { stop: () => void; start: () => void };

export function CreditsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= TRIGGER_THRESHOLD) {
            setActive(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: [TRIGGER_THRESHOLD, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || done) return;
    const win = window as unknown as { __lenis?: LenisLike };
    const lenis = win.__lenis;
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;

    lenis?.stop();
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const release = () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
      lenis?.start();
      setDone(true);
    };

    const timer = window.setTimeout(release, ANIMATION_DURATION_S * 1000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.clearTimeout(timer);
        release();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
      lenis?.start();
    };
  }, [active, done]);

  const playing = active && !done;

  return (
    <section
      ref={sectionRef}
      id="s-credits"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
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
        style={{
          animation: playing
            ? `credit-roll ${ANIMATION_DURATION_S}s linear forwards`
            : undefined,
          transform: done
            ? "translateY(calc(-100% - 12vh))"
            : "translateY(100vh)",
          willChange: "transform",
        }}
      >
        {credits.map((line, i) => (
          <CreditLine key={i} line={line} />
        ))}
      </div>

      {playing && (
        <button
          type="button"
          onClick={() => {
            const win = window as unknown as { __lenis?: LenisLike };
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            win.__lenis?.start();
            setDone(true);
          }}
          data-cursor="link"
          className="absolute right-6 top-6 z-30 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-white/65 backdrop-blur-sm transition-colors hover:border-[color:var(--color-key)]/60 hover:text-[color:var(--color-key)] md:right-10 md:top-10 md:text-xs"
        >
          SKIP ↓
        </button>
      )}
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
