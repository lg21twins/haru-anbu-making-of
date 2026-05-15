"use client";

import { useEffect, useRef, useState } from "react";

type Msg = {
  role: "me" | "ai";
  text: string;
  attempt?: 1 | 2 | 3 | 4 | 5;
};

const messages: Msg[] = [
  { role: "me", text: "우리 기획서를 가지고 로고 만들어봐." },
  {
    role: "ai",
    text:
      "네. 하루안부의 핵심 가치 '연결'을 시각화해서 4개 노드가 사선으로 이어지는 다이어그램으로 만들어봤습니다.",
    attempt: 1,
  },
  { role: "me", text: "아니, 이건 로고가 아니라 다이어그램이잖아. 다시." },
  {
    role: "ai",
    text:
      "네. 친근감을 위해 시니어 캐릭터 일러스트를 중앙에 배치해봤습니다.",
    attempt: 2,
  },
  { role: "me", text: "캐릭터 같아. 의료 신뢰감이 없어. 다시." },
  {
    role: "ai",
    text: "네. 의료 십자가 + 하트 + 가족 실루엣을 합쳐서 만들었습니다.",
    attempt: 3,
  },
  { role: "me", text: "색이 너무 많아 무거워. 단순하게 다시." },
  {
    role: "ai",
    text: "네. 단일 곡선으로 사람과 사람을 잇는 모양만 남겼습니다.",
    attempt: 4,
  },
  { role: "me", text: "기능 그대로네. 시그니처 한 곡선으로 가자." },
  {
    role: "ai",
    text:
      "네. '안부'의 ㅎ에서 영감을 받아 한 번에 그리는 곡선 심볼로 단순화했습니다.",
    attempt: 5,
  },
];

function AttemptPreview({ kind }: { kind: 1 | 2 | 3 | 4 | 5 }) {
  if (kind === 5) return <FinalLogo />;
  return (
    <img
      src={`/media/logo/attempt-${kind}.png`}
      alt=""
      className="h-full w-full object-contain"
      draggable={false}
    />
  );
}

function FinalLogo() {
  return (
    <img
      src="/media/logo/final.svg"
      alt="하루안부"
      className="h-full w-full object-contain"
      draggable={false}
    />
  );
}

function BigBubble({ msg, state }: { msg: Msg; state: "prev" | "active" | "next" }) {
  const isMe = msg.role === "me";
  const isActive = state === "active";
  return (
    <div
      className={`absolute inset-0 flex items-center px-6 md:px-12 ${
        isMe ? "justify-end" : "justify-start"
      }`}
      style={{
        opacity: isActive ? 1 : 0,
        transform:
          state === "active"
            ? "translateY(0)"
            : state === "prev"
            ? "translateY(-30px)"
            : "translateY(30px)",
        transition:
          "opacity 540ms cubic-bezier(0.2, 1, 0.4, 1), transform 640ms cubic-bezier(0.2, 1, 0.4, 1)",
        pointerEvents: "none",
      }}
    >
      <div
        className={`relative w-full max-w-3xl rounded-3xl px-7 py-6 font-sans md:px-10 md:py-8 ${
          isMe
            ? "bg-[color:var(--color-key)] text-black"
            : "border border-white/12 bg-white/[0.05] text-white/95 backdrop-blur"
        }`}
      >
        <p
          className="leading-snug"
          style={{ fontSize: "clamp(1.35rem, 2.6vw, 2.1rem)" }}
        >
          {msg.text}
        </p>
        {msg.attempt && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 md:p-7">
            <div className="mx-auto aspect-square w-[44vh] max-w-[420px]">
              <AttemptPreview kind={msg.attempt} />
            </div>
            <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.28em] text-white/45 md:text-sm">
              attempt 0{msg.attempt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function LogoEvolutionScene() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, Math.min(range, -rect.top));
      const progress = range > 0 ? scrolled / range : 0;
      setP(progress);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  // 채팅 구간: p 0~0.6 사이를 messages.length 등분, 각 메시지 한 슬롯씩 표시
  const chatEnd = 0.6;
  const t = Math.max(0, Math.min(1, p / chatEnd));
  const activeIdx = Math.min(
    messages.length - 1,
    Math.floor(t * messages.length)
  );

  const chatOpacity = p < chatEnd - 0.02 ? 1 : Math.max(0, 1 - (p - (chatEnd - 0.02)) / 0.04);
  const igeodaOpacity =
    p < 0.65
      ? 0
      : p < 0.72
      ? (p - 0.65) / 0.07
      : p < 0.8
      ? 1
      : Math.max(0, 1 - (p - 0.8) / 0.04);
  const logoOpacity = p < 0.8 ? 0 : Math.min(1, (p - 0.8) / 0.04);
  const zoomP = Math.max(0, Math.min(1, (p - 0.88) / 0.12));
  const logoScale = 1 + zoomP * 14;
  const blueOpacity = Math.max(0, Math.min(1, (p - 0.9) / 0.1));

  return (
    <section ref={ref} className="relative w-full" style={{ height: "1100vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        {/* 채팅 — 한 번에 한 메시지만 크게 */}
        <div
          className="absolute inset-0"
          style={{
            opacity: chatOpacity,
            transition: "opacity 400ms ease-out",
          }}
        >
          {messages.map((m, i) => {
            const state: "prev" | "active" | "next" =
              i === activeIdx ? "active" : i < activeIdx ? "prev" : "next";
            return <BigBubble key={i} msg={m} state={state} />;
          })}
        </div>

        {/* "이거다." */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: igeodaOpacity, pointerEvents: "none" }}
        >
          <p
            className="font-sans font-bold text-white"
            style={{
              fontSize: "clamp(3rem, 10vw, 10rem)",
              letterSpacing: "-0.02em",
            }}
          >
            이거다.
          </p>
        </div>

        {/* 센터 로고 + 줌 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: logoOpacity, pointerEvents: "none" }}
        >
          <div
            className="h-[40vh] w-[40vh]"
            style={{
              maxHeight: "440px",
              maxWidth: "440px",
              transform: `scale(${logoScale})`,
              transformOrigin: "center center",
              filter: `drop-shadow(0 0 ${20 + zoomP * 80}px rgba(44, 122, 252, ${0.4 + zoomP * 0.4}))`,
              transition: "filter 60ms linear",
            }}
          >
            <FinalLogo />
          </div>
        </div>

        {/* 블루 wash */}
        <div
          className="absolute inset-0"
          style={{
            background: "#2c7afc",
            opacity: blueOpacity,
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}
