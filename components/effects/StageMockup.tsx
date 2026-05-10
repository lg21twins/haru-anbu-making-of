"use client";

import Image from "next/image";
import type { EvolutionStage } from "@/lib/evolution";

export function StageMockup({
  stage,
  large = false,
}: {
  stage: EvolutionStage;
  large?: boolean;
}) {
  const widthClass = large ? "max-w-[440px]" : "max-w-[230px]";
  const radiusClass = large ? "rounded-[44px]" : "rounded-[28px]";
  const innerRadius = large ? "rounded-[36px]" : "rounded-[22px]";
  const padClass = large ? "p-[10px]" : "p-2";
  const notchClass = large
    ? "h-[6px] w-24 top-[10px]"
    : "h-[5px] w-14 top-2";

  return (
    <div
      className={`relative mx-auto aspect-[9/19] w-full ${widthClass} ${radiusClass} ${padClass} border border-white/12 bg-[#04050a] shadow-[0_50px_120px_-40px_rgba(44,122,252,0.5)]`}
    >
      <div
        aria-hidden
        className={`absolute left-1/2 ${notchClass} z-10 -translate-x-1/2 rounded-full bg-black/80`}
      />
      <div
        className={`relative h-full w-full overflow-hidden ${innerRadius} bg-gradient-to-b from-[#0a0c11] to-[#11151c]`}
      >
        {stage.image ? (
          <Image
            src={stage.image}
            alt={`${stage.version} · ${stage.title}`}
            fill
            sizes="(min-width: 1024px) 460px, (min-width: 768px) 360px, 280px"
            className="object-cover"
            priority={false}
          />
        ) : (
          renderStage(stage)
        )}
      </div>
    </div>
  );
}

function renderStage(s: EvolutionStage): React.ReactNode {
  switch (s.version) {
    case "v1":
      return <V1Wire />;
    case "v2":
      return <V2Roles />;
    case "v3":
      return <V3Priority />;
    case "v4":
      return <V4Tone color={s.swatch} />;
    case "v5":
      return <V5Features />;
    case "v6":
      return <V6Pages />;
    case "v7":
      return <V7Glass />;
    case "v8":
      return <V8OpacityLock />;
    case "v9":
      return <V9Mascot />;
    case "v9.5":
      return <V95NurseSplit />;
    case "v10":
      return <V10ChatHub />;
    case "v11":
      return <V11Billing />;
    case "v12":
      return <V12Patient />;
    default:
      return null;
  }
}

const PaneTop = ({ time = "9:41" }: { time?: string }) => (
  <div className="flex items-center justify-between px-3 pt-4 pb-2 font-mono text-[8px] tracking-wider text-white/45">
    <span>{time}</span>
    <span>●●●</span>
  </div>
);

function V1Wire() {
  return (
    <div className="h-full bg-[#f4ece2] p-3 font-mono text-[9px] text-[#2a1f15]">
      <div className="flex justify-between text-[7px] tracking-[0.25em] opacity-50">
        <span>SKETCH</span>
        <span>v1</span>
      </div>
      <div className="mt-3 h-1.5 w-16 bg-[#2a1f15]/30" />
      <div className="mt-1 h-1.5 w-24 bg-[#2a1f15]/15" />
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-square border border-[#2a1f15]/40 bg-[#2a1f15]/5 p-1">
            <div className="h-1 w-6 bg-[#2a1f15]/30" />
            <div className="mt-1 h-1 w-full bg-[#2a1f15]/15" />
            <div className="mt-1 h-1 w-3/4 bg-[#2a1f15]/15" />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1 border-t border-[#2a1f15]/30 pt-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 bg-[#2a1f15]/20" />
        ))}
      </div>
    </div>
  );
}

