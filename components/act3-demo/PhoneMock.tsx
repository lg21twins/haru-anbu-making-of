"use client";

import { ReactNode } from "react";

export type PageKind =
  | "home"
  | "chat"
  | "report"
  | "alert"
  | "mypage";

export const PAGE_LABEL: Record<PageKind, string> = {
  home: "보호자 홈",
  chat: "AI 채팅",
  report: "일일 리포트",
  alert: "긴급 알림",
  mypage: "마이페이지",
};

/** 진화 단계 — Pattern B용 */
export type Stage = 0 | 1 | 2 | 3 | 4;

export function PhoneMock({
  page,
  stage = 4,
  scale = 1,
}: {
  page: PageKind;
  stage?: Stage;
  scale?: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[44px] border border-white/8 bg-[#f8fbff] text-[#111827]"
      style={{
        width: 280 * scale,
        height: 580 * scale,
        boxShadow:
          "0 24px 72px -18px rgba(255,255,255,.06), 0 56px 120px -14px rgba(0,0,0,.75)",
      }}
    >
      {/* notch */}
      <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

      {/* AI orb bg */}
      {stage >= 4 && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(280px, 100%)",
            height: "min(280px, 100%)",
            background:
              "radial-gradient(circle at 50% 32%, #1BE7EA 0%, rgba(70,195,230,.95) 38%, #46A8FF 72%, rgba(70,168,255,.3) 88%, transparent 100%)",
            filter: "blur(20px)",
            opacity: 0.7,
          }}
        />
      )}

      {/* content */}
      <div className="relative z-20 flex h-full flex-col px-5 pt-12">
        {page === "home" && <HomeContent stage={stage} />}
        {page === "chat" && <ChatContent stage={stage} />}
        {page === "report" && <ReportContent stage={stage} />}
        {page === "alert" && <AlertContent stage={stage} />}
        {page === "mypage" && <MyPageContent stage={stage} />}
      </div>
    </div>
  );
}

function Wire({ children, stage, on = 1 }: { children?: ReactNode; stage: Stage; on?: Stage }) {
  if (stage < on) {
    return (
      <div className="rounded-md border border-white/15 bg-white/[0.04]" style={{ height: 12 }} />
    );
  }
  return <>{children}</>;
}

