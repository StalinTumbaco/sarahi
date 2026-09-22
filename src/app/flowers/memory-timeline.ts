export type MemoryAsset = {
  src: string;
  kind: "photo" | "video";
  alt: string;
  poster?: string;
  fallback?: string;
};

export type MemoryCue = {
  start: number;
  end: number;
  caption: string;
  assets: MemoryAsset[];
};

const photo = (number: number): MemoryAsset => ({
  src: `/media/images/sarahi-foto-${String(number).padStart(2, "0")}.webp`,
  kind: "photo",
  alt: number === 28 ? "Un recuerdo de Sarahi de pequeña" : [8, 18].includes(number) ? "Sarahi junto a su gatito" : "Un recuerdo de Sarahi",
});

const video = (number: number): MemoryAsset => {
  const name = `sarahi-video-${String(number).padStart(2, "0")}`;
  return {
    kind: "video",
    src: `/media/videos/${name}.webm`,
    fallback: `/media/playback/${name}.mp4`,
    poster: `/media/posters/${name}.webp`,
    alt: "Un recuerdo en vídeo de Sarahi, sin sonido",
  };
};

const panorama: MemoryAsset = {
  ...photo(27),
  src: "/media/images/sarahi-foto-27-rotada.webp",
};

// The lyric timestamps are intentionally shown just ahead of the raw audio
// clock so the text lands on the vocal attack. Memories must use this same
// clock or every card arrives a fraction late to its matching lyric.
export const SONG_SYNC_OFFSET_SECONDS = 0.18;

// Deliberate musical phrasing, in seconds on the song's own clock.
// Gaps let the lyrics breathe; paired photos stay together on mobile too.
// Each photo appears once. 04/17 are duplicate files of 03/12; the rotated
// version of 27 is reserved for the finale instead of also showing its original.
export const memoryTimeline: MemoryCue[] = [
  { start: 5.5, end: 10.75, caption: "Esa forma de mirarme", assets: [video(2)] },
  { start: 11.3, end: 16.65, caption: "Con todas mis versiones", assets: [photo(5), photo(6)] },
  { start: 17.1, end: 21.3, caption: "A mi ladito", assets: [photo(2), photo(20)] },
  { start: 21.7, end: 28.65, caption: "Quédate un poquito más", assets: [video(1)] },
  { start: 29.1, end: 34.65, caption: "Aquí, contigo", assets: [photo(14)] },
  { start: 35.2, end: 40.55, caption: "No te vayas nunca", assets: [video(3)] },
  { start: 41.1, end: 45.1, caption: "Una y otra vez, tú", assets: [photo(3)] },
  // The instrumental pickup at 45.6 has no card.
  { start: 51.2, end: 54.4, caption: "Mi premio favorito", assets: [photo(9)] },
  { start: 54.8, end: 56.9, caption: "Tú, primero", assets: [photo(10)] },
  { start: 57.2, end: 60.05, caption: "Qué suerte encontrarte", assets: [video(4)] },
  { start: 60.4, end: 62.8, caption: "No lo cambio por ninguno", assets: [photo(19)] },
  { start: 63.1, end: 65.8, caption: "Todo lo que te hizo ser tú", assets: [photo(28)] },
  { start: 66.1, end: 73.8, caption: "La ternura de lo pequeño", assets: [photo(8), photo(18)] },
  { start: 74.9, end: 77.75, caption: "Mi princesa", assets: [photo(21), photo(22)] },
  { start: 81.3, end: 85.5, caption: "Mi portada favorita", assets: [photo(1), photo(13)] },
  { start: 85.9, end: 92.65, caption: "Guardaría cada instante", assets: [video(6)] },
  { start: 93.2, end: 99.5, caption: "De esos amores que se quedan", assets: [photo(12)] },
  { start: 100.1, end: 105.7, caption: "Verte brillar", assets: [photo(23)] },
  { start: 106.2, end: 112.4, caption: "Verte bailar por siempre", assets: [video(9)] },
  { start: 112.8, end: 115.1, caption: "Tú y yo", assets: [photo(26)] },
  { start: 115.4, end: 119.55, caption: "Por siempre", assets: [photo(16)] },
  { start: 120, end: 123.8, caption: "Volvería a elegirte", assets: [photo(7)] },
  { start: 124.2, end: 129.8, caption: "Una sonrisa y ya", assets: [video(7)] },
  { start: 130.3, end: 135.6, caption: "Incluso cuando me equivoco", assets: [photo(11)] },
  { start: 136, end: 141.3, caption: "Siempre a mi ladito", assets: [photo(15)] },
  { start: 141.8, end: 149.05, caption: "Que dure un poquito más", assets: [video(5)] },
  { start: 155.6, end: 161.05, caption: "Así, cerquita", assets: [video(8)] },
  { start: 167.5, end: 172.9, caption: "Un instante que se queda", assets: [video(10)] },
  { start: 179.4, end: 185.05, caption: "Todo lo que eres", assets: [photo(24)] },
  { start: 185.5, end: 191.15, caption: "Todo lo que nos queda", assets: [photo(25)] },
  { start: 191.6, end: 210, caption: "Tú y yo, por siempre", assets: [panorama] },
];

export const MEMORY_FADE_SECONDS = 0.55;

export function getMemoryIndex(time: number): number {
  return memoryTimeline.findIndex((cue) => time >= cue.start && time < cue.end);
}
