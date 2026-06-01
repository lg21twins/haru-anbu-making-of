"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { CloverLineScene } from "@/components/scenes/CloverLineScene";
import { OpeningPromptScene } from "@/components/scenes/OpeningPromptScene";
import { CommandScene } from "@/components/scenes/CommandScene";
import { LineScene } from "@/components/scenes/LineScene";
import { AutoStatsScene } from "@/components/scenes/AutoStatsScene";
import { FinalScene } from "@/components/scenes/FinalScene";
import { CreditsScene } from "@/components/scenes/CreditsScene";

const LogoEvolutionScene = dynamic(() =>
  import("@/components/scenes/LogoEvolutionScene").then(
    (m) => m.LogoEvolutionScene
  )
);
const CodeMaterializeScene = dynamic(() =>
  import("@/components/scenes/CodeMaterializeScene").then(
    (m) => m.CodeMaterializeScene
  )
);
const PromptGrammarScene = dynamic(() =>
  import("@/components/scenes/PromptGrammarScene").then(
    (m) => m.PromptGrammarScene
  )
);
const ChaosToOrderScene = dynamic(() =>
  import("@/components/scenes/ChaosToOrderScene").then(
    (m) => m.ChaosToOrderScene
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
        {/* 00 — 규모 폭격: 숫자 (12,236 / 612 / 228) */}
        <div id="nav-numbers" className="block" />
        <AutoStatsScene />

        {/* 01.5 — 전환: "저희에겐 네잎클로버가 있었거든요" */}
        <CloverLineScene />

        {/* 02 — 명령 */}
        <OpeningPromptScene />

        {/* === 증거 묶음: 브랜드 (메시지/로고 채팅) === */}
        <div id="nav-brand" className="block" />
        <LogoEvolutionScene />

        {/* === 그 뒤로 이어짐: 폴더가 시안을 쏟아냄 → 살아남은 하나 === */}
        <div id="nav-process" className="block" />
        <ChaosToOrderScene />

        {/* === 어떻게: 명령이 화면이 되는 순간 (정체성, 클라이맥스) === */}
        <CodeMaterializeScene />

        {/* === 영상 === */}
        <div id="nav-video" className="block" />
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

        {/* === 회고/방법: 근데 자주 틀렸다 → 우리가 자주 보낸 말들 === */}
        <div id="nav-method" className="block" />
        <LineScene
          id="s-wrong"
          text="근데 자주 틀렸다."
          size="huge"
          color="text-[color:var(--color-key)]"
        />
        <PromptGrammarScene />

        {/* 끝 — 타이틀 카드 + 영화 크레딧 */}
        <FinalScene />
        <CreditsScene />
      </Suspense>
    </main>
  );
}
