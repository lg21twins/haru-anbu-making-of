"use client";

import { ReactNode } from "react";

type SceneProps = {
  children: ReactNode;
  id?: string;
  height?: "screen" | "tall" | "short" | "full";
  bg?: string;
  className?: string;
  align?: "center" | "start" | "end";
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
}: SceneProps) {
  return (
    <section
      id={id}
      className={`relative flex w-full ${heightMap[height]} ${alignMap[align]} ${bg} ${className}`}
    >
      {children}
    </section>
  );
}
