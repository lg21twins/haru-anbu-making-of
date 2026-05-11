"use client";

import { useEffect, useRef, useState } from "react";

const apps = [
  {
    name: "보호자앱",
    role: "안심",
    tone: "from-[#7eff8d]/22 via-[#7eff8d]/6 to-transparent",
    accent: "#7eff8d",
  },
  {
    name: "환자앱",
    role: "연결",
    tone: "from-[#2c7afc]/28 via-[#2c7afc]/8 to-transparent",
    accent: "#2c7afc",
  },
  {
    name: "의료진앱",
    role: "기록",
    tone: "from-[#7c4dff]/26 via-[#7c4dff]/8 to-transparent",
    accent: "#7c4dff",
  },
];

export function AppBranchingScene() {
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
      if (p > 0.15) s = 1;
      if (p > 0.38) s = 2;
      if (p > 0.6) s = 3;
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
    <section ref={ref} className="relative w-full" style={{ height: "440vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-12 px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            v13 → branching
          </p>
          <h2
            className="mt-2 font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.8rem, 3.4vw, 3rem)" }}
          >
            한 디자인 시스템에서{" "}
            <span className="text-[color:var(--color-key)]">세 갈래.</span>
          </h2>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-3 gap-6 px-6">
          {apps.map((a, i) => (
            <div
              key={a.name}
              className="flex flex-col items-center"
              style={{
                opacity: step >= i + 1 ? 1 : 0,
                transform:
                  step >= i + 1 ? "translateY(0)" : "translateY(60px)",
                transition: `opacity 760ms cubic-bezier(0.2, 1, 0.4, 1) ${
                  i * 90
                }ms, transform 760ms cubic-bezier(0.2, 1, 0.4, 1) ${i * 90}ms`,
              }}
            >
              <div
                className={`relative aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b ${a.tone}`}
              >
                <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full bg-black/60" />
                <div className="absolute inset-x-4 top-12 h-3 rounded-full bg-white/12" />
                <div className="absolute inset-x-4 top-20 grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-xl bg-white/10" />
                  <div className="h-16 rounded-xl bg-white/10" />
                </div>
                <div className="absolute inset-x-4 top-44 h-28 rounded-2xl bg-white/10" />
                <div className="absolute inset-x-4 top-[18.5rem] h-3 rounded-full bg-white/10" />
                <div
                  className="absolute inset-x-4 bottom-6 h-11 rounded-full"
                  style={{ background: `${a.accent}40` }}
                />
              </div>
              <div className="mt-5 text-center">
                <div className="font-sans text-lg font-semibold text-white">
                  {a.name}
                </div>
                <div
                  className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: a.accent }}
                >
                  {a.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-12 px-6 text-center font-sans text-base text-white/50"
          style={{
            opacity: step >= 3 ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          같은 컴포넌트, 다른 화면. 같은 톤, 다른 역할.
        </p>
      </div>
    </section>
  );
}
