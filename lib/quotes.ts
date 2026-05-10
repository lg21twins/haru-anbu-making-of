export type Quote = {
  author: string;
  role: string;
  body: string;
  context: string;
  tone: "interview" | "review" | "self";
};

export const quotes: Quote[] = [
  {
    author: "보호자 김씨",
    role: "60대 · 어머니 입소 1년",
    body:
      "전화해도 안 받을 때가 진짜 미치겠어요. 어머니가 괜찮은지만 알아도 마음이 놓이는데.",
    context: "현장 인터뷰 #1 · 2026.03",
    tone: "interview",
  },
  {
    author: "간호사 이씨",
    role: "요양병원 8년 차",
    body:
      "보호자 전화 응대만 하루 2시간이에요. 그 시간에 환자 한 명 더 봐야 하는데.",
    context: "현장 인터뷰 #2 · 2026.03",
    tone: "interview",
  },
  {
    author: "교수님 피드백",
    role: "지도교수",
    body:
      "기능을 더 넣지 말고 ‘하루 한 번 보면 끝나는 화면’이라는 컨셉을 끝까지 밀어봐요.",
    context: "중간발표 회의 · 2026.03",
    tone: "review",
  },
  {
    author: "김지욱",
    role: "디자인 · 메이커",
    body:
      "13번 다시 그리는 동안 가장 많이 바꾼 건 컬러도 레이아웃도 아니라 ‘덜어내는 용기’였다.",
    context: "회고 노트 · 2026.04",
    tone: "self",
  },
];

export const sketchNotes = [
  { tag: "WIRE", body: "메인탭 5개? 아니면 4개로 줄여보기" },
  { tag: "QUOTE", body: "‘오늘 하루도 안녕하셨습니다.’ ← 슬로건 후보" },
  { tag: "TODO", body: "JTBD 인터뷰 3명 — 보호자/간호사/환자" },
  { tag: "REF", body: "Apple Health · Apple Fitness 톤" },
  { tag: "WARN", body: "보라색 금지! 파란색 단일 톤" },
  { tag: "IDEA", body: "AI 일일 리포트 = 차별화 핵심" },
];
