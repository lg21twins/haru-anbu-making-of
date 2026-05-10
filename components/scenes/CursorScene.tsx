"use client";

import { Scene } from "./Scene";

export function CursorScene() {
  return (
    <Scene id="s00" height="screen" bg="bg-black">
      <div className="font-mono text-7xl text-white/90 md:text-8xl">
        <span className="caret caret-fat" aria-hidden />
      </div>
    </Scene>
  );
}
