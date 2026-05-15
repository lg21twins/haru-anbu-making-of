"use client";

import { useEffect, useRef, useState } from "react";

const prompt = "노인 돌봄 시장의 빈틈은 어디 있을까?";
const responses = [
  {
    label: "자녀의 죄책감",
    body: "멀리 사는 자녀가 매일 부모 상태를 확인할 방법이 없다. 전화는 부담이고, 영상통화는 의무가 된다.",
  },
  {
    label: "환자의 고립",
    body: "자식들과 연락이 점점 뜸해진다. 병원에 가도 의사 한 명에게 5분, 그게 전부다.",
  },
  {
    label: "간병인의 단절",
    body: "환자의 히스토리가 한 사람 머릿속에만 있다. 다음 교대자에게 전달되지 않는다.",
  },
];
const conclusion = "보호자 ↔ 환자 ↔ 간병인 ↔ 의료진을 한 줄로 잇자.";

export function ProblemDiscoveryScene() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = range > 0 ? scrolled / range : 0;
      let s = 0;
      if (p > 0.12) s = 1;
      if (p > 0.3) s = 2;
      if (p > 0.48) s = 3;
      if (p > 0.7) s = 4;
      setStep(s);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <section ref={ref} className="relative w-full" style={{ height: "520vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
          <div className="mb-10 flex items-start gap-3">
            <span className="mt-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-key)] shadow-[0_0_12px_var(--color-key-glow)]" />
            <p
              className="font-sans font-semibold text-white"
              style={{
                fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
                lineHeight: 1.25,
              }}
            >
              {prompt}
            </p>
          </div>

          <div className="space-y-5">
            {responses.map((r, i) => (
              <div
                key={r.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
                style={{
                  opacity: step >= i + 1 ? 1 : 0,
                  transform:
                    step >= i + 1 ? "translateY(0)" : "translateY(28px)",
                  transition:
                    "opacity 640ms cubic-bezier(0.2, 1, 0.4, 1), transform 640ms cubic-bezier(0.2, 1, 0.4, 1)",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs text-[color:var(--color-key)]">
                    0{i + 1}
                  </span>
                  <span className="font-sans text-sm font-semibold text-[color:var(--color-key)]">
                    {r.label}
                  </span>
                </div>
                <p
                  className="text-white/85"
                  style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)" }}
                >
                  {r.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-14 border-t border-white/10 pt-8 text-center"
            style={{
              opacity: step >= 4 ? 1 : 0,
              transform: step >= 4 ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 800ms cubic-bezier(0.2, 1, 0.4, 1), transform 800ms cubic-bezier(0.2, 1, 0.4, 1)",
            }}
          >
            <p
              className="font-sans font-bold text-[color:var(--color-key)]"
              style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}
            >
              "{conclusion}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
