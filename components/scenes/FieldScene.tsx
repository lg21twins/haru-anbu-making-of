"use client";

import { useRef, useState } from "react";
import { useSpaceGate } from "@/lib/useSpaceGate";

// KHF 2026 현장 검증 — 제작 과정(Method)과 마무리("하루안부.") 사이에 놓인다.
//
// 이 앞까지 사이트는 "우리가 AI와 어떻게 만들었나"만 말한다. 전부 내부 공정이라
// "그래서 그 방향이 맞았나"에 대한 답이 없다. 이 씬이 그 답이고, 그래서 제작 과정을
// 전부 보여준 "뒤"에 온다. 앞에 두면 참고한 리서치 자료로 축소된다.
//
// 6비트. 스크롤 제스처·엔터 어느 쪽으로도 한 비트씩 넘어간다(useSpaceGate).
//   0 질문 → 1 현장 → 2 누가 → 3 답 → 4 결론 → 5 청중에게 넘기는 질문
// 마지막 비트에서 한 번 더 진행하면 다음 섹션("하루안부.")으로 나간다.
const BEATS = 6;
const EASE = "cubic-bezier(0.2,1,0.4,1)";

// 사진 원본 두 장(현장·배지)에서 크롭을 떠 네 장으로 쓴다.
// 전부 흑백으로 깔린다 — 두 장 다 KHF 브랜드 레드가 화면을 지배하는데
// 이 사이트의 유일한 강조색은 그린이라, 원색 그대로면 이 씬만 톤이 튄다.
const BACKDROPS = [
  { src: "khf-hall.webp", beats: [0, 3], dim: [0.16, 0.26] },
  { src: "khf-badges.webp", beats: [2], dim: [0.44] },
  { src: "khf-badge-detail.webp", beats: [5], dim: [0.2] },
] as const;

