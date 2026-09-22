"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  const router = useRouter();

  return (
    <main className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex w-full max-w-[1500px] flex-col items-center text-center">
        <Image
          className="mb-4 h-20 w-20 object-contain sm:mb-5 sm:h-28 sm:w-28"
          src="/HomeGif.webp"
          alt="Regalo animado"
          width={480}
          height={441}
          priority
          unoptimized
        />
        <p className="font-sutter-style mb-2 text-[clamp(1.1rem,6vw,2.25rem)] uppercase leading-none text-[#ff123d] drop-shadow-[0_3px_3px_rgba(0,0,0,0.85)]">
          PARA MI NIÑA TIQUITITA
        </p>
        <h1 className="font-sutter-style max-w-full whitespace-nowrap text-[clamp(1rem,5vw,3.75rem)] uppercase leading-none text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.85)]">
          Daniela Sarahi Yanez Baldias
        </h1>
        <p className="font-sutter-style mt-3 whitespace-nowrap text-[clamp(0.8rem,2.8vw,1.15rem)] leading-none text-[#ff123d] drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] sm:mt-4">
          I LOVE YOU
        </p>
        {!started && (
          <button
            type="button"
            aria-label="Iniciar"
            onClick={() => setStarted(true)}
            className="font-sutter-style mt-5 rounded-full border-2 border-[#ff123d] bg-black/35 px-5 py-1.5 text-base text-[#ff123d] shadow-[0_0_14px_rgba(255,18,61,0.35)] transition-all duration-200 hover:scale-105 hover:bg-[#ff123d] hover:text-white hover:shadow-[0_0_20px_rgba(255,18,61,0.65)] active:scale-95 sm:mt-6 sm:px-6 sm:py-2 sm:text-lg"
          >
            INICIAR
          </button>
        )}
      </div>
      {started && (
        <div className="heart-transition" aria-hidden="true">
          <span
            className="heart-transition-symbol"
            onAnimationEnd={(event) => {
              if (event.animationName === "heart-zoom") {
                router.push("/flowers");
              }
            }}
          >
            ♥
          </span>
        </div>
      )}
    </main>
  );
}
