"use client";

import { useMemo, useRef } from "react";
import { useSpaceGate } from "@/lib/useSpaceGate";

type Pill = { text: string };

// 100+ unique 단어/구절 — 모두 같은 크기로 marquee
const allPills: Pill[] = [
  { text: "디자인" },
  { text: "스크린샷" },
  { text: "만들어줘" },
  { text: "레퍼런스" },
  { text: "다시" },
  { text: "이거야" },
  { text: "더 단순하게" },
  { text: "홈화면" },
  { text: "탭바" },
  { text: "피드백" },
  { text: "반영해줘" },
  { text: "추가해줘" },
  { text: "정리" },
  { text: "업데이트" },
  { text: "통일감" },
  { text: "컬러 팔레트" },
  { text: "보호자앱" },
  { text: "환자앱" },
  { text: "의료진웹" },
  { text: "Liquid Glass" },
  { text: "벤토 그리드" },
  { text: "햅틱" },
  { text: "스킬 써" },
  { text: "분석해봐" },
  { text: "X로 가자" },
  { text: "왜 안 돼?" },
  { text: "맥락 다시" },
  { text: "그대로 코드로" },
  { text: "Higgsfield" },
  { text: "4차 시나리오" },
  { text: "프롬프트 다시" },
  { text: "온보딩" },
  { text: "행간 자간" },
  { text: "여백" },
  { text: "글라스" },
  { text: "다크모드" },
  { text: "톤앤무드" },
  { text: "퍼소나" },
  { text: "JTBD" },
  { text: "린캔버스" },
  { text: "와이어프레임" },
  { text: "IA" },
  { text: "유저플로" },
  { text: "케어" },
  { text: "리포트" },
  { text: "알림" },
  { text: "처방전" },
  { text: "타임라인" },
  { text: "일일 리포트" },
  { text: "오늘 일정" },
  { text: "결제 탭" },
  { text: "납부 이력" },
  { text: "더미데이터" },
  { text: "차트" },
  { text: "SVG" },
  { text: "이쁘게" },
  { text: "깔끔하게" },
  { text: "심플하게" },
  { text: "산만함 제거" },
  { text: "스러운" },
  { text: "공간 마련" },
  { text: "여유 공간" },
  { text: "사용자별" },
  { text: "역할별" },
  { text: "분기" },
  { text: "간호사" },
  { text: "보호자" },
  { text: "환자" },
  { text: "의료진" },
  { text: "정희님" },
  { text: "김순자" },
  { text: "현장 인터뷰" },
  { text: "시장 조사" },
  { text: "경쟁사 분석" },
  { text: "Apple Health" },
  { text: "Stripe" },
  { text: "iOS 프레임" },
  { text: "스테이터스바" },
  { text: "노치" },
  { text: "safe area" },
  { text: "스크롤 스냅" },
  { text: "스크롤 트리거" },
  { text: "GSAP" },
  { text: "Lenis" },
  { text: "Tailwind" },
  { text: "Next.js" },
  { text: "Vercel" },
  { text: "GitHub" },
  { text: "푸시해줘" },
  { text: "커밋" },
  { text: "롤백" },
  { text: "다국어" },
  { text: "Pretendard" },
  { text: "노트북에서" },
  { text: "복잡도 컷" },
  { text: "디버깅" },
  { text: "/simplify" },
  { text: "/ultrareview" },
  { text: "/loop" },
  { text: "음, 별로" },
  { text: "이건 아냐" },
  { text: "통과" },
  { text: "괜찮네" },
];

type PillStyle = { bg: string; fg: string; border?: string };
// 브랜드 그린(#00CB49, HSL 142·100%·40%)을 기준으로, 모든 컬러를 같은 명도·채도(L≈40% S≈100%)
// 풀채도 쥬얼톤 패밀리로 맞춰 통일감 있게. 흰색 자리는 그린으로 교체.
const palette: PillStyle[] = [
  { bg: "#00cb49", fg: "#ffffff" }, // green (브랜드) ← 기존 흰색
  { bg: "#0066cc", fg: "#ffffff" }, // blue
  { bg: "#8100cc", fg: "#ffffff" }, // violet
  { bg: "#00cb49", fg: "#ffffff" }, // green (브랜드) ← 기존 흰색
  { bg: "#3300cc", fg: "#ffffff" }, // indigo
  { bg: "#00cca3", fg: "#06130a" }, // teal
  { bg: "#aa00cc", fg: "#ffffff" }, // magenta
  { bg: "#cc0088", fg: "#ffffff" }, // fuchsia
  { bg: "#0044cc", fg: "#ffffff" }, // deep blue
  { bg: "#cc0055", fg: "#ffffff" }, // rose
  { bg: "#cc5f00", fg: "#06130a" }, // amber
  { bg: "#00a3cc", fg: "#06130a" }, // cyan
];

function hash(n: number): number {
  const x = (n * 9301 + 49297) % 233280;
  return x / 233280;
}

function shuffleSeed<T>(arr: T[], seed: number): T[] {
  return arr
    .map((p, i) => ({ p, k: hash(i * 13 + seed * 31 + 1) }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => p);
}

const ROWS = 6;
const PILLS_PER_ROW = Math.ceil(allPills.length / ROWS);

export function PromptGrammarScene({ gate }: { gate?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSpaceGate(sectionRef, { gate, steps: 1 });
  const rows = useMemo(() => {
    // 단어를 6개 행으로 분배 (행마다 다른 시드로 셔플 → 행마다 다른 단어 묶음)
    return Array.from({ length: ROWS }).map((_, r) => {
      const shuffled = shuffleSeed(allPills, r);
      const slice = shuffled.slice(0, PILLS_PER_ROW + 2);
      return slice.map((p, i) => ({
        text: p.text,
        style: palette[(i * 3 + r * 5 + Math.floor(hash(i * 7 + r) * 6)) % palette.length],
      }));
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-20 md:py-28"
    >
      <div className="mb-[7vh] px-6 text-center md:mb-[9vh]">
        {/* 다른 섹션 타이틀과 통일: h3 · text-section-title · extrabold · tracking-tight */}
        <h3 className="font-sans text-[length:var(--text-section-title)] font-extrabold tracking-tight text-white">
          우리가 자주 보낸 말들.
        </h3>
      </div>

      <div className="relative flex flex-col gap-3 md:gap-4">
        {rows.map((rowPills, r) => {
          const dir = r % 2 === 0 ? "marquee-track" : "marquee-track marquee-reverse";
          const duration = 40 + (r % 3) * 10; // 행마다 살짝 다른 속도
          return (
            <div
              key={r}
              className="relative w-full overflow-hidden"
              style={{ maskImage: "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)" }}
            >
              <div
                className={dir}
                style={{ animationDuration: `${duration}s` }}
              >
                {/* 두 번 반복해서 끊김 없는 루프 */}
                {[...rowPills, ...rowPills].map((p, i) => {
                  const c = p.style;
                  return (
                    <span
                      key={`${r}-${i}`}
                      className="mx-2 inline-flex items-center whitespace-nowrap rounded-full font-sans font-semibold leading-none tracking-tight"
                      style={{
                        background: c.bg,
                        color: c.fg,
                        border: c.border
                          ? `1.5px solid ${c.border}`
                          : "1.5px solid transparent",
                        fontSize: "clamp(1.5rem, 3vw, 3.2rem)",
                        padding: "0.62em 1.35em",
                      }}
                    >
                      {p.text}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
