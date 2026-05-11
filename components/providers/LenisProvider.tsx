"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.1,
      smoothWheel: !reduce,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (target) {
        lenis.scrollTo(target as HTMLElement, {
          offset: 0,
          immediate: true,
        });
      }
    };

    const initial = window.setTimeout(scrollToHash, 80);
    window.addEventListener("hashchange", scrollToHash);

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: reduce ? 0 : 1.2 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("hashchange", scrollToHash);
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
