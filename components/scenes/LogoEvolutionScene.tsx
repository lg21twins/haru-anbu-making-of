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
  if (kind === 1) {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <line x1="20" y1="20" x2="80" y2="20" stroke="white" strokeWidth="2" />
        <line x1="20" y1="80" x2="80" y2="80" stroke="white" strokeWidth="2" />
        <line x1="20" y1="20" x2="20" y2="80" stroke="white" strokeWidth="2" />
        <line x1="80" y1="20" x2="80" y2="80" stroke="white" strokeWidth="2" />
        <line x1="20" y1="20" x2="80" y2="80" stroke="white" strokeWidth="2" />
        <line x1="80" y1="20" x2="20" y2="80" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="white" />
        <circle cx="80" cy="20" r="5" fill="white" />
        <circle cx="20" cy="80" r="5" fill="white" />
        <circle cx="80" cy="80" r="5" fill="white" />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <ellipse cx="50" cy="55" rx="32" ry="40" fill="#ffd76b" />
        <circle cx="40" cy="50" r="3" fill="#1a1a1a" />
        <circle cx="60" cy="50" r="3" fill="#1a1a1a" />
        <path
          d="M38 65 Q50 75 62 65"
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === 3) {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <rect x="42" y="15" width="16" height="50" fill="#ff5e5e" />
        <rect x="20" y="32" width="60" height="16" fill="#ff5e5e" />
        <path
          d="M50 25 C 42 18, 32 25, 50 40 C 68 25, 58 18, 50 25"
          fill="#ffd76b"
        />
        <circle cx="35" cy="80" r="6" fill="#2c7afc" />
        <circle cx="50" cy="80" r="6" fill="#2c7afc" />
        <circle cx="65" cy="80" r="6" fill="#2c7afc" />
      </svg>
    );
  }
  if (kind === 4) {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path
          d="M15 50 Q35 25 50 50 T 85 50"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="15" cy="50" r="4" fill="white" />
        <circle cx="85" cy="50" r="4" fill="white" />
      </svg>
    );
  }
  return <FinalLogo />;
}

function FinalLogo() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <line
        x1="32"
        y1="28"
        x2="68"
        y2="28"
        stroke="#2c7afc"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="18"
        x2="50"
        y2="30"
        stroke="#2c7afc"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="63"
        r="22"
        fill="none"
        stroke="#2c7afc"
        strokeWidth="7"
      />
    </svg>
  );
}

function ChatBubble({ msg, show }: { msg: Msg; show: boolean }) {
  const isMe = msg.role === "me";
  return (
    <div
      className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
      style={{
        maxHeight: show ? "640px" : "0px",
        opacity: show ? 1 : 0,
        marginBottom: show ? "1.25rem" : "0px",
        transform: show ? "translateY(0)" : "translateY(14px)",
        overflow: "hidden",
        transition:
          "max-height 560ms cubic-bezier(0.2, 1, 0.4, 1), opacity 420ms cubic-bezier(0.2, 1, 0.4, 1) 60ms, margin-bottom 560ms cubic-bezier(0.2, 1, 0.4, 1), transform 520ms cubic-bezier(0.2, 1, 0.4, 1)",
      }}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-5 py-3 font-sans text-[15px] leading-relaxed md:text-base ${
          isMe
            ? "bg-[color:var(--color-key)] text-black"
            : "border border-white/10 bg-white/[0.04] text-white/90"
        }`}
      >
        <p>{msg.text}</p>
        {msg.attempt && (
          <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="mx-auto aspect-square w-[120px]">
              <AttemptPreview kind={msg.attempt} />
            </div>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
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
  const [visibleMsgs, setVisibleMsgs] = useState(0);

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
      const t = Math.max(0, Math.min(1, (progress - 0.03) / 0.55));
      setVisibleMsgs(Math.round(t * messages.length));
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

  const chatOpacity = p < 0.6 ? 1 : Math.max(0, 1 - (p - 0.6) / 0.05);
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
        {/* 채팅 thread */}
        <div
          className="absolute inset-0 flex items-end justify-center px-6 pb-[10vh] pt-[10vh] md:px-10"
          style={{
            opacity: chatOpacity,
            transition: "opacity 400ms ease-out",
            pointerEvents: chatOpacity < 0.5 ? "none" : "auto",
          }}
        >
          <div
            className="flex w-full max-w-2xl flex-col justify-end overflow-hidden"
            style={{ maxHeight: "80vh" }}
          >
            {messages.map((m, i) => (
              <ChatBubble key={i} msg={m} show={i < visibleMsgs} />
            ))}
          </div>
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
