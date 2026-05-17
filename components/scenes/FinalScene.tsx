"use client";

import { Scene } from "./Scene";
import { TypeText } from "./TypeText";

export function FinalScene() {
  return (
    <Scene id="s-final" height="tall" bg="bg-black">
      <div className="flex h-screen w-full flex-col items-center justify-center px-6 text-center md:px-12">
        <p
          className="font-sans font-semibold leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(4rem, 16vw, 16rem)" }}
        >
          <TypeText text="하루안부." speed={140} startDelay={400} finalCursor />
        </p>
      </div>
    </Scene>
  );
}
