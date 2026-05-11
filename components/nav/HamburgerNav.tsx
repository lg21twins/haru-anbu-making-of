"use client";

import { useEffect, useState } from "react";

const items = [
  { href: "#nav-problem", label: "시작", desc: "문제 정의" },
  { href: "#nav-research", label: "리서치", desc: "퍼소나 · 시장" },
  { href: "#nav-brand", label: "브랜드", desc: "로고 진화" },
  { href: "#nav-design", label: "디자인", desc: "v1 → v13 · 분기" },
  { href: "#nav-video", label: "영상", desc: "Higgsfield 4차" },
  { href: "#nav-method", label: "방법", desc: "프롬프트 · 툴" },
  { href: "#nav-numbers", label: "결산", desc: "55일" },
];

export function HamburgerNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed right-5 top-5 z-[200] font-sans">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        className="relative grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/50 backdrop-blur-xl transition-colors hover:border-[color:var(--color-key)]/70"
      >
        <img
          src="/cursor-haru.svg"
          alt=""
          className="h-7 w-7"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 520ms cubic-bezier(0.2, 1, 0.4, 1)",
            filter: "drop-shadow(0 0 8px rgba(126, 255, 141, 0.45))",
          }}
        />
      </button>

      <div
        className="absolute right-0 top-[3.75rem] w-[268px]"
        style={{
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scale(1)"
            : "translateY(-14px) scale(0.94)",
          pointerEvents: open ? "auto" : "none",
          transformOrigin: "top right",
          transition:
            "opacity 380ms cubic-bezier(0.2, 1, 0.4, 1), transform 380ms cubic-bezier(0.2, 1, 0.4, 1)",
        }}
      >
        <ul className="rounded-2xl border border-white/10 bg-black/85 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          {items.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="group block rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06]"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(-8px)",
                  transition: `opacity 320ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 36 + 80
                  }ms, transform 320ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    i * 36 + 80
                  }ms`,
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-medium text-white transition-colors group-hover:text-[color:var(--color-key)]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/30">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-white/40">{item.desc}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