function V2Roles() {
  const roles = [
    { name: "보호자", color: "#2c7afc" },
    { name: "간호사", color: "#7c4dff" },
    { name: "환자", color: "#00d4ff" },
  ];
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">3 ROLES · ONE APP</p>
      <div className="mt-3 space-y-2">
        {roles.map((r) => (
          <div
            key={r.name}
            className="rounded-md border border-white/10 bg-white/5 p-2.5"
            style={{ borderColor: `${r.color}55` }}
          >
            <span className="block h-1 w-6 rounded-full" style={{ background: r.color }} />
            <p className="mt-1.5 text-[10px] font-medium text-white">{r.name}</p>
            <div className="mt-1 h-1 w-full bg-white/10" />
            <div className="mt-1 h-1 w-2/3 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function V3Priority() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">PRIORITY · IA</p>
      <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-2.5">
        <p className="text-[8px] text-white/40">PRIMARY</p>
        <p className="mt-1 text-[11px] font-semibold text-white">오늘의 어머니 상태</p>
        <div className="mt-1.5 h-8 rounded bg-[#2c7afc]/30" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded border border-white/10 bg-white/5 p-1.5">
          <div className="h-1 w-5 bg-white/30" />
          <div className="mt-1 h-3 bg-white/10" />
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-1.5">
          <div className="h-1 w-5 bg-white/30" />
          <div className="mt-1 h-3 bg-white/10" />
        </div>
      </div>
      <div className="mt-2 h-2 w-full rounded bg-white/5" />
      <div className="mt-1 h-2 w-2/3 rounded bg-white/5" />
    </div>
  );
}

function V4Tone({ color }: { color: string }) {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: color, opacity: 0.95 }} />
      <div
        aria-hidden
        className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/30 blur-2xl"
      />
      <div className="relative h-full p-3">
        <PaneTop />
        <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/85">TONE · A</p>
        <h5 className="mt-3 font-display text-base font-semibold leading-tight text-white">
          Apple
          <br />
          Health
          <br />
          톤
        </h5>
        <div className="mt-4 inline-block rounded bg-white/15 px-2 py-1 font-mono text-[9px] text-white">
          #2C7AFC
        </div>
      </div>
    </div>
  );
}

function V5Features() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">13 FEATURES</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md border border-white/10 bg-white/5"
            style={{
              background: i < 9 ? "rgba(44,122,252,0.15)" : "rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-[8px] text-[#74a8ff]">9 차용 + 4 시그니처</p>
    </div>
  );
}

function V6Pages() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">26 PAGES</p>
      <div className="mt-3 grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-1"
          >
            <div className="h-1 w-3 bg-white/40" />
            <div className="mt-0.5 h-3 bg-white/15" />
            <div className="mt-0.5 h-0.5 bg-white/20" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-1 rounded-full border border-white/10 bg-black/40 p-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-full ${i === 0 ? "bg-white" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function V7Glass() {
  return (
    <div className="relative h-full overflow-hidden p-3">
      <div
        aria-hidden
        className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-[#2c7afc] opacity-60 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -right-6 bottom-12 h-24 w-24 rounded-full bg-[#74a8ff] opacity-40 blur-2xl"
      />
      <div className="relative">
        <PaneTop />
        <div className="mt-3 rounded-2xl border border-white/15 bg-white/[0.07] p-2.5 backdrop-blur-md">
          <p className="font-mono text-[7px] tracking-[0.25em] text-white/55">CARE</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-white">
            87
          </p>
          <div className="mt-2 h-0.5 w-full bg-white/15" />
        </div>
        <div className="mt-2 rounded-xl border border-white/15 bg-white/[0.07] p-2.5 backdrop-blur-md">
          <div className="h-1 w-12 bg-white/30" />
          <div className="mt-1 h-1 w-full bg-white/15" />
        </div>
      </div>
    </div>
  );
}

function V8OpacityLock() {
  return (
    <div className="relative h-full overflow-hidden p-3">
      <div
        aria-hidden
        className="absolute -left-6 top-12 h-24 w-24 rounded-full bg-[#2c7afc] opacity-50 blur-2xl"
      />
      <div className="relative">
        <PaneTop />
        <div className="mt-3 rounded-2xl border border-white/15 bg-white/[0.42] p-2.5 backdrop-blur-md">
          <p className="font-mono text-[7px] tracking-[0.3em] text-black/60">.lq</p>
          <p className="mt-1 font-mono text-[8px] text-black/85">opacity .42 / blur 24</p>
        </div>
        <div className="mt-2 rounded-2xl border border-white/15 bg-white/[0.42] p-2.5 backdrop-blur-md">
          <p className="font-mono text-[8px] text-black/85">동일 톤 · viewport 독립</p>
        </div>
        <p className="mt-2 font-mono text-[8px] text-emerald-300">PERF LOCKED</p>
      </div>
    </div>
  );
}

function V9Mascot() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#2c7afc] to-[#74a8ff]" />
        <div>
          <p className="text-[10px] font-medium text-white">하루 캐릭터</p>
          <p className="text-[8px] text-white/55">오늘 컨디션 좋아요</p>
        </div>
      </div>
      <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
        <p className="font-mono text-[8px] tracking-[0.25em] text-white/50">CARE SCORE</p>
        <p className="font-display text-2xl font-semibold tabular-nums text-white">
          87
          <span className="ml-1 text-[10px] text-emerald-300">▲4</span>
        </p>
      </div>
    </div>
  );
}

