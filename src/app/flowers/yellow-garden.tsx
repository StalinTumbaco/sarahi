import type { CSSProperties } from "react";
import styles from "./flowers.module.css";

// Fixed positions keep the garden identical on the server and during hydration.
// The lower flowers in the middle leave the lyrics room to breathe.
const flowers = [
  { x: -2, size: 0.78, lean: -13, kind: "sunflower", back: true },
  { x: 7, size: 1, lean: 9, kind: "sunflower" },
  { x: 16, size: 0.68, lean: -12, kind: "daisy", back: true },
  { x: 23, size: 0.77, lean: -8, kind: "sunflower" },
  { x: 32, size: 0.49, lean: 12, kind: "daisy" },
  { x: 42, size: 0.38, lean: -9, kind: "daisy", back: true },
  { x: 53, size: 0.32, lean: 11, kind: "sunflower", back: true },
  { x: 63, size: 0.45, lean: -10, kind: "daisy" },
  { x: 73, size: 0.68, lean: 12, kind: "sunflower", back: true },
  { x: 81, size: 0.83, lean: -9, kind: "sunflower" },
  { x: 91, size: 1.06, lean: -7, kind: "sunflower" },
  { x: 100, size: 0.7, lean: 14, kind: "daisy" },
  { x: 2, size: 0.56, lean: -24, kind: "daisy" },
  { x: 15, size: 0.5, lean: 16, kind: "sunflower" },
  { x: 27, size: 0.36, lean: -17, kind: "daisy" },
  { x: 77, size: 0.43, lean: 18, kind: "daisy" },
  { x: 88, size: 0.56, lean: -17, kind: "daisy" },
  { x: 97, size: 0.49, lean: 22, kind: "sunflower" },
] as const;

const seedPositions = Array.from({ length: 110 }, (_, index) => {
  const angle = index * 2.399963;
  const radius = 2.12 * Math.sqrt(index);
  // Trigonometric results can differ in their final bits between JS engines.
  // Serialize fixed precision so SVG attributes match during hydration.
  return {
    x: (Math.cos(angle) * radius).toFixed(4),
    y: (Math.sin(angle) * radius).toFixed(4),
  };
});

type GardenStyle = CSSProperties & Record<`--${string}`, string | number>;

