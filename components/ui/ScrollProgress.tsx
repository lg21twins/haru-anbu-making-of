"use client";

import { useEffect, useState } from "react";

type Chapter = { id: string; label: string; index: string };

const CHAPTERS: Chapter[] = [
  { id: "ch00", index: "00", label: "Cold Open" },
  { id: "ch01", index: "01", label: "Personas" },
  { id: "ch02", index: "02", label: "Workbench" },
  { id: "ch03", index: "03", label: "Research" },
  { id: "ch04", index: "04", label: "Evolution" },
  { id: "ch05", index: "05", label: "Toolbox" },
  { id: "ch06", index: "06", label: "Higgsfield" },
  { id: "ch07", index: "07", label: "Failures" },
  { id: "ch08", index: "08", label: "Prompt Log" },
  { id: "ch09", index: "09", label: "Closing" },
];

export function ScrollProgress() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);

      const center = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      CHAPTERS.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el && el.offsetTop <= center) idx = i;
      });
      setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 h-px w-full bg-white/5"
      >
        <div
          className="h-full origin-left bg-[color:var(--color-accent-pale)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <nav
        aria-label="Chapters · Mobile"
        className={`fixed bottom-4 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 md:hidden ${
          active === 0
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/75 px-4 py-2 backdrop-blur-md">
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/40">
            CH {CHAPTERS[active].index}
          </span>
          <span className="text-xs text-white/85">
            {CHAPTERS[active].label}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-white/40">
            {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>
      </nav>

      <nav
        aria-label="Chapters"
        className="pointer-events-none fixed right-6 top-1/2 z-40 -translate-y-1/2 hidden md:block"
      >
        <ul className="space-y-4">
          {CHAPTERS.map((c, i) => (
            <li key={c.id} className="pointer-events-auto">
              <a
                href={`#${c.id}`}
                data-cursor="link"
                className="group flex items-center justify-end gap-3 font-mono text-[10px] tracking-[0.25em] text-white/45 hover:text-white"
              >
                <span
                  className={`block transition-all duration-500 ${
                    i === active ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"
                  }`}
                >
                  {c.label.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-white/70">
                  {c.index}
                </span>
                <span
                  className={`block h-px bg-white transition-all duration-500 ${
                    i === active ? "w-10 bg-[color:var(--color-accent-pale)]" : "w-3 group-hover:w-6"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
