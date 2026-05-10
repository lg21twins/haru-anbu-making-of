"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { LogEntry } from "@/lib/parseLog";

const Ch00ColdOpen = dynamic(
  () => import("@/components/chapters/Ch00ColdOpen").then((m) => m.Ch00ColdOpen),
  { ssr: false }
);
const Ch01Personas = dynamic(
  () => import("@/components/chapters/Ch01Personas").then((m) => m.Ch01Personas)
);
const Ch02Workbench = dynamic(
  () => import("@/components/chapters/Ch02Workbench").then((m) => m.Ch02Workbench)
);
const Ch03Research = dynamic(
  () => import("@/components/chapters/Ch02Research").then((m) => m.Ch02Research)
);
const Ch04Evolution = dynamic(
  () => import("@/components/chapters/Ch03Evolution").then((m) => m.Ch03Evolution)
);
const Ch05Toolbox = dynamic(
  () => import("@/components/chapters/Ch04AIToolbox").then((m) => m.Ch04AIToolbox)
);
const Ch06Higgsfield = dynamic(
  () => import("@/components/chapters/Ch05Higgsfield").then((m) => m.Ch05Higgsfield),
  { ssr: false }
);
const Ch07Failures = dynamic(
  () => import("@/components/chapters/Ch07Failures").then((m) => m.Ch07Failures)
);
const Ch08PromptLog = dynamic(
  () => import("@/components/chapters/Ch06PromptLog").then((m) => m.Ch06PromptLog),
  { ssr: false }
);
const Ch09Closing = dynamic(
  () => import("@/components/chapters/Ch09Closing").then((m) => m.Ch09Closing)
);

export function ChaptersClient({ entries }: { entries: LogEntry[] }) {
  return (
    <main className="relative w-full">
      <Suspense fallback={<div className="h-screen bg-black" />}>
        <Ch00ColdOpen />
        <Ch01Personas />
        <Ch02Workbench />
        <Ch03Research />
        <Ch04Evolution />
        <Ch05Toolbox />
        <Ch06Higgsfield />
        <Ch07Failures />
        <Ch08PromptLog entries={entries} />
        <Ch09Closing />
      </Suspense>
    </main>
  );
}
