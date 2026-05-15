"use client";

import { TypeText } from "./TypeText";

type Props = {
  id?: string;
  text: string;
  size?: "huge" | "large" | "medium";
  font?: "sans" | "mono";
  color?: string;
  bg?: string;
  speed?: number;
  cursor?: boolean;
};

const sizeMap = {
  huge: "clamp(2.4rem, 7vw, 7rem)",
  large: "clamp(1.6rem, 4.2vw, 4.4rem)",
  medium: "clamp(1.3rem, 3vw, 3rem)",
};

export function LineScene({
  id,
  text,
  size = "huge",
  font = "sans",
  color = "text-white",
  bg = "bg-black",
  speed = 60,
  cursor = false,
}: Props) {
  return (
    <section
      id={id}
      className={`relative w-full ${bg}`}
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-16">
        <p
          className={`whitespace-nowrap text-center ${
            font === "mono" ? "font-mono" : "font-sans"
          } font-semibold leading-[1.02] tracking-tight ${color}`}
          style={{ fontSize: sizeMap[size] }}
        >
          <TypeText text={text} speed={speed} startDelay={300} cursor={cursor} />
        </p>
      </div>
    </section>
  );
}
