"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: "lg" | "md";
  className?: string;
  style?: React.CSSProperties;
};

// 높이 기반으로 한 다음 9:19.5 비율로 가로 산출 → 뷰포트 안에 항상 들어옴
const sizes = {
  lg: {
    height: "min(72vh, 820px)",
    width: "min(calc(72vh * 9 / 19.5), calc(820px * 9 / 19.5), 78vw)",
  },
  md: {
    height: "min(60vh, 640px)",
    width: "min(calc(60vh * 9 / 19.5), calc(640px * 9 / 19.5), 64vw)",
  },
};

export function PhoneFrame({ children, size = "lg", className = "", style }: Props) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: sizes[size].width, height: sizes[size].height, ...style }}
    >
      <div
        className="absolute inset-0 rounded-[44px] md:rounded-[56px]"
        style={{
          background:
            "linear-gradient(135deg, #e8ecf0 0%, #c2c7cc 28%, #8d9298 62%, #b9bec3 88%, #d6dade 100%)",
          boxShadow:
            "0 24px 72px -18px rgba(126, 255, 141, 0.22), 0 56px 120px -14px rgba(0,0,0,0.75)",
        }}
      />
      <div
        className="absolute inset-[4px] rounded-[40px] bg-black md:inset-[5px] md:rounded-[52px]"
      />
      <div
        className="absolute inset-[10px] overflow-hidden rounded-[34px] bg-white md:inset-[12px] md:rounded-[44px]"
      >
        {children}
      </div>
    </div>
  );
}
