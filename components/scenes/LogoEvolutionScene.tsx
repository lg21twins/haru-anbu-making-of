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
  const landedRef = useRef(false);

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

      // 좌상단으로 날아간 뒤 색이 채워졌다고 알림
      const shouldLand = progress >= 0.94;
      if (shouldLand && !landedRef.current) {
        landedRef.current = true;
        window.dispatchEvent(new CustomEvent("haru:logo-landed"));
      } else if (!shouldLand && landedRef.current) {
        landedRef.current = false;
        window.dispatchEvent(new CustomEvent("haru:logo-unlanded"));
      }
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
      if (landedRef.current) {
        window.dispatchEvent(new CustomEvent("haru:logo-unlanded"));
      }
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
  const logoOpacity = p < 0.8 ? 0 : 1;

  // 날아가기 — 0.85부터 시작해 0.96에 좌상단 도착
  const flyP = Math.max(0, Math.min(1, (p - 0.85) / 0.11));
  // ease-out cubic
  const fly = 1 - Math.pow(1 - flyP, 3);
  const rotateDeg = fly * 540;
  const flyScale = 1 - fly * 0.92; // 1 → 0.08
  // 좌상단 햄버거 중심 위치: left-5 top-5 + 12×12 박스 안 9×9 svg의 중심 ≈ 44px,44px
  const tx = `calc((44px - 50vw) * ${fly})`;
  const ty = `calc((44px - 50vh) * ${fly})`;

  return (
    <section ref={ref} className="relative w-full" style={{ height: "1100vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        {/* 채팅 thread — 위쪽 fade mask로 잘림 대신 자연스럽게 사라짐 */}
        <div
          className="absolute inset-0 flex items-end justify-center px-6 pb-[10vh] pt-[10vh] md:px-10"
          style={{
            opacity: chatOpacity,
            transition: "opacity 400ms ease-out",
            pointerEvents: chatOpacity < 0.5 ? "none" : "auto",
          }}
        >
          <div
            className="relative w-full max-w-2xl"
            style={{ maxHeight: "80vh" }}
          >
            <div
              className="flex w-full flex-col justify-end"
              style={{
                maxHeight: "80vh",
                overflow: "hidden",
                // 위쪽 16% 영역을 마스크로 페이드아웃 — 잘리는 느낌 없이 사라짐
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 8%, #000 18%, #000 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 8%, #000 18%, #000 100%)",
              }}
            >
              {messages.map((m, i) => (
                <ChatBubble key={i} msg={m} show={i < visibleMsgs} />
              ))}
            </div>
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

        {/* 센터 로고 → 좌상단으로 회전하며 날아감 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: logoOpacity, pointerEvents: "none" }}
        >
          <div
            className="h-[40vh] w-[40vh]"
            style={{
              maxHeight: "440px",
              maxWidth: "440px",
              transform: `translate(${tx}, ${ty}) rotate(${rotateDeg}deg) scale(${flyScale})`,
              transformOrigin: "center center",
              filter: `drop-shadow(0 0 ${
                12 + (1 - fly) * 24
              }px rgba(44, 122, 252, ${0.35 + (1 - fly) * 0.25}))`,
              transition: "filter 80ms linear",
            }}
          >
            <FinalLogo />
          </div>
        </div>
      </div>
    </section>
  );
}
