export type EvolutionStage = {
  version: string;
  era: string;
  title: string;
  body: string;
  keywords: string[];
  swatch: string;
  image?: string;
  imageAspect?: number;
};

export const stages: EvolutionStage[] = [
  {
    version: "v1",
    era: "2026.03",
    title: "초기 손그림",
    body: "흰 배경에 와이어프레임. 무엇을 만들지보다 무엇을 빼지 않을지가 더 어려운 단계.",
    keywords: ["wireframe", "흑백", "텍스트 위주"],
    swatch: "#e9ecef",
    image: "/media/img/stage-v1.png",
  },
  {
    version: "v2",
    era: "2026.03",
    title: "역할별 분기 — 보호자/간호사/환자",
    body: "한 앱에 세 페르소나가 들어가야 한다는 것을 인정. 카드 시안 첫 분기.",
    keywords: ["3 personas", "card", "modular"],
    swatch: "#cfe2ff",
    image: "/media/img/stage-v2.png",
  },
  {
    version: "v3",
    era: "2026.03",
    title: "정보 위계 정돈",
    body: "스크린별 정보 우선순위 지정. 처음으로 ‘하루 한 번 보면 끝나는 화면'이라는 컨셉.",
    keywords: ["IA", "priority", "less"],
    swatch: "#a8c8ff",
  },
  {
    version: "v4",
    era: "2026.03",
    title: "톤앤무드 확정 (A안)",
    body: "Apple Health 레퍼런스. 신뢰감 있는 의료 블루 #2C7AFC를 메인 컬러로 락인.",
    keywords: ["#2C7AFC", "Apple Health", "trust"],
    swatch: "#2c7afc",
    image: "/media/img/stage-v4.png",
  },
  {
    version: "v5",
    era: "2026.03",
    title: "레퍼런스 차용 13기능 확정",
    body: "글로벌 12개 경쟁사 분석에서 의미 있는 기능만 선별 차용. 우리만의 시그니처도 동시 결정.",
    keywords: ["benchmarking", "13 features", "blue ocean"],
    swatch: "#1d6af2",
  },
  {
    version: "v6",
    era: "2026.04",
    title: "보호자앱 첫 풀스크린 시안",
    body: "26개 페이지를 하루 안에 일괄 제작. 탭바 5탭 IA가 처음 자리잡음.",
    keywords: ["26 pages", "5 tabs", "v6"],
    swatch: "#0e1014",
  },
  {
    version: "v7",
    era: "2026.04",
    title: "Apple Liquid Glass 홈",
    body: "홈을 글래스 모피즘 + 스크롤 스냅 2섹션으로 리디자인. 케어 대시보드/벤토 그리드.",
    keywords: ["glass", "scroll-snap", "bento"],
    swatch: "#74a8ff",
    image: "/media/img/stage-v7.png",
  },
  {
    version: "v8",
    era: "2026.04",
    title: "글라스 opacity 통일 + 성능 락",
    body: "blur 72→24, opacity 0.07→0.42로 뷰포트 독립 렌더링. backdrop-filter 일부 금지.",
    keywords: ["perf", "opacity 0.42", "blur 24"],
    swatch: "#5b9bff",
    image: "/media/img/stage-v8.png",
  },
  {
    version: "v9",
    era: "2026.04",
    title: "캐릭터 도입 + 케어 대시보드",
    body: "하루안부 캐릭터가 등장해 톤앤매너를 부드럽게. 케어 점수 카드 등 정보 시각화 강화.",
    keywords: ["mascot", "score card", "warmth"],
    swatch: "#2c7afc",
    image: "/media/img/stage-v9.png",
  },
  {
    version: "v9.5",
    era: "2026.04",
    title: "간호사앱 분기",
    body: "보호자앱과 같은 디자인 시스템 위에서 간호사용 페이지 분기. 데스크톱 우선 검토 시작.",
    keywords: ["nurse app", "shared DS"],
    swatch: "#1d6af2",
    image: "/media/img/stage-v9-5.png",
  },
  {
    version: "v10",
    era: "2026.04",
    title: "탭바 통일 · 채팅 통합",
    body: "g03-chat 가족/간호사/AI/환자 4종을 한 채팅 허브로 통합. common.css 단일 소스.",
    keywords: ["common.css", "chat hub"],
    swatch: "#0e1014",
    image: "/media/img/stage-v10.png",
  },
  {
    version: "v11",
    era: "2026.04",
    title: "결제 탭 5종 확장 + 마무리 정비",
    body: "자동이체·한도·변동·연간납부·경감 5종 콘텐츠 추가. 출시 직전 톤 정돈.",
    keywords: ["billing", "polish", "ship"],
    swatch: "#2c7afc",
    image: "/media/img/stage-v11.png",
  },
  {
    version: "v12",
    era: "2026.05",
    title: "환자앱 분기",
    body: "고령자 전용 UI. 큰 글씨, 단순 인터랙션, 가족 연결 중심. 다음 시즌 본격 작업 예정.",
    keywords: ["large UI", "patient", "next"],
    swatch: "#00d4ff",
  },
];