function reveal(on: boolean, delayMs = 0) {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 620ms ${EASE} ${delayMs}ms, transform 660ms ${EASE} ${delayMs}ms`,
  } as const;
}

export function FieldScene({ gate }: { gate?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);

  useSpaceGate(sectionRef, { gate, steps: BEATS, onStep: (i) => setBeat(i) });

  // 사진이 깔린 비트에서만 딤을 얹어 타이포 가독성을 지킨다
  const hasBackdrop = BACKDROPS.some((b) => (b.beats as readonly number[]).includes(beat));

  return (
    <section
      ref={sectionRef}
      id="nav-field"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      {/* ── 배경 사진 ────────────────────────────────────────────────
          next/image 를 쓰지 않는다: 이미 손으로 webp 최적화를 마쳤고, 무엇보다
          이건 발표 자료다. 발표 도중 사진이 늦게 뜨는 것보다 페이지 로드 때
          미리 받아두는 편이 낫다 — loading 기본값(eager)을 그대로 둔다. */}
      {/* eslint-disable @next/next/no-img-element */}
      {BACKDROPS.map(({ src, beats, dim }) => {
        const at = (beats as readonly number[]).indexOf(beat);
        return (
          <img
            key={src}
            src={`/making_of/media/khf/${src}`}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: at >= 0 ? dim[at] : 0,
              filter: "grayscale(1) contrast(1.05)",
              transition: `opacity 900ms ${EASE}`,
            }}
          />
        );
      })}
      <div
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: hasBackdrop ? 0.4 : 0, transition: `opacity 900ms ${EASE}` }}
      />

      <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
        {/* ── 0 · 질문 ───────────────────────────────────────────── */}
        <div className="absolute" style={reveal(beat === 0)}>
          <p
            className="font-sans font-semibold leading-[1.25] tracking-tight text-white"
            style={{ fontSize: "clamp(1.6rem, 4.6vw, 3.8rem)" }}
          >
            AI와 한 학기.
            <br />
            여기까지 왔습니다.
          </p>
          <p
            className="mt-8 font-sans font-medium leading-[1.3] tracking-tight text-white/65"
            style={{ fontSize: "clamp(1.15rem, 2.8vw, 2.2rem)" }}
          >
            그런데 이게, 학생 셋의 <span className="font-semibold text-white">착각</span>은
            아닐까요?
          </p>
        </div>

        {/* ── 1 · 현장 — 배너 사진이 곧 카피다. 같은 문구를 타이포로 겹쳐 쓰지 않는다 ── */}
        <div className="absolute w-full max-w-[92rem]" style={reveal(beat === 1)}>
          <img
            src="/making_of/media/khf/khf-banner.webp"
            alt="KHF 2026 현장 배너 — The Intelligent Hospital, AX와 로보틱스가 이끄는 병원 혁신"
            className="w-full"
            style={{ filter: "grayscale(1) contrast(1.08)" }}
          />
          <p
            className="mt-8 font-mono uppercase text-white/45"
            style={{ fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)", letterSpacing: "0.18em" }}
          >
            KHF 2026 · COEX · 8.19–21
          </p>
        </div>
        {/* eslint-enable @next/next/no-img-element */}

        {/* ── 2 · 누가 갔나 ──────────────────────────────────────── */}
        <div className="absolute" style={reveal(beat === 2)}>
          <p
            className="font-sans font-semibold leading-[1.25] tracking-tight text-white"
            style={{ fontSize: "clamp(1.5rem, 4.2vw, 3.4rem)" }}
          >
            계원예술대학교 학생 셋.
          </p>
          <p
            className="mt-6 font-sans font-medium leading-[1.35] tracking-tight text-white/70"
            style={{ fontSize: "clamp(1.05rem, 2.6vw, 2rem)" }}
          >
            한 학기 동안 AI와 만든 것을 들고 갔다.
          </p>
        </div>

        {/* ── 3 · 확인한 것 (한 줄씩 쌓인다) ──────────────────────── */}
        <div
          className="absolute max-w-[54rem]"
          style={{ opacity: beat === 3 ? 1 : 0, transition: `opacity 400ms ${EASE}` }}
        >
          {[
            {
              id: "same-problem",
              line: (
                <>
                  현장이 말하는 문제는,
                  <br className="sm:hidden" /> 우리가 본 문제와 같았다.
                </>
              ),
            },
            {
              id: "they-too",
              line: (
                <>
                  그들도 이미,{" "}
                  <span className="text-[var(--color-accent-green)]">AI를 활용해</span> 만들고
                  있었다.
                </>
              ),
            },
            {
              id: "not-delusion",
              line: <span className="font-semibold text-white">착각은 아니었다.</span>,
            },
          ].map(({ id, line }, i) => (
            <p
              key={id}
              className="font-sans font-medium leading-[1.4] tracking-tight text-white/80"
              style={{
                fontSize: "clamp(1.15rem, 3vw, 2.4rem)",
                marginTop: i === 0 ? 0 : "1.6rem",
                ...reveal(beat === 3, i * 520),
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* ── 4 · 결론 — 유일하게 사진 없는 비트. 검정 위 타이포만 남긴다 ── */}
        <div className="absolute" style={reveal(beat === 4)}>
          <p
            className="font-sans font-extrabold leading-[1.15] tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            AI는 80%까지.
            <br />
            마무리는 사람이.
          </p>
        </div>

        {/* ── 5 · 청중에게 넘기는 질문 (강연에서 Q&A 진입점) ──────── */}
        <div className="absolute" style={reveal(beat === 5)}>
          <p
            className="font-sans font-semibold leading-[1.25] tracking-tight text-white"
            style={{ fontSize: "clamp(1.6rem, 4.6vw, 3.8rem)" }}
          >
            그럼 그 80%를,
            <br />
            어떻게 <span className="text-[var(--color-accent-green)]">활용</span>하면 될까요?
          </p>
        </div>
      </div>
    </section>
  );
}
