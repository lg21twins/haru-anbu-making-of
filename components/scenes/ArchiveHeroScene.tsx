"use client";

// 팀원이 만든 오프닝 히어로 (아카이브) — 풀스크린 벤토.
// 원본 HTML을 그대로 iframe으로 임베드. 스크롤이 막히지 않게 pointer-events 해제.
export function ArchiveHeroScene() {
  return (
    <section className="relative w-full bg-[#080808]" style={{ height: "100vh" }}>
      <iframe
        src="/archive-hero/index.html"
        title="하루안부 — How We Built It"
        className="pointer-events-none absolute inset-0 h-full w-full border-0"
        loading="eager"
        scrolling="no"
        tabIndex={-1}
        aria-label="하루안부 — How We Built It"
      />
    </section>
  );
}
