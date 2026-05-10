"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { OpeningPromptScene } from "@/components/scenes/OpeningPromptScene";
import { CommandScene } from "@/components/scenes/CommandScene";
import { LineScene } from "@/components/scenes/LineScene";
import { CountUpScene } from "@/components/scenes/CountUpScene";
import { FinalScene } from "@/components/scenes/FinalScene";

const PersonasInterlude = dynamic(
  () => import("@/components/scenes/PersonasInterlude").then((m) => m.PersonasInterlude)
);
const JtbdInterlude = dynamic(
  () => import("@/components/scenes/JtbdInterlude").then((m) => m.JtbdInterlude)
);
const MatrixInterlude = dynamic(
  () => import("@/components/scenes/MatrixInterlude").then((m) => m.MatrixInterlude)
);
const BlueOceanInterlude = dynamic(
  () => import("@/components/scenes/BlueOceanInterlude").then((m) => m.BlueOceanInterlude)
);
const FailuresInterlude = dynamic(
  () => import("@/components/scenes/FailuresInterlude").then((m) => m.FailuresInterlude)
);
const DesignIterationScene = dynamic(
  () =>
    import("@/components/scenes/DesignIterationScene").then(
      (m) => m.DesignIterationScene
    )
);
const LogoEvolutionScene = dynamic(
  () =>
    import("@/components/scenes/LogoEvolutionScene").then(
      (m) => m.LogoEvolutionScene
    )
);
const VideoScene = dynamic(
  () => import("@/components/scenes/VideoScene").then((m) => m.VideoScene),
  { ssr: false }
);

export function Scenes() {
  return (
    <main className="relative w-full bg-black text-white">
      <Suspense fallback={<div className="h-screen bg-black" />}>
        {/* 01 — 커서 → 스크롤하면 첫 프롬프트가 박힘 (sticky) */}
        <OpeningPromptScene />

        {/* 03 — 누구를 위해 */}
        <CommandScene
          id="s-cmd-who"
          text="누구를 위해 만들지부터 정해."
        />
        <PersonasInterlude />

        {/* 04 — 그들이 원하는 것 */}
        <CommandScene
          id="s-cmd-jtbd"
          text="그들이 진짜 원하는 게 뭔지 찾아내."
        />
        <JtbdInterlude />

        {/* 05 — 시장 */}
        <CommandScene
          id="s-cmd-market"
          text="시장에서 우리만 할 수 있는 게 뭔지도."
        />
        <MatrixInterlude />
        <BlueOceanInterlude />

        {/* 06 — 로고 대화: 5 prompts → 진짜 로고 */}
        <LogoEvolutionScene />

        {/* 07 — 디자인 시퀀스: 시작 prompt sticky + v1/v2/v3 + cascade + 이거야 + v13 */}
        <DesignIterationScene />

        {/* 자주 틀렸다 → 실패 갤러리 */}
        <LineScene
          id="s-wrong"
          text="근데 자주 틀렸다."
          size="huge"
          color="text-[color:var(--color-key)]"
        />
        <FailuresInterlude />

        {/* 영상까지 */}
        <CommandScene
          id="s-cmd-video"
          text="영상까지 가자."
          size="huge"
        />

        <VideoScene
          id="s-iter1"
          src="/media/video/iter1.mp4"
          src480="/media/video/iter1-480.mp4"
          poster="/media/poster/iter1.jpg"
          caption="‘Korean hospital, doctor running.' 한 줄로 만든 첫 결과. 미국식 인테리어가 나왔다."
        />

        <LineScene id="s-retry-iter2" text="다시." size="huge" />
        <VideoScene
          id="s-iter2"
          src="/media/video/iter2.mp4"
          src480="/media/video/iter2-480.mp4"
          poster="/media/poster/iter2.jpg"
          caption="‘301호 302호, 형광등, 백색 핸드레일.' 한국 디테일을 박자 분위기가 살았다."
        />

        <LineScene id="s-retry-iter3" text="다시." size="huge" />
        <VideoScene
          id="s-iter3"
          src="/media/video/iter3.mp4"
          src480="/media/video/iter3-480.mp4"
          poster="/media/poster/iter3.jpg"
          caption="@김미영 같은 AI 인플루언서 핸들로 캐스팅 고정. 컷 사이 인물 일치."
        />

        <CommandScene
          id="s-cmd-stop"
          text="4차에서 멈췄다."
          size="huge"
        />
        <VideoScene
          id="s-iter4"
          src="/media/video/iter4.mp4"
          src480="/media/video/iter4-480.mp4"
          poster="/media/poster/iter4.jpg"
          caption="렌즈/조명/카메라 워크까지. ‘talking animatedly'로 립싱크만 유도. 한국어 더빙은 후처리."
          hero
        />

        {/* 결 — 숫자 */}
        <CountUpScene
          id="s-count-1845"
          to={1845}
          suffix="줄의 대화."
          format={(n) => n.toLocaleString()}
          duration={2.2}
        />
        <CountUpScene
          id="s-count-76"
          to={76}
          suffix="번의 명령."
          duration={1.4}
        />
        <CountUpScene id="s-count-28" to={28} suffix="일." duration={1.2} />

        {/* 끝 */}
        <FinalScene />
      </Suspense>
    </main>
  );
}
