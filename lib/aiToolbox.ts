export type Tool = {
  name: string;
  category: string;
  role: string;
  usage: string;
  artifact: string;
  link?: string;
  weight: number;
  initial: string;
  color: string;
};

export const tools: Tool[] = [
  {
    name: "Claude (Opus 4)",
    category: "LLM 협업",
    role: "기획·디자인·코드 협업",
    usage:
      "1,845줄의 대화로그 #1~#51. 기획서 초안, 페르소나 도출, UX 분석, 디자인 시스템 빌드, common.css 일괄 패치까지.",
    artifact: "76 entries · 28 days",
    weight: 5,
    initial: "C",
    color: "#ff8a65",
  },
  {
    name: "Higgsfield · Cinema Studio",
    category: "AI 영상",
    role: "위트 시나리오 단편 영상",
    usage:
      "‘인류 최대의 위기' 1편 + 의인화 2편 시나리오를 4차에 걸쳐 진화. 캐스팅 고정, 프롬프트 v2/v3, 한국어 더빙은 후처리.",
    artifact: "4 iterations · 16 cuts",
    weight: 5,
    initial: "H",
    color: "#7c4dff",
  },
  {
    name: "Midjourney v6",
    category: "AI 이미지",
    role: "캐릭터 · 등장인물 · 무드 보드",
    usage:
      "AI 인플루언서 핸들로 한국인 캐릭터 핀-다운. 비주얼 벤치마킹과 키비주얼 시안의 출발점.",
    artifact: "Personas · Mood",
    weight: 4,
    initial: "M",
    color: "#e8b4d0",
  },
  {
    name: "Remotion",
    category: "프로그래매틱 영상",
    role: "프로모 영상 5차 빌드",
    usage:
      "React로 프레임 단위 합성. 모션그래픽이 들어간 5개 프로모 버전 (v1~v5)을 코드 베이스로 일괄 출력.",
    artifact: "5 promo builds",
    weight: 3,
    initial: "R",
    color: "#00d4ff",
  },
  {
    name: "Figma",
    category: "디자인 도구",
    role: "초기 와이어프레임 + 컴포넌트 시스템",
    usage:
      "v1~v4 단계의 시안. 그 후로는 HTML/CSS 목업으로 이전해 코드와 디자인을 같은 언어로.",
    artifact: "v1—v4 wireframes",
    weight: 3,
    initial: "F",
    color: "#7df0a3",
  },
  {
    name: "Pretendard Variable",
    category: "타이포",
    role: "한국어 본문/제목 통일",
    usage: "보호자앱 v8부터 단일 폰트로 락인. 가변 폰트로 wght/opsz 자유.",
    artifact: "Single typeface",
    weight: 2,
    link: "https://github.com/orioncactus/pretendard",
    initial: "Pre",
    color: "#f4f5f7",
  },
  {
    name: "Iconify · Fluent",
    category: "아이콘",
    role: "탭바·인라인 아이콘 일괄 소스",
    usage: "Fluent filled를 우선. 인라인 SVG로 사이트 전반 직접 임베드.",
    artifact: "~120 icons",
    weight: 2,
    initial: "Ico",
    color: "#ffc78a",
  },
  {
    name: "Next.js 16 + R3F + GSAP",
    category: "프론트엔드",
    role: "이 사이트 자체",
    usage:
      "App Router · React 19 · Tailwind 4. 모션 GSAP/ScrollTrigger/Flip, 3D React Three Fiber, 스무스 스크롤 Lenis.",
    artifact: "haru-anbu-making-of",
    weight: 4,
    initial: "▲",
    color: "#74a8ff",
  },
];
