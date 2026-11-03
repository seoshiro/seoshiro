import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import { createHash } from "node:crypto";
const readme = await readFile("README.md", "utf8");
const images = [...readme.matchAll(/(?:src|srcset)="([^"]+)"|!\[([^\]]+)\]\(([^)]+)\)/g)];

test("Profile images are repository-local, descriptive, complete PNGs or SVGs", async () => {
  assert.ok(images.length >= 6);
  assert.match(readme, /<img alt="[^"]{15,}"/);
  for (const image of images) {
    const path = image[1] || image[3];
    assert.match(path, /^assets\/[a-z-]+\.(png|svg)$/);
    if (image[3]) assert.ok(image[2].length >= 30, `Missing useful alt: ${path}`);
    const data = await readFile(path);
    if (path.endsWith(".svg")) {
      const svg = data.toString("utf8");
      assert.match(svg, /viewBox="0 0 1200 340"/);
      assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
      assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
      assert.doesNotMatch(svg, /<script|<foreignObject|https?:\/\/(?!www\.w3\.org\/2000\/svg)|url\(/i);
      continue;
    }
    assert.equal(data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", path);
    assert.equal(data.readUInt32BE(16), 1200, path);
    assert.ok(data.readUInt32BE(20) > 200 && data.readUInt32BE(20) < 1000, path);
    assert.ok(data.length < 1024 * 1024, `${path} is needlessly large`);
  }
});

test("Links use the documented project and portfolio destinations", () => {
  const urls = [...readme.matchAll(/https:\/\/[^)\s"<>]+/g)].map(m => m[0]);
  const hosts = new Set(["github.com", "seoshiro.github.io", "forme-studio-coral.vercel.app"]);
  for (const url of urls) assert.ok(hosts.has(new URL(url).hostname), url);
  assert.ok(urls.includes("https://seoshiro.github.io/"));
  for (const repo of ["perch-studio", "selvedge-studio", "forme-studio", "guidecheck", "archiveguard", "aitudesk", "AssetControl"])
    assert.ok(urls.includes(`https://github.com/seoshiro/${repo}`), repo);
  assert.match(readme, /## Selected work/);
  assert.match(readme, /\(#selected-work\)/);
});

test("Native GitHub markup stays readable without external widgets or styles", async () => {
  assert.doesNotMatch(readme, /<script|<iframe|style=|class=|<table|shields\.io|github-readme-stats|visitor|typing-svg/i);
  assert.match(readme, /prefers-color-scheme: dark/);
  assert.match(readme, /prefers-color-scheme: light/);
  assert.match(readme, /local data you can keep/);
  assert.match(readme, /rectangular room/);
  for (const path of ["assets/README.md", "scripts/build-banner.mjs"]) assert.ok((await stat(path)).isFile());
});

test("The original product screenshots are preserved byte for byte", async () => {
  const originals = {
    "assets/perch.png": "fbdb407b3ee589bd2148365a184f759d95276e26",
    "assets/selvedge-workroom.png": "3a1673f88294f85d5d7334fd1742a0c62d6f47dc",
    "assets/forme-moodboard.png": "24c7b8e43780fc0ddbe761f823a13023bbe4823d",
  };
  for (const [path, expected] of Object.entries(originals)) {
    const data = await readFile(path);
    const actual = createHash("sha1").update(`blob ${data.length}\0`).update(data).digest("hex");
    assert.equal(actual, expected, path);
  }
});
