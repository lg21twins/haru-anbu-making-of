"use client";

import { useEffect, useRef, useState } from "react";
import { PageKind, PAGE_LABEL, PhoneMock } from "./PhoneMock";

type Beat = {
  page: PageKind;
  cmd: string;
  code: string;
};

const beats: Beat[] = [
  {
    page: "home",
    cmd: "보호자 홈 만들어줘",
    code: `<section class="home">
  <h1>오늘도 수고하셨어요</h1>
  <p>정희님 잘 있어요</p>
  <div class="metrics">
    <Card title="투약" value="33%"/>
    <Card title="맥박" value="72BPM"/>
  </div>
</section>`,
  },
  {
    page: "chat",
    cmd: "AI 케어매니저 채팅 만들어줘",
    code: `<Chat persona="AI">
  <Bubble side="ai">
    오늘 어머님 상태 어땠나요?
  </Bubble>
  <Bubble side="user">
    식사를 적게 하셨어요.
  </Bubble>
  <Input placeholder="메시지 입력"/>
</Chat>`,
  },
  {
    page: "report",
    cmd: "일일 리포트 화면 만들어줘",
    code: `<Report date="5/17">
  <MomentCard img="..."
    quote="오전 산책 때
    햇빛이 좋아서 ..."
  />
  <Grid>
    <Widget kind="meds"/>
    <Widget kind="pulse"/>
  </Grid>
</Report>`,
  },
  {
    page: "alert",
    cmd: "긴급 알림 리스트 만들어줘",
    code: `<AlertList>
  <Item level="urgent"
    title="맥박 이상 감지"
    time="방금 전"/>
  <Item level="info"
    title="투약 시간"/>
  <Item level="info"
    title="리포트 도착"/>
</AlertList>`,
  },
  {
    page: "mypage",
    cmd: "마이페이지 만들어줘",
    code: `<MyPage>
  <Avatar src="..."/>
  <Name>김지욱</Name>
  <Role>정희님의 보호자</Role>
  <List>
    <Row>계정</Row>
    <Row>알림 설정</Row>
    <Row>결제</Row>
    <Row>고객 지원</Row>
  </List>
</MyPage>`,
  },
];

const BEAT_MS = 5500;
const CMD_FADE = 700;
const CODE_TYPE_START = 900;
const CODE_TYPE_MS = 3500;

export function PatternA() {
  const ref = useRef<HTMLElement>(null);
  const [beatIdx, setBeatIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRunning(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    let rafId: number | null = null;
    let beatTimer: number | null = null;

    const playBeat = (idx: number) => {
      setBeatIdx(idx);
      setChars(0);
      const beat = beats[idx];
      const t0 = performance.now();
      const tick = (now: number) => {
        const elapsed = now - t0;
        if (elapsed < CODE_TYPE_START) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        const p = Math.min(1, (elapsed - CODE_TYPE_START) / CODE_TYPE_MS);
        setChars(Math.round(p * beat.code.length));
        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };
      rafId = requestAnimationFrame(tick);

      beatTimer = window.setTimeout(() => {
        const next = (idx + 1) % beats.length;
        playBeat(next);
      }, BEAT_MS);
    };

    playBeat(0);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (beatTimer != null) window.clearTimeout(beatTimer);
    };
  }, [running]);

  const beat = beats[beatIdx];

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.3em] text-white/40">
        Pattern A · Parallel
      </div>

      <div className="grid h-full w-full grid-cols-2 items-center gap-8 px-12">
        {/* left — cmd + code */}
        <div className="flex h-full flex-col justify-center gap-6">
          <div
            key={`cmd-${beatIdx}`}
            className="font-sans font-semibold leading-[1.1] text-white"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 3.2rem)",
              animation: `fadeUp ${CMD_FADE}ms cubic-bezier(0.2,1,0.4,1) both`,
            }}
          >
            &ldquo;{beat.cmd}&rdquo;
          </div>

          <div
            key={`code-${beatIdx}`}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/95 font-mono shadow-[0_20px_60px_rgba(0,0,0,.6)]"
          >
            <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
                {PAGE_LABEL[beat.page]}.tsx
              </span>
            </div>
            <pre className="h-[32vh] overflow-hidden whitespace-pre px-4 py-3 text-[12px] leading-[1.55] text-white/85">
              {beat.code.slice(0, chars)}
              <span className="caret caret-fat" aria-hidden />
            </pre>
          </div>
        </div>

        {/* right — phone */}
        <div className="flex h-full items-center justify-center">
          <div
            key={`phone-${beatIdx}`}
            style={{
              animation: `fadeIn 700ms cubic-bezier(0.2,1,0.4,1) both`,
              animationDelay: "600ms",
            }}
          >
            <PhoneMock page={beat.page} stage={4} />
          </div>
        </div>
      </div>

      {/* progress dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {beats.map((_, i) => (
          <span
            key={i}
            className="h-1 w-8 rounded-full transition-colors"
            style={{
              background:
                i === beatIdx ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.18)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
