"use client";

import { TypeText } from "./TypeText";

type Props = {
  id?: string;
  text: string;
  size?: "huge" | "large" | "medium";
};

const sizeMap = {
  huge: "clamp(1.8rem, 4.6vw, 5rem)",
  large: "clamp(1.5rem, 3.8vw, 4rem)",
  medium: "clamp(1.2rem, 2.6vw, 2.6rem)",
};

export function CommandScene({ id, text, size = "large" }: Props) {
  return (
    <section
      id={id}
      className="relative w-full bg-black"
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-16">
        <p
          className="whitespace-nowrap font-mono leading-[1.18] text-white"
          style={{ fontSize: sizeMap[size] }}
        >
          <span className="text-[color:var(--color-key)]">&gt; </span>
          <TypeText text={text} speed={50} startDelay={350} />
        </p>
      </div>
    </section>
  );
}
