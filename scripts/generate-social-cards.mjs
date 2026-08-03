import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const outputDirectory = new URL("../public/social/", import.meta.url);
const cards = [
  {
    file: "default-card.png",
    eyebrow: "JOHN PATRICK COLLINS",
    title: ["Science. Software.", "Music. Research."],
    accent: "#c7f36b",
  },
  {
    file: "bioinformatics-card.png",
    eyebrow: "JOHN PATRICK COLLINS / PORTFOLIO",
    title: ["Bioinformatics", "& scientific software"],
    accent: "#64ddc4",
  },
  {
    file: "research-card.png",
    eyebrow: "JOHN PATRICK COLLINS / RESEARCH",
    title: ["Constraint. Context.", "Causal response."],
    accent: "#c7f36b",
  },
];

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
}

function helixRungs() {
  return Array.from({ length: 10 }, (_, index) => {
    const y = 105 + index * 46;
    const offset = Math.sin(index * 1.25) * 62;
    return `<path d="M${(889 + offset).toFixed(1)} ${y} L${(1011 - offset).toFixed(1)} ${y}"/>`;
  }).join("");
}

function cardSvg(card) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="627" viewBox="0 0 1200 627">
      <rect width="1200" height="627" fill="#0a1717"/>
      <path d="M0 530 C210 430 355 620 580 520 S980 405 1200 515 V627 H0Z" fill="#102a28"/>
      <g fill="none" stroke="#254b47" stroke-width="2" opacity=".8">
        <path d="M855 72 C1045 135 1045 492 855 555"/>
        <path d="M1045 72 C855 135 855 492 1045 555"/>
        ${helixRungs()}
      </g>
      <circle cx="950" cy="314" r="9" fill="${card.accent}"/>
      <rect x="76" y="74" width="42" height="5" fill="${card.accent}"/>
      <text x="136" y="83" fill="#a8bbb7" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" letter-spacing="3">${escapeXml(card.eyebrow)}</text>
      <text x="76" y="250" fill="#f2f5ed" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" letter-spacing="-2">${escapeXml(card.title[0])}</text>
      <text x="76" y="330" fill="${card.accent}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" letter-spacing="-2">${escapeXml(card.title[1])}</text>
      <line x1="76" y1="480" x2="712" y2="480" stroke="#31504d"/>
      <text x="76" y="526" fill="#a8bbb7" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="1">johnpatrickcollins.info</text>
    </svg>`;
}

await mkdir(outputDirectory, { recursive: true });

for (const card of cards) {
  await sharp(Buffer.from(cardSvg(card)))
    .png({ compressionLevel: 9, palette: true })
    .toFile(fileURLToPath(new URL(card.file, outputDirectory)));
}

console.log(`Generated ${cards.length} social preview cards.`);
