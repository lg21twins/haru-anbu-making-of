export type Failure = {
  number: string;
  category: string;
  what: string;
  why: string;
  fix: string;
  result: string;
  poster?: string;
  beforeText?: string;
  afterText?: string;
};

export const failures: Failure[] = [
  {
    number: "01",
    category: "HIGGSFIELD · 분위기",
    what: "‘한국 병원’이라 했는데 미국식 인테리어가 나왔다",
    why:
      "‘Korean hospital’만 적으면 AI는 학습 데이터 다수가 미국식이라 그쪽으로 간다.",
    fix:
      "‘301호 302호 한국식 사인, 형광등 패널, 백색 핸드레일’ 같은 한국 디테일을 박았다.",
    result: "한국 병원 분위기 정확히 살아남.",
    beforeText: "Korean hospital, doctor running, dramatic.",
    afterText:
      "Dark dramatic Korean hospital corridor at night, room signs 301호 302호, fluorescent ceiling, white handrails…",
  },
  {
    number: "02",
    category: "HIGGSFIELD · 자막 사고",
    what: "‘speaks’를 넣었더니 화면에 영문 자막이 박혀 나왔다",
    why:
      "Cinema Studio는 한국어 음성을 만들지 못해 동사 그대로를 텍스트로 렌더한다.",
    fix:
      "동사를 빼고 ‘talking animatedly’만 남겨 입 움직임만 유도. 한국어 더빙은 후처리.",
    result: "립싱크는 살고 자막 사고는 사라짐.",
    beforeText: "nurse speaks loudly to the doctor",
    afterText: "nurse talking animatedly with mouth movements (no speaking verbs)",
  },
  {
    number: "03",
    category: "HIGGSFIELD · 캐스팅",
    what: "컷마다 다른 사람이 나타났다",
    why: "캐릭터 핸들 없이 텍스트만으로는 매번 새 얼굴이 생성된다.",
    fix:
      "@김미영, @박지현 같은 AI 인플루언서 핸들을 등록해 캐스팅을 고정.",
    result: "컷 간 인물 일치, 시나리오 흐름 회복.",
    beforeText: "Korean woman in her 50s",
    afterText: "@김미영 (registered AI influencer handle)",
  },
  {
    number: "04",
    category: "v6 보호자앱",
    what: "26 페이지 일괄 제작 중 탭바 일부가 fixed가 풀렸다",
    why:
      "기존 페이지의 !important 오버라이드 블록을 살린 채 common.css만 갈아끼웠다.",
    fix:
      "오버라이드 블록을 모두 제거하고 common.css 단일 소스로 통일.",
    result: "전 페이지 탭바 동일 동작.",
    beforeText: ".tabbar { position: relative !important }",
    afterText: ".tabbar { position: fixed }   /* common.css single source */",
  },
  {
    number: "05",
    category: "글라스 opacity",
    what: "뷰포트에 따라 글래스 카드의 색이 어둡거나 밝게 흔들렸다",
    why:
      "backdrop-filter: blur(72px) 가 IDE 다크 배경을 샘플링해 엣지가 어두워졌다.",
    fix:
      "background opacity 0.07 → 0.42, blur 72px → 24px 으로 자체 색상을 확보.",
    result: "어떤 화면에서도 같은 톤.",
    beforeText: ".lq { background: rgba(255,255,255,.07); backdrop-filter: blur(72px); }",
    afterText: ".lq { background: rgba(255,255,255,.42); backdrop-filter: blur(24px); }",
  },
  {
    number: "06",
    category: "톤앤매너",
    what: "보호자앱에 보라색 #6D28D9 이 끼어들었다",
    why:
      "v7 시안 일부에서 글로벌 디자인 시스템 색이 적용됨. 의료 신뢰감과 충돌.",
    fix:
      "보라색 전면 금지, 메인 #2C7AFC 단일 톤으로 락인.",
    result: "병원 톤 회복.",
    beforeText: "--accent: #6D28D9",
    afterText: "--accent: #2C7AFC   /* Apple Health blue */",
  },
];
