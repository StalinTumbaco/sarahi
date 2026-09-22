import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { memoryTimeline, getMemoryIndex, MEMORY_FADE_SECONDS } from "../src/app/flowers/memory-timeline.ts";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));

const fingerprint = (src) => createHash("sha256").update(readFileSync(`${publicDir}${src}`)).digest("hex");
// A rotated rendition is the same memory, even if the file bytes differ.
const memoryIdentity = (src) => fingerprint(src.replace("-rotada.webp", ".webp"));

test("every distinct photo and video has a place; the homepage GIF is excluded", () => {
  const originals = ["images", "videos"].flatMap((directory) =>
    readdirSync(`${publicDir}/media/${directory}`).map((name) => `/media/${directory}/${name}`));
  const used = new Set(memoryTimeline.flatMap((cue) => cue.assets.map((asset) => asset.src)));
  const usedContent = new Set([...used].map(memoryIdentity));
  assert.ok(!used.has("/HomeGif.webp"));
  assert.ok(existsSync(`${publicDir}/HomeGif.webp`), "The homepage GIF must remain available");
  for (const src of originals) assert.ok(usedContent.has(memoryIdentity(src)), `${src} is missing`);
  for (const cue of memoryTimeline) for (const asset of cue.assets) {
    for (const path of [asset.src, asset.poster, asset.fallback].filter(Boolean)) {
      assert.ok(existsSync(`${publicDir}${path}`), `${path} does not exist`);
    }
  }
});

test("each photo and video appears only once in the entire song, including duplicates and rotated copies", () => {
  const seen = new Map();
  for (const cue of memoryTimeline) {
    for (const asset of cue.assets) {
      const identity = memoryIdentity(asset.src);
      assert.ok(!seen.has(identity), `${asset.src} at ${cue.start}s repeats the memory from ${seen.get(identity)}s`);
      seen.set(identity, cue.start);
    }
  }
});

test("all cards use the actual photo dimensions, including horizontal photos", async () => {
  const { default: sharp } = await import("sharp");
  const dimensions = JSON.parse(readFileSync(new URL("../src/app/flowers/memory-media.json", import.meta.url), "utf8"));
  const assets = new Map(memoryTimeline.flatMap((cue) => cue.assets.map((asset) => [asset.src, asset])));
  for (const [src, asset] of assets) {
    assert.ok(dimensions[src]?.width > 0 && dimensions[src]?.height > 0, `Missing dimensions for ${src}`);
    if (asset.kind === "photo") {
      const actual = await sharp(`${publicDir}${src}`).metadata();
      assert.equal(dimensions[src].width, actual.width);
      assert.equal(dimensions[src].height, actual.height);
    }
  }
});

test("cues never overlap, leave breathing room, and mount at most one video", () => {
  memoryTimeline.forEach((cue, index) => {
    assert.ok(cue.end - cue.start >= 2, `cue ${index} is too short`);
    assert.ok(cue.end - cue.start > MEMORY_FADE_SECONDS * 2);
    assert.ok(cue.assets.length <= 2);
    assert.ok(cue.assets.filter((asset) => asset.kind === "video").length <= 1);
    if (index) assert.ok(memoryTimeline[index - 1].end < cue.start);
  });
});

test("seeking forward, backwards, into gaps or replaying resolves the correct card", () => {
  for (const [index, cue] of memoryTimeline.entries()) {
    assert.equal(getMemoryIndex(cue.start), index);
    assert.equal(getMemoryIndex(cue.end - 0.001), index);
    assert.equal(getMemoryIndex(cue.end), -1);
  }
  for (const index of [memoryTimeline.length - 1, 3, 20, 0, 16, 7]) assert.equal(getMemoryIndex(memoryTimeline[index].start + 1), index);
  assert.equal(getMemoryIndex(0), -1);
  assert.equal(getMemoryIndex(48), -1);
  assert.equal(getMemoryIndex(79), -1);
  for (const time of [2, 150, 163, 175]) assert.equal(getMemoryIndex(time), -1, `Expected a breathing gap at ${time}s`);
  assert.equal(getMemoryIndex(207.46), memoryTimeline.length - 1);
});

test("tender verse and final chorus have intentionally assigned memories", () => {
  assert.match(memoryTimeline[getMemoryIndex(63.5)].assets[0].src, /foto-28/);
  assert.match(memoryTimeline[getMemoryIndex(67)].assets[0].src, /foto-08/);
  assert.equal(memoryTimeline[getMemoryIndex(107)].caption, "Verte bailar por siempre");
  assert.equal(memoryTimeline[getMemoryIndex(195)].caption, "Tú y yo, por siempre");
});
