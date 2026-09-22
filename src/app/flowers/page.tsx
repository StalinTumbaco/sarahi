"use client";

import { useEffect, useRef, useState } from "react";
import YellowGarden from "./yellow-garden";
import styles from "./flowers.module.css";

type Lyric = {
  start: number;
  text: string;
  accent?: string | string[];
};

const lyrics: Lyric[] = [
  { start: 0.0, text: "No es secreto, tú me tiene' loco", accent: "loco" },
  { start: 5.5, text: "Me siento en LSD cuando te toco" },
  { start: 11.3, text: "Soy un tonto y mil vece' me equivoco", accent: ["tonto", "equivoco"] },
  { start: 17.1, text: "Te quiero siempre a mi ladito como Yoko", accent: "Yoko" },
  { start: 21.7, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 29.1, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 35.2, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 41.1, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 45.6, text: "Ey, ah" },
  { start: 51.2, text: "Prefiero tus labio' a cualquier premio" },
  { start: 54.8, text: "Prefiero tu boca que un número uno", accent: "uno" },
  { start: 57.2, text: "¿Cómo llegué a ser tu rey? Eso e' un misterio" },
  { start: 60.4, text: "Un atardecer contigo no lo cambio por ninguno", accent: "ninguno" },
  { start: 63.1, text: "Si tú me quisiste cuando ni yo me quería" },
  { start: 66.1, text: "Que tú me quisiste cuando ni yo me quería, eh" },
  { start: 74.9, text: "Yo tan T'Chala, tú tan princesa Diana" },
  { start: 78.1, text: "En la cama Lana Rhoades, en la calle siempre es pana" },
  { start: 81.3, text: "Soñé que estaba contigo en la portada" },
  { start: 84.1, text: "De Vogue, los dos vestido' 'e Prada" },
  { start: 85.9, text: "Que nos grabábamo' en el sofá Eames de la sala" },
  { start: 89.4, text: "Y lo enseñaba en Sunset y Cannes to' el mundo lo amaba" },
  { start: 93.2, text: "Este es el amor del cual mi abuelito me hablaba" },
  { start: 96.1, text: "Querer estar a tu la'o hasta que el pelo esté lleno de cana'", accent: "cana" },
  { start: 100.1, text: "Yo quiero, quiero, quiero, quiero verte brillar por siempre", accent: "por siempre" },
  { start: 106.2, text: "Yo quiero, quiero, quiero, quiero verte bailar por siempre, yeah", accent: "por siempre" },
  { start: 112.8, text: "Tú y yo por siempre", accent: "por siempre" },
  { start: 115.4, text: "Baby, tú y yo por siempre", accent: "por siempre" },
  { start: 120.0, text: "No es secreto, tú me tiene' loco", accent: "loco" },
  { start: 124.2, text: "Me siento en LSD cuando te toco" },
  { start: 130.3, text: "Soy un tonto y mil vece' me equivoco", accent: ["tonto", "equivoco"] },
  { start: 136.0, text: "Te quiero siempre a mi ladito como Yoko", accent: "Yoko" },
  { start: 141.8, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 149.6, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 155.6, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 161.5, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 167.5, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 173.3, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 179.4, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 185.5, text: "Oh, no te vaya' nunca", accent: "nunca" },
  { start: 191.6, text: "Oh, no te vaya'" },
];

const SYNC_LEAD_SECONDS = 0.18;

function renderLyric({ text, accent }: Lyric) {
  if (!accent) return <span className="lyrics-plain">{text}</span>;

  const accents = Array.isArray(accent) ? accent : [accent];
  const normalizedText = text.toLocaleLowerCase();
  const ranges = accents
    .map((phrase) => {
      const start = normalizedText.indexOf(phrase.toLocaleLowerCase());
      return start === -1 ? null : { start, end: start + phrase.length };
    })
    .filter((range): range is { start: number; end: number } => range !== null)
    .sort((a, b) => a.start - b.start);

  if (ranges.length === 0) return <span className="lyrics-plain">{text}</span>;

  const parts = [];
  let cursor = 0;

  ranges.forEach(({ start, end }) => {
    if (start > cursor) {
      parts.push(<span className="lyrics-plain" key={`plain-${cursor}`}>{text.slice(cursor, start)}</span>);
    }
    parts.push(<span className="lyrics-accent" key={`accent-${start}`}>{text.slice(start, end)}</span>);
    cursor = end;
  });

  if (cursor < text.length) {
    parts.push(<span className="lyrics-plain" key={`plain-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return parts;
}

export default function FlowersPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentLyric, setCurrentLyric] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    let animationFrame = 0;

    const refreshLyric = () => {
      const synchronizedTime = audio.currentTime + SYNC_LEAD_SECONDS;
      const nextLyric = lyrics.reduce(
        (currentIndex, lyric, index) => (synchronizedTime >= lyric.start ? index : currentIndex),
        0,
      );

      setCurrentLyric((currentIndex) => (currentIndex === nextLyric ? currentIndex : nextLyric));
    };

    const updateLyric = () => {
      refreshLyric();
      animationFrame = requestAnimationFrame(updateLyric);
    };

    audio.addEventListener("loadedmetadata", refreshLyric);
    refreshLyric();
    updateLyric();
    void audio.play().catch(() => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", refreshLyric);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/media/audio/alvaro-diaz-yoko.mp3"
        autoPlay
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <main
        className={`${styles.stage} flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-16`}
        data-playing={isPlaying}
        aria-label="Letra sincronizada de Yoko de Álvaro Díaz"
      >
        <YellowGarden />
        <div key={`glow-${currentLyric}`} className={styles.lyricGlow} aria-hidden="true" />
        <div className={`${styles.lyrics} w-full max-w-7xl`} aria-live="polite">
          <p
            key={lyrics[currentLyric].start}
            className="lyrics-display lyrics-enter break-words text-[clamp(2.5rem,10vw,9rem)] leading-[0.88] uppercase text-white/80"
          >
            {renderLyric(lyrics[currentLyric])}
          </p>
        </div>
      </main>

      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className={styles.musicButton}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </>
  );
}
