"use client";

import { useRef } from "react";
import { TypeText } from "./TypeText";
import { useSpaceGate } from "@/lib/useSpaceGate";

type Props = {
  id?: string;
  text: string;
  size?: "huge" | "large" | "medium";
  fontSize?: string; // 지정 시 size 프리셋 대신 이 값 사용
  gate?: boolean; // 발표용 스페이스바 게이트(다음 섹션으로 이동)
};

const sizeMap = {
  huge: "clamp(1.8rem, 4.6vw, 5rem)",
  large: "clamp(1.5rem, 3.8vw, 4rem)",
  medium: "clamp(1.2rem, 2.6vw, 2.6rem)",
};

export function CommandScene({ id, text, size = "large", fontSize, gate }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  useSpaceGate(sectionRef, { gate, steps: 1 });
  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full bg-black"
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-16">
        <p
          className="whitespace-nowrap font-mono leading-[1.18] text-white"
          style={{ fontSize: fontSize ?? sizeMap[size] }}
        >
          <span className="text-[color:var(--color-key)]">&gt; </span>
          <TypeText text={text} speed={50} startDelay={350} />
        </p>
      </div>
    </section>
  );
}
