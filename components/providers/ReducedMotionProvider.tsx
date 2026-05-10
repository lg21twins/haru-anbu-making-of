"use client";

import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext<{ reduce: boolean; coarse: boolean }>({
  reduce: false,
  coarse: false,
});

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({ reduce: false, coarse: false });

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMq = window.matchMedia("(max-width: 768px) and (pointer: coarse)");
    const update = () =>
      setState({ reduce: reduceMq.matches, coarse: coarseMq.matches });
    update();
    reduceMq.addEventListener("change", update);
    coarseMq.addEventListener("change", update);
    return () => {
      reduceMq.removeEventListener("change", update);
      coarseMq.removeEventListener("change", update);
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useMotionEnv = () => useContext(Ctx);
