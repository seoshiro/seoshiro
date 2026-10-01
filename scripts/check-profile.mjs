import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";
const readme = await readFile("README.md", "utf8");
const images = [...readme.matchAll(/(?:src|srcset)="([^"]+)"|!\[([^\]]+)\]\(([^)]+)\)/g)];

test("Profile images are repository-local, descriptive, complete PNGs", async () => {
  assert.ok(images.length >= 6);
  assert.match(readme, /<img alt="[^"]{15,}"/);
  for (const image of images) {
    const path = image[1] || image[3];
    assert.match(path, /^assets\/[a-z-]+\.png$/);
    if (image[3]) assert.ok(image[2].length >= 30, `Missing useful alt: ${path}`);
    const data = await readFile(path);
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