function HomeContent({ stage }: { stage: Stage }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className={`h-7 w-7 rounded ${
            stage >= 3 ? "bg-[#2C7AFC]" : "bg-white/15"
          }`}
        />
        <div className="flex gap-1">
          <div className={`h-7 w-7 rounded-full ${stage >= 3 ? "bg-white/70" : "bg-white/10"}`} />
          <div className={`h-7 w-7 rounded-full ${stage >= 3 ? "bg-white/70" : "bg-white/10"}`} />
        </div>
      </div>
      <div className="mt-6">
        {stage >= 2 ? (
          <div
            className="font-semibold leading-[1.18]"
            style={{
              fontSize: 22,
              color: stage >= 3 ? "#2a1810" : "#9ca3af",
              letterSpacing: "-0.5px",
            }}
          >
            오늘도 수고하셨어요,
            <br />
            정희님 잘 있어요
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="h-5 w-3/4 rounded bg-white/15" />
            <div className="h-5 w-1/2 rounded bg-white/15" />
          </div>
        )}
        {stage >= 2 && (
          <div
            className="mt-2"
            style={{
              fontSize: 12,
              color: stage >= 3 ? "rgba(0,0,0,.5)" : "#6b7280",
            }}
          >
            저녁 일과도 잘 되고 있어요.
          </div>
        )}
      </div>
      <div className="mt-auto pb-4">
        <div
          className={`rounded-2xl ${
            stage >= 2 ? "bg-white/80" : "bg-white/[0.06]"
          } px-4 py-3`}
        >
          {stage >= 2 ? (
            <div className="grid grid-cols-2 gap-2">
              <div className={stage >= 3 ? "text-[#111827]" : "text-gray-500"}>
                <div className="text-[10px] opacity-60">투약</div>
                <div className="text-2xl font-extrabold tracking-tight">
                  33<span className="text-xs opacity-50">%</span>
                </div>
              </div>
              <div className={stage >= 3 ? "text-[#111827]" : "text-gray-500"}>
                <div className="text-[10px] opacity-60">맥박</div>
                <div className="text-2xl font-extrabold tracking-tight">
                  72<span className="text-xs opacity-50">BPM</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 rounded bg-white/15" />
              <div className="h-10 rounded bg-white/15" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatContent({ stage }: { stage: Stage }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {stage >= 2 ? (
        <div className="text-[15px] font-semibold text-[#111827]">AI 케어매니저</div>
      ) : (
        <div className="h-4 w-1/3 rounded bg-white/15" />
      )}
      <div className="mt-3 flex flex-col gap-2">
        <Wire stage={stage} on={2}>
          <div
            className="self-start max-w-[80%] rounded-2xl rounded-tl-none px-3 py-2 text-[12px]"
            style={{
              background: stage >= 3 ? "rgba(44,122,252,.12)" : "rgba(255,255,255,.06)",
              color: stage >= 3 ? "#111827" : "#9ca3af",
            }}
          >
            오늘 어머님 상태 어땠나요?
          </div>
        </Wire>
        <Wire stage={stage} on={2}>
          <div
            className="self-end max-w-[80%] rounded-2xl rounded-tr-none px-3 py-2 text-[12px] text-white"
            style={{
              background: stage >= 3 ? "#2C7AFC" : "rgba(255,255,255,.12)",
            }}
          >
            평소보다 식사를 적게 하셨어요. 추적 데이터 보내드릴게요.
          </div>
        </Wire>
        <Wire stage={stage} on={2}>
          <div
            className="self-start max-w-[80%] rounded-2xl rounded-tl-none px-3 py-2 text-[12px]"
            style={{
              background: stage >= 3 ? "rgba(44,122,252,.12)" : "rgba(255,255,255,.06)",
              color: stage >= 3 ? "#111827" : "#9ca3af",
            }}
          >
            처방 시간 알림 같이 보내드릴까요?
          </div>
        </Wire>
      </div>
      <div className="mt-auto pb-4">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 ${
            stage >= 3 ? "bg-white border border-black/5" : "bg-white/[0.06]"
          }`}
        >
          {stage >= 2 ? (
            <div className="flex-1 text-[11px] text-gray-400">메시지 입력</div>
          ) : (
            <div className="h-4 flex-1 rounded bg-white/15" />
          )}
          <div className={`h-7 w-7 rounded-full ${stage >= 3 ? "bg-[#2C7AFC]" : "bg-white/15"}`} />
        </div>
      </div>
    </div>
  );
}

function ReportContent({ stage }: { stage: Stage }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center justify-between">
        {stage >= 2 ? (
          <>
            <div className="text-[15px] font-extrabold text-[#111827]">일일 리포트</div>
            <div className="text-[11px] text-gray-400">5월 17일 (일)</div>
          </>
        ) : (
          <>
            <div className="h-4 w-1/3 rounded bg-white/15" />
            <div className="h-3 w-16 rounded bg-white/10" />
          </>
        )}
      </div>
      <div
        className={`overflow-hidden rounded-2xl ${
          stage >= 2 ? "bg-white" : "bg-white/[0.06]"
        }`}
      >
        <div
          className={`h-32 ${stage >= 3 ? "bg-gradient-to-b from-[#dfe6f0] to-[#c9d4e6]" : "bg-white/10"}`}
        />
        <div className="px-3 py-3">
          {stage >= 2 ? (
            <div className="text-[11px] font-semibold leading-[1.4] text-[#111827]">
              &ldquo;오전 산책 때 햇빛이 좋아서 한참 머무르셨어요.&rdquo;
            </div>
          ) : (
            <>
              <div className="h-3 w-full rounded bg-white/15" />
              <div className="mt-1 h-3 w-4/5 rounded bg-white/15" />
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={`rounded-xl ${stage >= 2 ? "bg-white" : "bg-white/[0.06]"} p-3`}>
          {stage >= 2 ? (
            <>
              <div className="text-[10px] text-gray-500">투약</div>
              <div className="text-xl font-extrabold tracking-tight text-[#111827]">33%</div>
            </>
          ) : (
            <div className="h-10 rounded bg-white/10" />
          )}
        </div>
        <div className={`rounded-xl ${stage >= 2 ? "bg-white" : "bg-white/[0.06]"} p-3`}>
          {stage >= 2 ? (
            <>
              <div className="text-[10px] text-gray-500">맥박</div>
              <div className="text-xl font-extrabold tracking-tight text-[#111827]">72BPM</div>
            </>
          ) : (
            <div className="h-10 rounded bg-white/10" />
          )}
        </div>
      </div>
    </div>
  );
}

function AlertContent({ stage }: { stage: Stage }) {
  return (
    <div className="flex flex-1 flex-col">
      {stage >= 2 ? (
        <div className="text-[15px] font-extrabold text-[#111827]">알림</div>
      ) : (
        <div className="h-4 w-1/4 rounded bg-white/15" />
      )}
      <div className="mt-4 flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-2xl ${
              stage >= 2 ? "bg-white" : "bg-white/[0.06]"
            } p-3`}
          >
            <div
              className={`h-9 w-9 flex-shrink-0 rounded-full ${
                stage >= 3 ? (i === 0 ? "bg-[#FF3B30]" : "bg-[#2C7AFC]/15") : "bg-white/10"
              }`}
            />
            <div className="flex-1">
              {stage >= 2 ? (
                <>
                  <div className="text-[11px] font-bold text-[#111827]">
                    {i === 0 ? "맥박 이상 감지" : i === 1 ? "투약 시간" : "리포트 도착"}
                  </div>
                  <div className="text-[10px] text-gray-500">방금 전</div>
                </>
              ) : (
                <>
                  <div className="h-3 w-2/3 rounded bg-white/15" />
                  <div className="mt-1 h-2 w-1/4 rounded bg-white/10" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyPageContent({ stage }: { stage: Stage }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-4">
      <div
        className={`h-20 w-20 rounded-full ${
          stage >= 3 ? "bg-gradient-to-br from-[#2C7AFC] to-[#74a8ff]" : "bg-white/10"
        }`}
      />
      {stage >= 2 ? (
        <>
          <div className="text-[15px] font-extrabold text-[#111827]">김지욱</div>
          <div className="text-[11px] text-gray-500">정희님의 보호자</div>
        </>
      ) : (
        <>
          <div className="h-4 w-16 rounded bg-white/15" />
          <div className="h-3 w-24 rounded bg-white/10" />
        </>
      )}
      <div className="mt-2 flex w-full flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl ${
              stage >= 2 ? "bg-white" : "bg-white/[0.06]"
            } px-3 py-2.5`}
          >
            {stage >= 2 ? (
              <>
                <div className="text-[11px] text-[#111827]">
                  {["계정", "알림 설정", "결제", "고객 지원"][i]}
                </div>
                <div className="text-[10px] text-gray-400">›</div>
              </>
            ) : (
              <div className="h-3 w-1/2 rounded bg-white/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
