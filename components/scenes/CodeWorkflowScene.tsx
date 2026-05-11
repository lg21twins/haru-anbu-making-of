"use client";

import { useEffect, useRef, useState } from "react";

const code = `<button className="card">
  <Avatar src={user.avatar} />
  <div className="meta">
    <h3>{user.name}</h3>
    <span className="status">
      마지막 안부 {minutesAgo}분 전
    </span>
  </div>
  <Indicator color={user.color} />
</button>`;

const MAX_CPS = 36;

export function CodeWorkflowScene() {
  const ref = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const charsRef = useRef(0);
  const targetRef = useRef(0);
  const accRef = useRef(0);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const p = range > 0 ? scrolled / range : 0;
      const typeProgress = Math.max(0, Math.min(1, (p - 0.18) / 0.62));
      targetRef.current = Math.round(code.length * typeProgress);
    };

    const tick = (now: number) => {
      const last = lastFrameRef.current || now;
      lastFrameRef.current = now;
      const dt = Math.min(0.1, (now - last) / 1000);
      const cur = charsRef.current;
      const tgt = targetRef.current;
      let next = cur;
      if (tgt > cur) {
        accRef.current += MAX_CPS * dt;
        const step = Math.floor(accRef.current);
        if (step > 0) {
          accRef.current -= step;
          next = Math.min(tgt, cur + step);
        }
      } else if (tgt < cur) {
        next = tgt;
        accRef.current = 0;
      } else {
        accRef.current = 0;
      }
      if (next !== cur) {
        charsRef.current = next;
        setChars(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    compute();
    rafRef.current = requestAnimationFrame(tick);
    const onScroll = () => compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <section ref={ref} className="relative w-full" style={{ height: "520vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
        <div className="mb-8 px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            design → code
          </p>
          <h2
            className="mt-2 font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
          >
            "이 화면 그대로 코드로 짜줘."
          </h2>
        </div>

        <div className="grid w-full max-w-6xl gap-6 px-6 md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f28] to-[#0a0d12] p-6">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              design
            </p>
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] p-4">
              <div className="h-12 w-12 rounded-full bg-[color:var(--color-key)]/35" />
              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-white/45" />
                <div className="mt-2 h-2 w-32 rounded bg-white/15" />
              </div>
              <div className="h-3 w-3 rounded-full bg-[color:var(--color-key)] shadow-[0_0_10px_var(--color-key-glow)]" />
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.06] p-4">
              <div className="h-12 w-12 rounded-full bg-[#2c7afc]/35" />
              <div className="flex-1">
                <div className="h-3 w-20 rounded bg-white/45" />
                <div className="mt-2 h-2 w-28 rounded bg-white/15" />
              </div>
              <div className="h-3 w-3 rounded-full bg-[#2c7afc]" />
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.06] p-4">
              <div className="h-12 w-12 rounded-full bg-[#7c4dff]/35" />
              <div className="flex-1">
                <div className="h-3 w-28 rounded bg-white/45" />
                <div className="mt-2 h-2 w-24 rounded bg-white/15" />
              </div>
              <div className="h-3 w-3 rounded-full bg-[#7c4dff]" />
            </div>
          </div>

          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] p-6 font-mono text-[13px] text-white/85">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Card.tsx
              </span>
            </div>
            <pre className="whitespace-pre-wrap leading-[1.55]">
              {code.slice(0, chars)}
              <span className="caret caret-fat" aria-hidden />
            </pre>
          </div>
        </div>

        <p className="mt-10 px-6 text-center font-sans text-base text-white/55">
          → 그 코드가 곧 동작하는 v8 보호자앱이 됨.
        </p>
      </div>
    </section>
  );
}
