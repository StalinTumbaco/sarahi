import { useEffect, useState, type RefObject } from "react";
import styles from "./memories.module.css";

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export default function SongProgress({ audioRef }: { audioRef: RefObject<HTMLAudioElement | null> }) {
  const [progress, setProgress] = useState({ time: 0, duration: 0 });

  useEffect(() => {
    const song = audioRef.current;
    if (!song) return;
    const update = () => setProgress({ time: song.currentTime, duration: Number.isFinite(song.duration) ? song.duration : 0 });
    song.addEventListener("timeupdate", update);
    song.addEventListener("loadedmetadata", update);
    song.addEventListener("durationchange", update);
    song.addEventListener("seeked", update);
    update();
    return () => {
      song.removeEventListener("timeupdate", update);
      song.removeEventListener("loadedmetadata", update);
      song.removeEventListener("durationchange", update);
      song.removeEventListener("seeked", update);
    };
  }, [audioRef]);

  return (
    <div className={styles.progress}>
      <input
        type="range"
        min={0}
        max={progress.duration || 1}
        step={0.1}
        value={progress.time}
        disabled={!progress.duration}
        aria-label="Momento de la canción"
        aria-valuetext={`${formatTime(progress.time)} de ${formatTime(progress.duration)}`}
        onChange={(event) => {
          const time = Number(event.currentTarget.value);
          if (audioRef.current) audioRef.current.currentTime = time;
          setProgress((previous) => ({ ...previous, time }));
        }}
      />
      <span aria-hidden="true">{formatTime(progress.time)} <span>/ {formatTime(progress.duration)}</span></span>
    </div>
  );
}
