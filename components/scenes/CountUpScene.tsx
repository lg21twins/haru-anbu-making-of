"use client";

import { Scene } from "./Scene";
import { CountUp } from "@/components/effects/CountUp";

type Props = {
  id?: string;
  to: number;
  suffix: string;
  prefix?: string;
  format?: (n: number) => string;
  duration?: number;
};

export function CountUpScene({ id, to, suffix, prefix, format, duration = 1.8 }: Props) {
  return (
    <Scene id={id} height="screen" bg="bg-black">
      <div className="w-full px-6 text-center md:px-16">
        <p
          className="font-sans font-semibold leading-[0.95] tracking-tight text-white"
          style={{ fontSize: "clamp(4rem, 14vw, 14rem)" }}
        >
          {prefix && <span className="text-white/40">{prefix}</span>}
          <CountUp to={to} duration={duration} format={format} className="tabular-nums" />
        </p>
        <p
          className="mt-6 font-mono leading-tight text-white/60"
          style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
        >
          {suffix}
        </p>
      </div>
    </Scene>
  );
}
