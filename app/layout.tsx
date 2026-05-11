import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { NoiseLayer } from "@/components/effects/NoiseLayer";
import { HamburgerNav } from "@/components/nav/HamburgerNav";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "하루안부 — Making Of",
  description:
    "AI로 만든 시니어 케어 앱 하루안부의 제작 과정. 1,845줄의 대화로그, 12단계 디자인 진화, Higgsfield 4차 영상.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={jetbrains.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body>
        <ReducedMotionProvider>
          <LenisProvider>
            <CustomCursor />
            <NoiseLayer />
            <HamburgerNav />
            {children}
          </LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
