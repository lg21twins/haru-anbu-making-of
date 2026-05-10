"use client";

import { Scene } from "./Scene";
import { TypeText } from "./TypeText";

type Props = {
  id?: string;
  text: string;
  size?: "huge" | "large" | "medium";
};

const sizeMap = {
  huge: "clamp(2.6rem, 7vw, 6.5rem)",
  large: "clamp(2.2rem, 5.5vw, 5rem)",
  medium: "clamp(1.6rem, 3.4vw, 3rem)",
};

export function CommandScene({ id, text, size = "large" }: Props) {
  return (
    <Scene id={id} height="screen" bg="bg-black">
      <div className="w-full px-6 md:px-16">
        <p
          className="max-w-6xl font-mono leading-[1.18] text-white"
          style={{ fontSize: sizeMap[size] }}
        >
          <span className="text-[color:var(--color-key)]">&gt; </span>
          <TypeText text={text} speed={50} startDelay={350} />
        </p>
      </div>
    </Scene>
  );
}
