export type VideoIter = {
  iter: 1 | 2 | 3 | 4;
  label: string;
  era: string;
  src720: string;
  src480: string;
  poster: string;
  promptKey: "v1" | "v2" | "v3";
  caption: string;
  learnings: string;
};

export const higgsfieldIterations: VideoIter[] = [
  {
    iter: 1,
    label: "1차 — 거친 첫 시도",
    era: "2026.04.01",
    src720: "/media/video/iter1.mp4",
    src480: "/media/video/iter1-480.mp4",
    poster: "/media/poster/iter1.jpg",
    promptKey: "v1",
    caption:
      "막연한 한 줄로 만든 첫 결과. 캐릭터 일관성 없음, 한국 분위기 전무.",
    learnings:
      "AI에 ‘한국 병원'이라고만 던지면 미국식 인테리어가 튀어나온다. 디테일을 박아야 한다.",
  },
  {
    iter: 2,
    label: "2차 — 디테일 폭격",
    era: "2026.04.05",
    src720: "/media/video/iter2.mp4",
    src480: "/media/video/iter2-480.mp4",
    poster: "/media/poster/iter2.jpg",
    promptKey: "v2",
    caption:
      "‘301호 302호 한국식 사인, 형광등, 백색 핸드레일' 같은 구체 디테일 추가.",
    learnings:
      "분위기는 한국이 됐지만 캐릭터가 매번 다른 사람. AI 인플루언서로 캐스팅 통일 필요.",
  },
  {
    iter: 3,
    label: "3차 — 캐스팅 고정",
    era: "2026.04.10",
    src720: "/media/video/iter3.mp4",
    src480: "/media/video/iter3-480.mp4",
    poster: "/media/poster/iter3.jpg",
    promptKey: "v2",
    caption:
      "@김미영 같은 AI 인플루언서 핸들로 캐릭터를 고정. 컷 사이의 인물 일치.",
    learnings:
      "프롬프트에 ‘speaks/shouts' 같은 동사를 넣으면 화면에 영문 텍스트가 박혀 나옴. 대사는 입 움직임만.",
  },
  {
    iter: 4,
    label: "4차 — 시네마틱 안정화",
    era: "2026.04.13",
    src720: "/media/video/iter4.mp4",
    src480: "/media/video/iter4-480.mp4",
    poster: "/media/poster/iter4.jpg",
    promptKey: "v3",
    caption:
      "렌즈/조명/카메라 워크까지 명시. ‘talking animatedly'로 립싱크만 유도.",
    learnings:
      "한국어 더빙은 편집에서. 영상은 침묵 + 표정 + 입 움직임. 톤이 비로소 의도와 일치.",
  },
];

export const promptVersions = {
  v1: `Korean hospital, doctor running, dramatic.`,
  v2: `Dark dramatic Korean hospital corridor at night during a thunderstorm, long straight hallway with white walls and handrails, polished vinyl floor with reflections, fluorescent ceiling panel lights flickering, lightning flashing through windows at the end of the hallway, Korean room number signs on doors like 301호 302호, a nurse station desk visible in the distance, fire extinguisher on the wall, institutional Korean hospital atmosphere but dramatically lit like a thriller movie, intense and foreboding mood, shot on 24mm wide lens, deep shadows, 8K`,
  v3: `Same as v2, plus: @김미영 in nurse uniform talking animatedly with mouth movements only (NO speaking verbs), reading patient chart, shot on 35mm lens with shallow depth of field, cinematic three-point lighting, motion blur on running, 24fps cinema feel, color graded teal and orange, 8K`,
} as const;
