// 자동재생 씬용 스크롤 락 — Lenis stop()만으론 네이티브/스크롤바/관성 스크롤이
// 새어나가므로(진단으로 확인됨), scrollY를 핀 위치에 강제로 되돌리는 가드까지 건다.

type LenisLike = {
  stop: () => void;
  start: () => void;
  scrollTo: (
    target: number | HTMLElement,
    options?: Record<string, unknown>
  ) => void;
  isStopped?: boolean;
};

export function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

const SCROLL_KEYS = new Set([
  " ",
  "Spacebar",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
]);

export type ScrollLock = { release: () => void };

const CAPTURE: AddEventListenerOptions = { capture: true };

/**
 * 스크롤을 pinY에 완전 고정한다.
 *  - Lenis animatedScroll/targetScroll까지 pinY로 맞춘 뒤 stop() (해제 시 튐 방지)
 *  - 휠/터치/키보드 캡처 단계 차단
 *  - 어떤 경로로든 scrollY가 벗어나면 즉시 pinY로 되돌림 (스크롤바 드래그·관성·JS 스크롤 포함)
 * 반환된 release()로 해제.
 */
export function lockScrollAt(pinY: number): ScrollLock {
  const lenis = getLenis();
  const target = Math.round(pinY);

  const repin = () => {
    if (Math.abs(window.scrollY - target) > 0.5) {
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else window.scrollTo(0, target);
    }
  };
  const preventEvent = (e: Event) => {
    if (e.cancelable) e.preventDefault();
  };
  const preventKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) e.preventDefault();
  };

  // 1) Lenis 내부 상태까지 pinY로 정렬한 뒤 정지
  if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
  else window.scrollTo(0, target);
  lenis?.stop();

  // 2) 입력 차단 + 핀 가드
  window.addEventListener("wheel", preventEvent, { passive: false, capture: true });
  window.addEventListener("touchmove", preventEvent, { passive: false, capture: true });
  window.addEventListener("keydown", preventKey, CAPTURE);
  window.addEventListener("scroll", repin, { passive: true });

  let released = false;
  return {
    release() {
      if (released) return;
      released = true;
      window.removeEventListener("wheel", preventEvent, CAPTURE);
      window.removeEventListener("touchmove", preventEvent, CAPTURE);
      window.removeEventListener("keydown", preventKey, CAPTURE);
      window.removeEventListener("scroll", repin);
      lenis?.start();
    },
  };
}

/**
 * 락 해제 후 다음 섹션(nextTop)으로 부드럽게 자동 이동. 도착하면 onDone.
 */
export function releaseAndAdvance(
  lock: ScrollLock | null,
  nextTop: number,
  onDone: () => void
) {
  lock?.release();
  const lenis = getLenis();
  if (lenis) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };
    lenis.scrollTo(nextTop, {
      duration: 1.0,
      force: true,
      onComplete: finish,
    });
    // onComplete 누락 대비 fallback
    window.setTimeout(finish, 1400);
  } else {
    window.scrollTo({ top: nextTop, behavior: "smooth" });
    onDone();
  }
}