function V95NurseSplit() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">NURSE FORK</p>
      <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2">
        <div className="flex gap-1">
          <div className="h-1 w-4 bg-white/30" />
          <div className="h-1 w-3 bg-white/15" />
          <div className="h-1 w-3 bg-white/15" />
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-3 bg-white/10" />
          ))}
        </div>
      </div>
      <p className="mt-2 font-mono text-[8px] text-[#74a8ff]">desktop · mobile shared DS</p>
      <div className="mt-1 flex gap-1">
        <div className="h-6 flex-1 rounded border border-white/10 bg-white/5" />
        <div className="h-6 w-3 rounded border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}

function V10ChatHub() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">CHAT HUB</p>
      <div className="mt-2 space-y-1">
        {["AI 케어가이드", "간호사 박지현", "가족 단톡", "어머니 김순자"].map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 p-1.5"
          >
            <div className="h-3 w-3 rounded-full bg-[#2c7afc]/60" />
            <span className="text-[8px] text-white/85">{label}</span>
            {i === 0 && (
              <span className="ml-auto rounded bg-[#2c7afc] px-1 py-0.5 text-[7px] text-white">3</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 rounded-full border border-white/10 bg-black/40 p-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-full ${i === 2 ? "bg-white" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function V11Billing() {
  return (
    <div className="h-full p-3">
      <PaneTop />
      <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/50">BILLING · 5 ITEMS</p>
      <div className="mt-2 rounded-md border border-[#2c7afc]/40 bg-[#2c7afc]/10 p-2">
        <p className="text-[8px] text-[#74a8ff]">자동이체 D-3</p>
        <p className="mt-0.5 font-display text-base font-semibold text-white">372,000원</p>
      </div>
      <div className="mt-1.5 rounded-md border border-white/10 bg-white/5 p-2">
        <p className="text-[8px] text-white/50">한도 잔여</p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded bg-white/10">
          <div className="h-full w-[71%] bg-emerald-400/70" />
        </div>
        <p className="mt-1 text-[8px] text-white/60">71.7%</p>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        <div className="rounded border border-white/10 bg-white/5 p-1.5">
          <p className="text-[7px] text-white/40">변동</p>
          <p className="text-[8px] text-emerald-300">+30,000</p>
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-1.5">
          <p className="text-[7px] text-white/40">연납</p>
          <p className="text-[8px] text-white">4.68M</p>
        </div>
      </div>
    </div>
  );
}

function V12Patient() {
  return (
    <div className="h-full bg-[#fdfcf8] p-3 text-[#1d1410]">
      <div className="flex justify-between font-mono text-[7px] text-[#7a6a55]">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      <p className="mt-3 font-mono text-[8px] tracking-[0.3em] text-[#a3502c]">PATIENT · v12</p>
      <h5 className="mt-2 text-2xl font-bold leading-[1.05]">
        딸과
        <br />
        통화
      </h5>
      <button className="mt-3 w-full rounded-2xl bg-[#2c7afc] py-3 text-center text-base font-semibold text-white">
        연결
      </button>
      <div className="mt-2 rounded-2xl border-2 border-[#2a1f15]/15 bg-white p-2.5">
        <p className="text-base font-semibold leading-tight">오늘의 일정</p>
        <p className="mt-1 text-xs text-[#3a2c20]">10:00 식사</p>
        <p className="text-xs text-[#3a2c20]">14:00 산책</p>
      </div>
    </div>
  );
}
