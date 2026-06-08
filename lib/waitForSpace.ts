// 자동재생 씬 사이의 "엔터 게이트".
// 씬 락(lockScrollAt)이 스크롤을 막은 동안, 여기서 keydown을 받아 다음 단계로 진행한다.
// 발표자가 엔터로 직접 박자를 통제하는 용도.
//
// promise — 엔터를 누르면(또는 cancel 시) resolve.
// cancel  — 언마운트 등으로 정리할 때 호출. 리스너 제거 + promise 즉시 resolve.
export type SpaceGate = { promise: Promise<void>; cancel: () => void };

export function waitForSpace(): SpaceGate {
  let resolveFn: () => void = () => {};
  let done = false;

  function onKey(e: KeyboardEvent) {
    if (e.code === "Enter" || e.code === "NumpadEnter" || e.key === "Enter") {
      e.preventDefault();
      settle();
    }
  }
  function settle() {
    if (done) return;
    done = true;
    window.removeEventListener("keydown", onKey, true);
    resolveFn();
  }

  const promise = new Promise<void>((resolve) => {
    resolveFn = resolve;
  });
  window.addEventListener("keydown", onKey, true);

  return { promise, cancel: settle };
}
