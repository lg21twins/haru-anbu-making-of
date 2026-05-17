"use client";

import { useEffect, useRef, useState } from "react";

export function CompletedDesignsScene() {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full bg-black"
      style={{ height: "100vh" }}
    >
      <div
        className="relative h-full w-full overflow-hidden border-y border-white/10 bg-white/[0.02]"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(24px)",
          transition:
            "opacity 820ms cubic-bezier(0.2,1,0.4,1), transform 820ms cubic-bezier(0.2,1,0.4,1)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 14px)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/[0.04] md:h-20 md:w-20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-white/65 md:h-9 md:w-9"
            >
              <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
            </svg>
          </div>
          <p
            className="font-sans font-semibold text-white"
            style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)" }}
          >
            제작한 영상이 들어갈 부분
          </p>
        </div>
      </div>
    </section>
  );
}