export default function YellowGarden() {
  return (
    <div className={styles.garden} aria-hidden="true">
      <div className={styles.horizon} />
      <div className={styles.sunlight} />
      <svg className={styles.definitions} xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="garden-petal" x1="0.15" y1="0" x2="0.8" y2="1">
            <stop stopColor="#fff5ab" />
            <stop offset="0.28" stopColor="#ffe564" />
            <stop offset="0.6" stopColor="#f9c52e" />
            <stop offset="0.86" stopColor="#e69b16" />
            <stop offset="1" stopColor="#ad6011" />
          </linearGradient>
          <linearGradient id="garden-petal-back" x1="0" y1="0" x2="0.7" y2="1">
            <stop stopColor="#f5cc45" />
            <stop offset="1" stopColor="#b57010" />
          </linearGradient>
          <linearGradient id="garden-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a8b65f" />
            <stop offset="0.4" stopColor="#607944" />
            <stop offset="0.55" stopColor="#3a5b35" />
            <stop offset="1" stopColor="#152e25" />
          </linearGradient>
          <linearGradient id="garden-stem">
            <stop stopColor="#263d29" />
            <stop offset="0.5" stopColor="#8b9e47" />
            <stop offset="1" stopColor="#415931" />
          </linearGradient>
          <radialGradient id="garden-center" cx="0.4" cy="0.35">
            <stop stopColor="#92602a" />
            <stop offset="0.65" stopColor="#57361e" />
            <stop offset="1" stopColor="#30271c" />
          </radialGradient>
          <pattern id="garden-seeds" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#efba58" opacity="0.55" />
            <circle cx="5.5" cy="5.5" r="0.9" fill="#1f1b15" opacity="0.65" />
          </pattern>
          <g id="garden-petal-shape">
            <path d="M-7-21 C-15-30-17-45-9-57 Q-2-64 0-73 C3-67 13-62 13-50 C18-39 10-26 7-21 Q0-16-7-21Z" />
            <path d="M0-24 Q-4-43 0-64" fill="none" stroke="#fff2a6" strokeWidth="0.8" opacity="0.55" />
            <path d="M4-27 Q9-45 5-56" fill="none" stroke="#a86a0f" strokeWidth="0.6" opacity="0.25" />
          </g>
          <path id="garden-daisy-petal" d="M-5-10 C-14-25-10-49 0-51 C11-47 12-24 5-10Z" />
          <g id="garden-foliage">
            <path d="M85 408 C63 308 104 216 80 91" fill="none" stroke="url(#garden-stem)" strokeWidth="7" />
            <path d="M83 272 C63 273 49 263 44 252 C28 248 23 232 20 201 C35 212 52 205 64 219 C82 225 89 250 83 272Z" fill="url(#garden-leaf)" />
            <path d="M84 230 C82 211 91 192 108 188 C114 173 133 177 147 169 C146 189 137 207 123 210 C115 226 99 233 84 230Z" fill="url(#garden-leaf)" />
            <path d="M79 337 C40 331 27 302 29 279 C60 282 80 301 79 337Z" fill="url(#garden-leaf)" />
            <path d="M23 206 Q57 237 83 272 M143 173 Q109 197 84 230 M32 283 Q58 312 79 337" fill="none" stroke="#bac16a" strokeWidth="1.2" opacity="0.38" />
            <path d="M43 228 L41 218 M53 239 L67 236 M62 250 L46 245 M69 258 L76 242 M101 208 L103 194 M112 197 L127 195" fill="none" stroke="#b6c67c" strokeWidth="0.7" opacity="0.28" />
          </g>
          <g id="garden-sunflower">
            <use href="#garden-foliage" />
            <g transform="translate(80 85) rotate(-8) scale(1 .94)">
              <g fill="url(#garden-petal-back)" stroke="#d89a20" strokeWidth="0.5">
                {Array.from({ length: 16 }, (_, index) => (
                  <use key={`back-${index}`} href="#garden-petal-shape" transform={`rotate(${index * 22.5 + 11.25}) scale(.94)`} />
                ))}
              </g>
              <g fill="url(#garden-petal)" stroke="#e6b637" strokeWidth="0.4">
                {Array.from({ length: 16 }, (_, index) => (
                  <use key={index} href="#garden-petal-shape" transform={`rotate(${index * 22.5}) scale(${0.92 + (index % 3) * 0.045} ${0.94 + (index % 4) * 0.025})`} />
                ))}
              </g>
              <circle r="27" fill="url(#garden-center)" stroke="#bc842c" strokeWidth="2" />
              {seedPositions.map((seed, index) => (
                <ellipse key={index} cx={seed.x} cy={seed.y} rx="1.05" ry="1.45" fill={index % 3 === 0 ? "#d6a453" : "#a47838"} transform={`rotate(${index * 137.5} ${seed.x} ${seed.y})`} />
              ))}
              <circle r="7" fill="#39271c" opacity="0.5" />
              <path d="M-18-11 A21 21 0 0 1 11-19" fill="none" stroke="#ffd675" strokeWidth="2" opacity="0.35" />
            </g>
          </g>
          <g id="garden-daisy">
            <use href="#garden-foliage" />
            <g transform="translate(80 85) rotate(12)">
              <g fill="url(#garden-petal)">
                {Array.from({ length: 12 }, (_, index) => (
                  <use key={index} href="#garden-daisy-petal" transform={`rotate(${index * 30})`} />
                ))}
              </g>
              <circle r="15" fill="#c28a1d" />
              <circle r="12" fill="#ebbb39" />
              <circle r="11" fill="url(#garden-seeds)" />
            </g>
          </g>
          <g id="garden-sprig" fill="url(#garden-leaf)">
            <path d="M81 408 Q68 252 46 145 M76 334 Q107 273 132 240 M72 290 Q44 270 18 241" fill="none" stroke="#68804b" strokeWidth="2" />
            <path d="M57 211 Q24 204 24 171 Q55 176 57 211 M62 241 Q83 213 78 188 Q54 211 62 241 M70 283 Q37 279 32 247 Q65 251 70 283 M77 329 Q105 309 112 281 Q79 289 77 329 M97 292 Q125 288 133 264 Q108 264 97 292" />
            <path d="M47 160 Q29 149 36 125 Q54 136 47 160 M132 242 Q121 225 137 212 Q149 232 132 242 M18 243 Q-1 239 2 220 Q21 220 18 243" fill="#b5a94e" />
          </g>
          <g id="garden-grass" fill="url(#garden-leaf)">
            <path d="M70 410 Q13 329 3 283 Q45 326 76 410 M78 410 Q89 305 128 246 Q100 328 86 410 M82 410 Q58 292 41 251 Q78 295 88 410 M88 410 Q120 350 159 327 Q115 373 96 410 M67 410 Q44 360 17 349 Q56 355 76 410" />
          </g>
        </defs>
      </svg>

      <div className={styles.flowerBed}>
        {[3, 18, 30, 70, 85, 98].map((x, index) => (
          <svg
            key={`sprig-${x}`}
            className={styles.sprig}
            viewBox="0 0 160 410"
            focusable="false"
            style={{ "--x": `${x}%`, "--lean": `${index % 2 ? -15 : 12}deg`, "--duration": `${8 + index}s`, "--delay": `${-index * 2}s` } as GardenStyle}
          >
            <use href="#garden-sprig" />
          </svg>
        ))}
        {flowers.map((flower, index) => (
          <div
            key={flower.x}
            className={`${styles.flower} ${"back" in flower ? styles.distant : ""} ${[2, 5, 6, 8, 13, 14, 15, 16].includes(index) ? styles.mobileHidden : ""}`}
            style={{
              "--x": `${flower.x}%`,
              "--size": flower.size,
              "--lean": `${flower.lean}deg`,
              "--duration": `${6 + (index % 4) * 1.3}s`,
              "--delay": `${-index * 1.7}s`,
            } as GardenStyle}
          >
            <svg className={styles.stem} viewBox="0 0 160 410" fill="none" focusable="false">
              <use href={`#garden-${flower.kind}`} />
            </svg>
          </div>
        ))}
      </div>

      <div className={styles.foreground}>
        {[0, 12, 24, 38, 54, 69, 82, 94].map((x, index) => (
          <svg key={x} className={styles.grass} viewBox="0 0 160 410" focusable="false" style={{ "--x": `${x}%`, "--lean": `${index % 2 ? -12 : 8}deg`, "--duration": `${9 + index % 3}s`, "--delay": `${-index}s` } as GardenStyle}>
            <use href="#garden-grass" />
          </svg>
        ))}
      </div>

      <div className={styles.petals}>
        {[8, 19, 78, 92, 34, 65].map((x, index) => (
          <span key={x} className={styles.petalPath} style={{ "--x": `${x}%`, "--y": `${12 + index % 3 * 9}%`, "--duration": `${15 + index * 2}s`, "--delay": `${-index * 5}s`, "--drift": `${index % 2 ? -55 : 65}px` } as GardenStyle}>
            <i className={styles.petal} />
          </span>
        ))}
      </div>

      <div className={styles.fireflies}>
        {Array.from({ length: 10 }, (_, index) => (
          <i
            key={index}
            className={styles.firefly}
            style={{
              "--x": `${5 + ((index * 29) % 90)}%`,
              "--y": `${8 + ((index * 13) % 35)}%`,
              "--delay": `${-index * 2.3}s`,
              "--duration": `${7 + (index % 4) * 2}s`,
            } as GardenStyle}
          />
        ))}
      </div>
    </div>
  );
}
