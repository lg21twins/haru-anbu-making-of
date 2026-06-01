"use client";

import { useEffect, useRef, useState } from "react";

/** 자동 타이핑 — 글자 단위로 채워지고 끝나면 onDone */
export function Typed({
  text,
  msPerChar = 38,
  startDelay = 0,
  className,
  style,
  onDone,
  caret = true,
}: {
  text: string;
  msPerChar?: number;
  startDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  onDone?: () => void;
  caret?: boolean;
}) {
  const [n, setN] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setN(0);
    let i = 0;
    let interval: number | undefined;
    const startId = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) {
          window.clearInterval(interval);
          onDoneRef.current?.();
        }
      }, msPerChar);
    }, startDelay);
    return () => {
      window.clearTimeout(startId);
      if (interval) window.clearInterval(interval);
    };
  }, [text, msPerChar, startDelay]);

  return (
    <span className={className} style={style}>
      {text.slice(0, n)}
      {caret && <span className="caret" aria-hidden />}
    </span>
  );
}
