import { mkdir, writeFile } from "node:fs/promises";
// Reuse the portfolio's original parametric ribbon, with a still frontal camera.
const point = (u, v) => {
  const r = 2 + Math.cos(3 * u) * 0.52;
  return [(r + v * Math.cos(u * 1.5)) * Math.cos(2 * u), (r + v * Math.cos(u * 1.5)) * Math.sin(2 * u), Math.sin(3 * u) * 0.75 + v * Math.sin(u * 1.5)];
};
const rotate = ([x, y, z]) => {
  const yaw = 0.38, pitch = -0.19;
  const nx = x * Math.cos(yaw) + z * Math.sin(yaw), nz = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return [nx, y * Math.cos(pitch) - nz * Math.sin(pitch), y * Math.sin(pitch) + nz * Math.cos(pitch)];
};
const patches = [];
for (let i = 0; i < 128; i++) {
  const u = i / 128 * Math.PI * 2, u2 = (i + 1.035) / 128 * Math.PI * 2;
  for (let j = 0; j < 9; j++) {
    const v = -0.54 + j / 9 * 1.08, v2 = v + 1.08 / 9 * 0.82;
    const points = [[u, v], [u2, v], [u2, v2], [u, v2]].map(([a, b]) => rotate(point(a, b)));
    const shade = 0.45 + 0.55 * (Math.cos(u * 2 + 0.38) * 0.5 + 0.5);
    const color = j < 3 || j > 6 ? [135 + 108 * shade, 142 + 105 * shade, 158 + 92 * shade] : [51 + 67 * shade, 69 + 84 * shade, 165 + 83 * shade];
    patches.push({ points, depth: points.reduce((s, p) => s + p[2], 0) / 4, color: color.map(Math.round).join(",") });
  }
}
patches.sort((a, b) => a.depth - b.depth);
const ribbon = patches.map(({ points, color }) => {
  const path = points.map(([x, y, z], i) => {
    const perspective = 8 / (8 - z * 0.35);
    return `${i ? "L" : "M"}${(926 + x * 70 * perspective).toFixed(2)},${(207 + y * 70 * perspective).toFixed(2)}`;
  }).join(" ");
  return `<path d="${path} Z" fill="rgb(${color})"/>`;
}).join("");
await mkdir("assets", { recursive: true });
for (const [theme, bg, fg, accent, muted, line] of [
  ["dark", "#111214", "#eff0f3", "#8da2ff", "#c2c5cf", "#36373d"],
  ["light", "#f2f0eb", "#17191e", "#4c63be", "#4e535f", "#d2d0cb"],
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="420" viewBox="0 0 1200 420"><title>seoshiro — Useful by design.</title><rect width="1200" height="420" rx="12" fill="${bg}"/><path d="M68 105H1132M68 362H1132" stroke="${line}"/><g font-family="Arial, Helvetica, sans-serif"><text x="68" y="72" font-size="28" font-weight="700" letter-spacing="-1" fill="${fg}">seoshiro<tspan fill="${accent}">.</tspan></text><text x="68" y="210" font-size="86" font-weight="500" letter-spacing="-4" fill="${fg}">Useful by</text><text x="68" y="299" font-size="86" font-weight="500" letter-spacing="-4" fill="${accent}">design.</text><text x="68" y="395" font-size="22" letter-spacing="0.5" fill="${muted}">BROWSER TOOLS / CREATIVE WORKSPACES</text></g>${ribbon}</svg>`;
  await writeFile(`assets/banner-${theme}.svg`, svg);
}
console.log("Original light and dark banner vectors generated.");
