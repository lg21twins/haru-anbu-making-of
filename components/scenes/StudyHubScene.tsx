"use client";

import { useRef, useState } from "react";
import { useSpaceGate } from "@/lib/useSpaceGate";

// 스터디 허브로 넘기는 씬 — 엔딩 크레딧 뒤, 이 사이트의 마지막 화면이다.
//
// 앞선 FieldScene 이 "그럼 그 도구를, 어떻게 활용하면 될까요?" 로 청중에게 질문을
// 넘기고, 이 씬이 그 답이다. 다만 질문 바로 뒤가 아니라 크레딧 다음에 둔다 —
// 중간에 두면 "관련 링크" 로 축소되고, FIN 뒤에 두면 기록을 끝까지 본 사람에게
// 건네는 마지막 말이 된다.
//
// 3비트. 다른 씬과 같은 제스처(스크롤·엔터)로 넘어간다.
//   0 답 한 줄 → 1 허브 카드 + 버튼 → 2 참여 QR
// 뒤에 오는 씬이 없으므로 마지막 비트가 곧 사이트의 끝이다.
// 마지막을 QR 로 두는 이유: 발표장에서 링크를 받아 적을 방법이 없다.
const BEATS = 3;
const EASE = "cubic-bezier(0.2,1,0.4,1)";

// 배포본은 라이브 주소를 쓴다. USB 오프라인 번들은 빌드 때 이 URL 을
// 같은 USB 안의 로컬 사본(../how_can_i/index.html)으로 치환한다 —
// 그래서 이 상수는 한 곳에만 두고 문자열을 쪼개지 않는다.
const HUB_URL = "https://ai-design-studio-eight.vercel.app";

// 참여 QR. public/ 에 두고 다른 에셋과 같은 규칙(/making_of/…)으로 부른다 —
// 오프라인 번들 빌드가 이 접두사를 상대경로로 바꿔준다.
const QR_SRC = "/making_of/qr/aim-join.svg";

function reveal(on: boolean, delayMs = 0) {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 620ms ${EASE} ${delayMs}ms, transform 660ms ${EASE} ${delayMs}ms`,
  };
}

function Beat({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ ...reveal(on), pointerEvents: on ? "auto" : "none" }}
    >
      {children}
    </div>
  );
}

export function StudyHubScene({ gate }: { gate?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);

  useSpaceGate(sectionRef, { gate, steps: BEATS, onStep: (i) => setBeat(i) });

  return (
    <section
      ref={sectionRef}
      id="s-study-hub"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      <div className="relative h-full w-full">
        {/* ── 0 · 답 ─────────────────────────────────────────────── */}
        <Beat on={beat === 0}>
          <p
            className="font-sans font-semibold leading-[1.25] tracking-tight text-white"
            style={{ fontSize: "clamp(1.6rem, 4.6vw, 3.8rem)" }}
          >
            그래서 그 방법을,
            <br />
            <span className="text-[var(--color-accent-green)]">하나의 웹</span>에 정리해봤습니다.
          </p>
        </Beat>

        {/* ── 1 · 허브 카드 + 버튼 ───────────────────────────────── */}
        {/* 카드에 테두리를 두르지 않는다: 이 사이트는 검은 바닥 위 여백으로
            덩어리를 나눠 왔고, 여기만 상자를 치면 이 씬이 배너처럼 읽힌다. */}
        <Beat on={beat === 1}>
          <span
            className="text-[var(--color-accent-green)]"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "clamp(0.72rem, 1.6vw, 0.9rem)",
              letterSpacing: "0.14em",
            }}
          >
            AI DESIGN STUDIO · STUDY HUB
          </span>

          <p
            className="mt-5 font-sans font-extrabold leading-[1.15] tracking-tight text-white"
            style={{ fontSize: "clamp(1.7rem, 5vw, 4.2rem)" }}
          >
            AI에게 맡기는 법보다,
            <br />
            AI를 이끄는 법.
          </p>

          <p
            className="mt-6 font-sans leading-[1.6] text-white/70"
            style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)" }}
          >
            Codex와 Claude Code로 배우는 바이브 코딩과 포트폴리오 디렉팅.
            <br className="hidden sm:block" /> 3차시 · 34개 모듈.
          </p>

          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener"
            className="mt-10 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-sans font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
            style={{
              background: "var(--color-accent-green)",
              fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
            }}
          >
            스터디 허브 열기
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </Beat>

        {/* ── 2 · 참여 QR ────────────────────────────────────────── */}
        {/* QR 은 흰 여백(quiet zone)을 스스로 갖고 있어서 검은 바닥 위에
            그대로 올려도 인식된다. 따로 판을 깔지 않는다. */}
        <Beat on={beat === 2}>
          <span
            className="text-[var(--color-accent-green)]"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "clamp(0.72rem, 1.6vw, 0.9rem)",
              letterSpacing: "0.14em",
            }}
          >
            AI DESIGN STUDIO · JOIN
          </span>

          <p
            className="mt-5 font-sans font-bold leading-[1.2] tracking-tight text-white"
            style={{ fontSize: "clamp(1.3rem, 3.4vw, 2.6rem)" }}
          >
            여기서 같이 하시죠.
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_SRC}
            alt="AI 디자인 스튜디오 참여 QR 코드"
            className="mt-9 rounded-2xl"
            style={{ width: "clamp(180px, 24vw, 280px)", height: "auto" }}
          />

          <p
            className="mt-7 font-sans leading-[1.6] text-white/60"
            style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)" }}
          >
            카메라로 비추면 바로 열립니다.
          </p>
        </Beat>
      </div>
    </section>
  );
}
