import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const outDir = path.join(root, "public/assets/wallpapers");
const asset = (...parts) => path.join(root, "public/assets", ...parts);

await fs.mkdir(outDir, { recursive: true });

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const makeSprite = async (file, size) =>
  sharp(file).resize(size, size, { fit: "contain", kernel: "nearest" }).png().toBuffer();

const makeFitSprite = async (file, width, height) =>
  sharp(file).resize(width, height, { fit: "contain", kernel: "nearest" }).png().toBuffer();

async function makeWallpaper(config) {
  const boo = await makeSprite(config.booFile, 470);
  const food = await makeSprite(asset("items", "food-pickup.png"), 58);
  const bomb = await makeFitSprite(asset("items", "bomb.png"), 120, 52);
  const bee = await makeSprite(asset("monsters", "bee.png"), 82);
  const spike = await makeSprite(asset("monsters", "spike.png"), 82);

  const svg = Buffer.from(`
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${config.colors.skyTop}"/>
          <stop offset="55%" stop-color="${config.colors.skyMid}"/>
          <stop offset="100%" stop-color="${config.colors.skyBottom}"/>
        </linearGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${config.colors.panelA}" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="${config.colors.panelB}" stop-opacity="0.78"/>
        </linearGradient>
        <pattern id="stripe" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="28" height="56" fill="rgba(255,255,255,0.14)"/>
        </pattern>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="28" stdDeviation="0" flood-color="#1f2230" flood-opacity="0.16"/>
        </filter>
      </defs>

      <rect width="1920" height="1080" fill="url(#sky)"/>
      <rect width="1920" height="1080" fill="url(#stripe)" opacity="0.48"/>

      <circle cx="215" cy="188" r="150" fill="rgba(255,255,255,0.22)"/>
      <circle cx="1640" cy="178" r="220" fill="${config.colors.glow}" opacity="0.28"/>
      <circle cx="1450" cy="790" r="310" fill="rgba(255,255,255,0.13)"/>

      <g opacity="0.5">
        ${config.decorations}
      </g>

      <circle cx="395" cy="510" r="270" fill="rgba(255,255,255,0.17)"/>
      <circle cx="512" cy="455" r="126" fill="${config.colors.glow}" opacity="0.28"/>
      <text x="150" y="822" font-family="Inter, Arial, sans-serif" font-size="96" font-weight="900" fill="#1f2230" letter-spacing="0">${escapeXml(config.titleLine1)}</text>
      <text x="154" y="884" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="850" fill="#414553">${escapeXml(config.subtitle)}</text>

      <rect x="1060" y="150" width="670" height="770" rx="54" fill="rgba(255,255,255,0.23)" stroke="rgba(255,255,255,0.42)" stroke-width="8"/>
      <rect x="1132" y="220" width="530" height="630" rx="48" fill="rgba(255,255,255,0.24)"/>

      <text x="1505" y="1005" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="900" fill="rgba(31,34,48,0.56)">Happy Boo Game</text>
    </svg>
  `);

  const composites = [
    { input: svg, left: 0, top: 0 },
    { input: boo, left: 1190, top: 262 },
    { input: food, left: 1410, top: 780 },
    { input: bomb, left: 1210, top: 802 },
    { input: bee, left: 1508, top: 230 },
    { input: spike, left: 1590, top: 728 }
  ];

  await sharp({
    create: {
      width: 1920,
      height: 1080,
      channels: 4,
      background: config.colors.skyTop
    }
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, config.fileName));
}

await makeWallpaper({
  fileName: "gold-boo-desktop-background.png",
  booFile: asset("boo", "gold-boo.png"),
  eyebrow: "Coin streak wallpaper",
  titleLine1: "Gold Boo",
  titleLine2: "",
  subtitle: "1920 x 1080 desktop background",
  subtitle2: "",
  badge: "Free download",
  colors: {
    skyTop: "#54b7ec",
    skyMid: "#92dcef",
    skyBottom: "#ffe58a",
    panelA: "#fff7d7",
    panelB: "#ffd24b",
    glow: "#ffd24b",
    eyebrow: "#7c5200",
    badge: "#ffd24b"
  },
  decorations: `
    <circle cx="1150" cy="142" r="18" fill="#ffd24b"/>
    <circle cx="1206" cy="126" r="14" fill="#ffd24b"/>
    <circle cx="1756" cy="604" r="18" fill="#ffd24b"/>
    <circle cx="1812" cy="635" r="12" fill="#ffd24b"/>
    <rect x="1120" y="875" width="620" height="28" rx="14" fill="#f3a51f"/>
    <rect x="1160" y="922" width="450" height="20" rx="10" fill="#ffd24b"/>
  `
});

await makeWallpaper({
  fileName: "sappy-boo-desktop-background.png",
  booFile: asset("boo", "sappy-boo.png"),
  eyebrow: "Forest wallpaper",
  titleLine1: "Sappy Boo",
  titleLine2: "",
  subtitle: "1920 x 1080 desktop background",
  subtitle2: "",
  badge: "Free download",
  colors: {
    skyTop: "#6cc8ec",
    skyMid: "#95e2ca",
    skyBottom: "#e7f7a6",
    panelA: "#f4ffd7",
    panelB: "#86d95b",
    glow: "#86d95b",
    eyebrow: "#396b13",
    badge: "#86d95b"
  },
  decorations: `
    <path d="M1130 900 L1180 780 L1230 900 Z" fill="#4d9a45"/>
    <path d="M1260 900 L1322 740 L1384 900 Z" fill="#3f8e40"/>
    <path d="M1660 905 L1725 748 L1790 905 Z" fill="#4d9a45"/>
    <rect x="1202" y="890" width="780" height="34" rx="17" fill="#6fbf55"/>
    <circle cx="1090" cy="210" r="18" fill="#86d95b"/>
    <circle cx="1780" cy="418" r="22" fill="#86d95b"/>
  `
});

console.log("Generated wallpapers in public/assets/wallpapers");
