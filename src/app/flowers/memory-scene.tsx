import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type RefObject, type CSSProperties } from "react";
import { memoryTimeline, SONG_SYNC_OFFSET_SECONDS, type MemoryAsset } from "./memory-timeline";
import mediaDimensions from "./memory-media.json";
import styles from "./memories.module.css";

type Props = {
  index: number;
  nextIndex: number;
  leaving: boolean;
  isPlaying: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
};

const imageSizes = "(max-height: 500px) 28vw, (max-width: 639px) 72vw, 430px";

function cardStyle(asset: MemoryAsset): CSSProperties {
  const { width, height } = mediaDimensions[asset.src as keyof typeof mediaDimensions];
  return { "--ratio": width / height } as CSSProperties;
}

function MemoryVideo({ asset, start, isPlaying, audioRef }: {
  asset: MemoryAsset;
  start: number;
  isPlaying: boolean;
  audioRef: Props["audioRef"];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const clip = videoRef.current;
    const song = audioRef.current;
    if (!clip || !song) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Set DOM properties too: WebKit requires muted before play().
    clip.muted = true;
    clip.defaultMuted = true;
    clip.volume = 0;

    const sync = () => {
      if (reducedMotion.matches || document.hidden) {
        clip.pause();
        return;
      }
      if (Number.isFinite(clip.duration) && clip.duration > 0) {
        const position = Math.max(0, song.currentTime - start) % clip.duration;
        if (Math.abs(clip.currentTime - position) > 0.45) clip.currentTime = position;
      }
      if (!isPlaying || song.paused) {
        clip.pause();
        return;
      }
      if (clip.paused) void clip.play().catch(() => { /* Keep the poster if autoplay is blocked. */ });
    };

    sync();
    clip.addEventListener("loadedmetadata", sync);
    song.addEventListener("seeked", sync);
    song.addEventListener("timeupdate", sync);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      clip.pause();
      clip.removeEventListener("loadedmetadata", sync);
      song.removeEventListener("seeked", sync);
      song.removeEventListener("timeupdate", sync);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, [asset.src, start, isPlaying, audioRef]);

  if (unavailable) return <Image src={asset.poster!} alt={asset.alt} fill sizes={imageSizes} className={styles.media} />;

  return (
    <video
      ref={videoRef}
      className={styles.media}
      poster={asset.poster}
      muted
      playsInline
      loop
      preload="metadata"
      disablePictureInPicture
      aria-label={asset.alt}
      onError={() => setUnavailable(true)}
    >
      <source src={asset.src} type="video/webm" />
      <source src={asset.fallback} type="video/mp4" />
    </video>
  );
}

export default function MemoryScene({ index, nextIndex, leaving, isPlaying, audioRef }: Props) {
  const cue = memoryTimeline[index];

  useEffect(() => {
    if (!isPlaying) return;
    // Warm only the next card(s), never the entire gallery or a hidden video.
    const next = memoryTimeline[nextIndex];
    if (!next) return;
    for (const asset of next.assets) {
      const loader = new window.Image();
      if (asset.kind === "video") {
        loader.src = asset.poster!;
      } else {
        const { props } = getImageProps({ src: asset.src, alt: "", fill: true, sizes: imageSizes });
        loader.sizes = props.sizes ?? "";
        loader.srcset = props.srcSet ?? "";
        loader.src = props.src;
      }
    }
  }, [nextIndex, isPlaying]);

  return (
    <section className={styles.memoryStage} aria-label="Recuerdos junto a la canción" data-playing={isPlaying}>
      {cue && (
        <div key={cue.start} className={styles.moment} data-leaving={leaving}>
          <div className={styles.appearance}>
            <div className={styles.deck} data-count={cue.assets.length}>
              {cue.assets.map((asset) => (
                <figure key={asset.src} className={styles.card} style={cardStyle(asset)}>
                  <div className={styles.frame}>
                    {asset.kind === "video" ? (
                      <MemoryVideo
                        asset={asset}
                        start={cue.start - SONG_SYNC_OFFSET_SECONDS}
                        isPlaying={isPlaying}
                        audioRef={audioRef}
                      />
                    ) : (
                      <Image src={asset.src} alt={asset.alt} fill sizes={imageSizes} loading="eager" className={styles.media} />
                    )}
                  </div>
                  <span className={styles.heart} aria-hidden="true">♡</span>
                </figure>
              ))}
            </div>
            <p className={styles.caption}>{cue.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
