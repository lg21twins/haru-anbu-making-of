export type Persona = {
  role: string;
  priority: string;
  name: string;
  age: number;
  tagline: string;
  quote: string;
  goals: string[];
  frustrations: string[];
  device: string;
  color: string;
  accent: string;
};

export const personas: Persona[] = [
  {
    role: "보호자",
    priority: "★★★ Primary",
    name: "김미영",
    age: 52,
    tagline: "맞벌이 워킹맘 · 어머니 요양원 입소 6개월",
    quote: "퇴근하고 전화하면 안 받을 때가 많아요. 그때 제일 불안합니다.",
    goals: [
      "오늘 어머니가 괜찮은지 매일 확인",
      "긴급 상황에 즉시 알림 수신",
      "요양 정보를 한 곳에서",
      "죄책감을 줄이고 싶다",
    ],
    frustrations: [
      "요양원 전화 연결률 60%",
      "비용·정책 정보가 파편적",
      "처방전을 알 수 없다",
      "혼자 참거나 카페에 글을 쓴다",
    ],
    device: "Mobile",
    color: "#2c7afc",
    accent: "보호자",
  },
  {
    role: "의료진",
    priority: "★★★ Primary",
    name: "박지현",
    age: 34,
    tagline: "요양병원 간호사 · 연차 8년 · 야간 근무 비중 높음",
    quote: "기록 부담 줄이고 보호자 전화도 줄었으면 좋겠어요.",
    goals: [
      "환자 돌봄에 집중할 업무 환경",
      "수기 기록 시간 단축",
      "보호자 전화 응대 부담 완화",
      "교대 인수인계 정확도",
    ],
    frustrations: [
      "전화 응대 + 수기 기록에 하루 2시간+",
      "구식 EMR, 모바일 미지원",
      "교대 인수인계 정보 누락",
      "B2B 솔루션이 비싸 도입 못 함",
    ],
    device: "PC + Mobile",
    color: "#7c4dff",
    accent: "의료진",
  },
  {
    role: "환자",
    priority: "★★☆ Served",
    name: "김순자",
    age: 78,
    tagline: "요양원 입소 6개월 · 경증 인지장애 · 스마트폰 통화 가능",
    quote: "딸이 보고 싶다. 오늘 뭐 하는지 알고 싶다.",
    goals: [
      "가족과의 연결감",
      "오늘 일정·식단을 미리 알기",
      "큰 글씨·간단한 UI",
      "두려움 없이 사용",
    ],
    frustrations: [
      "스마트폰 앱 사용 어려움",
      "전화도 연결 안 될 때가 있다",
      "고령자 UI를 배려한 앱이 없음",
      "디지털 배제라는 고정관념",
    ],
    device: "Tablet · Large UI",
    color: "#00d4ff",
    accent: "환자",
  },
];

export const jtbds = [
  {
    when: "퇴근 후 어머니가 전화를 안 받을 때",
    user: "보호자 김미영은",
    job: "어머니가 괜찮다는 확신을 매일 갖고 싶다",
    why: "직접 가지 못하는 미안함과 불안을 잠재우기 위해",
  },
  {
    when: "보호자 전화가 빗발치는 점심·저녁 시간",
    user: "간호사 박지현은",
    job: "환자 돌봄에 집중할 수 있는 업무 환경을 갖고 싶다",
    why: "전화 응대·수기 기록에 본업 시간을 빼앗기지 않기 위해",
  },
  {
    when: "오후 시간 혼자 방에 있을 때",
    user: "환자 김순자는",
    job: "딸과 연결되어 있다는 안도감을 느끼고 싶다",
    why: "고립감과 외로움을 줄이기 위해",
  },
];
