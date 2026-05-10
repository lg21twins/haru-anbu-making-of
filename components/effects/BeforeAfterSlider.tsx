"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  initial?: number;
};

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  className = "",
  initial = 50,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(initial);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      try {
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      } catch {}
      setFromClientX(e.clientX);
      ref.current?.focus();
    },
    [setFromClientX]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    },
    [setFromClientX]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - (e.shiftKey ? 10 : 4)));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + (e.shiftKey ? 10 : 4)));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  }, []);

  useEffect(() => {
    return () => {
      draggingRef.current = false;
    };
  }, []);

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Before / After 비교 슬라이더"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      data-cursor="link"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={`relative touch-none select-none overflow-hidden rounded-2xl border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-pale)] ${className}`}
      style={{ touchAction: "none", cursor: "ew-resize" }}
    >
      <div className="relative">{after}</div>

      <div
        className="absolute inset-0 will-change-[clip-path]"
        style={{ clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)` }}
      >
        {before}
      </div>

      <div
        className="pointer-events-none absolute top-0 z-10 h-full w-px bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white backdrop-blur-md">
          <span className="font-mono text-lg leading-none">⇆</span>
        </div>
      </div>

      <span className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-white/80 backdrop-blur-md">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-white/80 backdrop-blur-md">
        {afterLabel}
      </span>

      <span className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-white/60 backdrop-blur-md">
        DRAG · ← → KEY
      </span>
    </div>
  );
}
