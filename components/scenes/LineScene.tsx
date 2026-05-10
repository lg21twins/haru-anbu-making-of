"use client";

import { Scene } from "./Scene";
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
  huge: "clamp(3rem, 9vw, 9rem)",
  large: "clamp(2.4rem, 6vw, 5.5rem)",
  medium: "clamp(1.8rem, 4vw, 3.6rem)",
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
    <Scene id={id} height="screen" bg={bg}>
      <div className="w-full px-6 md:px-16">
        <p
          className={`text-center ${font === "mono" ? "font-mono" : "font-sans"} font-semibold leading-[1.02] tracking-tight ${color}`}
          style={{ fontSize: sizeMap[size] }}
        >
          <TypeText text={text} speed={speed} startDelay={300} cursor={cursor} />
        </p>
      </div>
    </Scene>
  );
}
