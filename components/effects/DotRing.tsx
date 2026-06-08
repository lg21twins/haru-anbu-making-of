"use client";

import { useEffect, useRef, type RefObject } from "react";

// 도트(파티클) 링 — 책 표지 같은 점들의 원.
// active=true(재생 중)면 도트가 원을 따라 돌며, 실제 음성 레벨(analyser)에 맞춰 반지름·밝기가 출렁인다.
// palette: gray(기존 음성) / green(개선된 음성, 우리 그린 계열).

type Palette = "gray" | "green";

type Particle = {
  angle: number;
  rFrac: number; // 반지름(최소변 대비 비율)
  size: number;
  baseAlpha: number;
  speed: number; // 각속도
  phase: number;
  freq: number;
  wobble: number; // 흔들림(최소변 대비 비율)
  c: [number, number, number];
  rOff: number; // 바깥으로 튕긴 현재 변위(px)
  rVel: number; // 변위 속도 — 스프링으로 부드럽게 튕겼다 복귀
};

function gauss() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

function makeColor(palette: Palette): [number, number, number] {
  if (palette === "gray") {
    const v = 150 + Math.floor(Math.random() * 95); // 150~245
    return [v, v, v + 4];
  }
  // 그린 계열: 깊은 그린(#1FA64E) → 밝은 민트(#6BF0A6)
  const t = Math.random();
  const a = [31, 166, 78];
  const b = [107, 240, 166];
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

type Variant = "compact" | "galaxy";

const VARIANTS: Record<
  Variant,
  { ring: number; ringStd: number; haloRatio: number; haloReach: number }
> = {
  // compact: 수정 전처럼 타이트한 링(헤일로 거의 없음)
  compact: { ring: 0.4, ringStd: 0.045, haloRatio: 0.12, haloReach: 0.05 },
  // galaxy: 바깥 멀리까지 퍼지는 은하 헤일로
  galaxy: { ring: 0.27, ringStd: 0.035, haloRatio: 0.5, haloReach: 0.22 },
};

function makeParticles(n: number, palette: Palette, variant: Variant): Particle[] {
  const v = VARIANTS[variant];
  const out: Particle[] = [];
  let made = 0;
  let guard = 0;
  while (made < n && guard < n * 12) {
    guard++;
    const angle = Math.random() * Math.PI * 2;
    const u = Math.random();
    const halo = u >= 0.64; // 바깥 은하 헤일로
    let rFrac: number;
    if (u < 0.34) {
      // 안쪽 채움 — 중심부터 링까지 디스크(면적 균일 분포로 가운데도 꽉 차게)
      rFrac = 0.05 + Math.sqrt(Math.random()) * (v.ring - 0.05);
    } else if (!halo) {
      // 코어 링 밴드 — 소용돌이 비대칭 밀도
      const weight = 0.5 + 0.5 * Math.max(0, Math.sin(angle - 0.7));
      if (Math.random() > weight) continue;
      rFrac = v.ring + gauss() * v.ringStd;
    } else {
      // 은하 헤일로 — 안쪽에 많고 바깥으로 갈수록 희박 (멱분포, 멀리멀리)
      rFrac = v.ring + 0.03 + Math.pow(Math.random(), 1.7) * v.haloReach;
    }
    out.push({
      angle,
      rFrac,
      size: halo
        ? Math.random() < 0.5
          ? 1.5
          : 2.1
        : Math.random() < 0.22
          ? 2.2 + Math.random()
          : 1.3 + Math.random() * 0.9,
      // 멀어져도 잘 보이게 — 헤일로도 충분히 밝게(farness 감쇠 제거)
      baseAlpha: halo ? 0.42 + Math.random() * 0.5 : 0.4 + Math.random() * 0.6,
      // 같은 방향 공전 + 안쪽이 더 빠른 차등 회전(은하 느낌)
      speed: 0.14 / (0.28 + rFrac),
      phase: Math.random() * Math.PI * 2,
      freq: 0.4 + Math.random() * 1.6,
      wobble: 0.008 + Math.random() * 0.028,
      c: makeColor(palette),
      rOff: 0,
      rVel: 0,
    });
    made++;
  }
  return out;
}

export function DotRing({
  active,
  palette,
  analyserRef,
  count = 480,
  variant = "galaxy",
  dynamics = 1,
}: {
  active: boolean;
  palette: Palette;
  analyserRef?: RefObject<AnalyserNode | null>;
  count?: number;
  variant?: Variant;
  dynamics?: number; // 동적인 정도(회전/분출 배율). 1=기본, 0.5=절반
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const dynRef = useRef(dynamics);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    dynRef.current = dynamics;
  }, [dynamics]);

  useEffect(() => {
    particlesRef.current = makeParticles(count, palette, variant);
  }, [count, palette, variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let freqData: Uint8Array<ArrayBuffer> | null = null;
    let smooth = 0;
    let last = 0;
    let raf = 0;

    const readLevel = () => {
      const an = analyserRef?.current;
      if (!an) return 0;
      if (!freqData || freqData.length !== an.frequencyBinCount)
        freqData = new Uint8Array(an.frequencyBinCount);
      an.getByteFrequencyData(freqData);
      let s = 0;
      for (let i = 0; i < freqData.length; i++) s += freqData[i];
      return s / freqData.length / 255;
    };

    const frame = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      const on = activeRef.current;
      const target = on ? readLevel() : 0;
      smooth += (target - smooth) * 0.18;

      const dyn = dynRef.current;
      const minDim = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      const energy = (on ? 0.9 + smooth * 4 : 0.45) * dyn;

      // 매 프레임 클리어 — 트레일 없이 또렷하게(멀어져도 잘 보이게)
      ctx.clearRect(0, 0, w, h);

      // 음성이 클수록 바깥으로 튕기는 목표 변위 (재생 중에만)
      const kick = on ? smooth * minDim * 0.5 * dyn : 0;
      // 캔버스 밖으로 한참 나간 입자만 컬링(원형 마스크가 가장자리 페이드를 담당하므로 박스 잘림 없음)
      const cull = minDim * 0.72;

      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.angle += p.speed * dt * energy;
        // 스프링-댐퍼로 부드럽게 멀리 튕겼다 복귀 (파티클마다 거리 변주)
        const targetOff = kick * (0.5 + (((i * 37) % 100) / 100));
        const accel = (targetOff - p.rOff) * 26 - p.rVel * 4;
        p.rVel += accel * dt;
        p.rOff += p.rVel * dt;
        const wob =
          Math.sin(t * 0.001 * p.freq + p.phase) * p.wobble * minDim * (on ? 1 : 0.35);
        const r = p.rFrac * minDim + wob + p.rOff;
        const dx = Math.cos(p.angle) * r;
        const dy = Math.sin(p.angle) * r;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > cull) continue;
        const x = cx + dx;
        const y = cy + dy;
        const flick = 0.7 + 0.3 * Math.sin(t * 0.004 * p.freq + p.phase * 1.7);
        let a = on ? p.baseAlpha * (0.55 + 0.45 * flick + smooth * 0.6) : p.baseAlpha * (0.25 + 0.5 * flick);
        if (a <= 0.004) continue;
        if (a > 1) a = 1;
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a})`;
        const s = p.size;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [analyserRef]);

  // 원형 마스크 — 정사각형 캔버스를 동그랗게 잘라 가장자리에서 부드럽게 사라지게(박스 잘림 원천 차단)
  const mask = "radial-gradient(circle closest-side, #000 84%, transparent 100%)";

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      aria-hidden
    />
  );
}
