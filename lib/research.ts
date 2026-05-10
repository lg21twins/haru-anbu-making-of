export type Competitor = {
  name: string;
  origin: "KR" | "GLOBAL";
  scope: string;
};

export const FEATURES = [
  "환자 상태 실시간 공유",
  "보호자-의료진 채팅",
  "AI 일일 리포트",
  "AI 요양 가이드",
  "처방전 공유",
  "투약 알림",
  "면회 예약",
  "긴급 알림 (SOS)",
  "환자 본인 앱",
  "비용 자동 정산",
  "장기요양 등급 안내",
  "다자간 가족방",
  "감정 지지 챗봇",
  "고령자 전용 UI",
] as const;

export const COMPETITORS: Competitor[] = [
  { name: "케어닥", origin: "KR", scope: "방문요양 매칭" },
  { name: "케어네이션", origin: "KR", scope: "간병인 매칭" },
  { name: "케어포", origin: "KR", scope: "B2B 시설 관리" },
  { name: "엔젤시스템", origin: "KR", scope: "B2B EMR" },
  { name: "또하나의가족", origin: "KR", scope: "보호자 카페" },
  { name: "스마트장기요양", origin: "KR", scope: "정보 안내" },
  { name: "CaringBridge", origin: "GLOBAL", scope: "가족 일기" },
  { name: "CareSmartz360", origin: "GLOBAL", scope: "B2B 운영" },
  { name: "Caring Village", origin: "GLOBAL", scope: "보호자 협업" },
  { name: "CareZone", origin: "GLOBAL", scope: "약품 관리" },
  { name: "Lotsa Helping Hands", origin: "GLOBAL", scope: "돌봄 일정" },
  { name: "AlayaCare", origin: "GLOBAL", scope: "방문요양 SaaS" },
];

export const MATRIX: number[][] = [
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const FINDINGS = [
  {
    title: "‘입소 후' 3자 실시간 소통은 국내 부재",
    body: "보호자·의료진·환자가 같은 앱에서 만나는 플랫폼은 국내 없음. 블루오션 확인.",
  },
  {
    title: "AI 일일 리포트 자동 생성은 어디에도 없다",
    body: "기존 솔루션은 수기 또는 관리자 입력. AI 생성 리포트는 차별화 영역.",
  },
  {
    title: "고령자 전용 UI는 글로벌도 미흡",
    body: "환자를 ‘서비스 사용자'로 보지 않은 가정. 큰 글씨/단순 인터랙션 진입로 비어있음.",
  },
];
