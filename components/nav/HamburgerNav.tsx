"use client";

import { useEffect, useState } from "react";

const items = [
  { href: "#nav-problem", label: "시작" },
  { href: "#nav-research", label: "리서치" },
  { href: "#nav-brand", label: "브랜드" },
  { href: "#nav-design", label: "디자인" },
  { href: "#nav-video", label: "영상" },
  { href: "#nav-method", label: "방법" },
  { href: "#nav-numbers", label: "결산" },
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
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        className="fixed left-5 top-5 z-[210] grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/50 backdrop-blur-xl transition-colors hover:border-[color:var(--color-key)]/70"
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
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[190]"
        style={{
          background: "rgba(0, 0, 0, 0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 480ms cubic-bezier(0.2, 1, 0.4, 1)",
        }}
      />

      <nav
        className="fixed inset-0 z-[200] flex items-center"
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
      >
        <ul className="w-full px-10 md:px-20 lg:px-28">
          {items.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block font-sans font-bold leading-[1.08] tracking-[-0.02em] text-white transition-colors duration-200 hover:text-[color:var(--color-key)]"
                style={{
                  fontSize: "clamp(2.6rem, 7.8vw, 7.5rem)",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(110%)",
                  transition: `opacity 640ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    open ? i * 55 + 140 : 0
                  }ms, transform 720ms cubic-bezier(0.2, 1, 0.4, 1) ${
                    open ? i * 55 + 140 : 0
                  }ms, color 200ms ease-out`,
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
