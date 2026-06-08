"use client";

import { ReactNode, RefObject } from "react";

type SceneProps = {
  children: ReactNode;
  id?: string;
  height?: "screen" | "tall" | "short" | "full";
  bg?: string;
  className?: string;
  align?: "center" | "start" | "end";
  innerRef?: RefObject<HTMLElement | null>;
};

const heightMap = {
  screen: "min-h-screen",
  tall: "min-h-[140vh]",
  short: "min-h-[60vh]",
  full: "h-screen",
};

const alignMap = {
  center: "items-center justify-center",
  start: "items-start justify-center pt-[14vh]",
  end: "items-end justify-center pb-[14vh]",
};

export function Scene({
  children,
  id,
  height = "screen",
  bg = "bg-black",
  className = "",
  align = "center",
  innerRef,
}: SceneProps) {
  return (
    <section
      id={id}
      ref={innerRef}
      className={`relative flex w-full ${heightMap[height]} ${alignMap[align]} ${bg} ${className}`}
    >
      {children}
    </section>
  );
}
