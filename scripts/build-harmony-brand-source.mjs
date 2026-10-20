import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "tmp", "harmony-balaton-villa", "source-svg");
fs.mkdirSync(sourceDir, { recursive: true });

const C = {
  blue: "#183B4E",
  green: "#6F8F89",
  ivory: "#F5F1E8",
  gold: "#C5A36A",
  black: "#000000",
  white: "#FFFFFF",
  paper: "#FFFFFF",
  rule: "#DED8CF",
};

const symbolPath = `
M160 160H300V420H700V160H840L860 180V820L840 840H700V580H300V840H160L140 820V180Z
M300 478
C404 450 492 451 584 478
C632 492 666 495 700 480
V530
C662 544 628 542 582 529
C490 502 402 501 300 530
Z`;

function esc(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
}

function symbol({ x = 0, y = 0, scale = 1, color = C.blue, id = "Symbol" } = {}) {
  return `<g id="${esc(id)}" transform="translate(${x} ${y}) scale(${scale}) translate(-140 -160)">
    <path d="${symbolPath}" fill="${color}" fill-rule="evenodd" clip-rule="evenodd"/>
  </g>`;
}

function wordmark({
  x,
  y,
  anchor = "start",
  nameColor = C.blue,
  descriptorColor = C.green,
  nameSize = 168,
  descriptorSize = 31,
  nameTracking = 10,
  descriptorTracking = 12,
  descriptorGap = 108,
  idPrefix = "",
} = {}) {
  const prefix = idPrefix ? `${idPrefix}_` : "";
  return `<g id="${prefix}Wordmark">
    <text x="${x}" y="${y}" text-anchor="${anchor}" fill="${nameColor}" font-family="Bodoni Moda" font-size="${nameSize}" font-weight="600" letter-spacing="${nameTracking}" font-kerning="normal">HARMONY</text>
  </g>
  <g id="${prefix}Descriptor">
    <text x="${x}" y="${y + descriptorGap}" text-anchor="${anchor}" fill="${descriptorColor}" font-family="Manrope" font-size="${descriptorSize}" font-weight="600" letter-spacing="${descriptorTracking}">BALATON VILLA</text>
  </g>`;
}

function svgDoc({ width, height, title, body, background = null, viewBox = `0 0 ${width} ${height}` }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="${viewBox}">
  <title>${esc(title)}</title>
  <desc>Harmony Balaton Villa identity artwork. Typography is converted to outlines in final production exports.</desc>
  ${background ? `<g id="Background"><rect width="${width}" height="${height}" fill="${background}"/></g>` : ""}
  ${body}
</svg>
`;
}

function lockupHorizontal({
  base = C.blue,
  descriptor = C.green,
  background = null,
  width = 1800,
  height = 600,
} = {}) {
  return svgDoc({
    width,
    height,
    title: "Harmony Balaton Villa - Primary Horizontal Logo",
    background,
    body: `${symbol({ x: 80, y: 90, scale: 0.62, color: base })}
    ${wordmark({ x: 610, y: 286, nameColor: base, descriptorColor: descriptor })}`,
  });
}

function lockupStacked({ base = C.blue, descriptor = C.green, background = null } = {}) {
  return svgDoc({
    width: 1400,
    height: 1100,
    title: "Harmony Balaton Villa - Stacked Logo",
    background,
    body: `${symbol({ x: 440, y: 70, scale: 0.72, color: base })}
    ${wordmark({ x: 700, y: 815, anchor: "middle", nameColor: base, descriptorColor: descriptor, nameSize: 170, descriptorSize: 31, nameTracking: 10, descriptorTracking: 13, descriptorGap: 108 })}`,
  });
}

function monogram({ color = C.blue, background = null, title = "Harmony Balaton Villa - Monogram" } = {}) {
  return svgDoc({
    width: 1000,
    height: 1000,
    title,
    background,
    body: `${symbol({ x: 140, y: 160, scale: 1, color, id: "Standalone_Monogram" })}`,
  });
}

function application({ dark = false } = {}) {
  const bg = dark ? C.blue : C.ivory;
  const base = dark ? C.ivory : C.blue;
  const descriptor = dark ? C.gold : C.green;
  return svgDoc({
    width: 1800,
    height: 900,
    title: `Harmony Balaton Villa - ${dark ? "Dark" : "Light"} Background Application`,
    background: bg,
    body: `<g id="Application_Artwork" transform="translate(0 150)">
      ${symbol({ x: 80, y: 90, scale: 0.62, color: base })}
      ${wordmark({ x: 610, y: 286, nameColor: base, descriptorColor: descriptor })}
    </g>`,
  });
}

function favicon() {
  return svgDoc({
    width: 512,
    height: 512,
    title: "Harmony Balaton Villa - Favicon",
    body: `<g id="Favicon_Background"><rect width="512" height="512" rx="88" fill="${C.blue}"/></g>
    <g id="Favicon_Monogram">${symbol({ x: 76, y: 86, scale: 0.5, color: C.ivory })}</g>`,
  });
}

function social() {
  return svgDoc({
    width: 1080,
    height: 1080,
    title: "Harmony Balaton Villa - Social Profile",
    body: `<g id="Social_Background"><rect width="1080" height="1080" fill="${C.blue}"/></g>
    <g id="Social_Monogram">${symbol({ x: 259, y: 275, scale: 0.78, color: C.ivory })}</g>`,
  });
}

function label(x, y, text, anchor = "start", color = C.blue) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="Manrope" font-size="26" font-weight="600" letter-spacing="7">${esc(text)}</text>`;
}

function identityBoard() {
  return svgDoc({
    width: 2400,
    height: 3360,
    title: "Harmony Balaton Villa - Complete Logo Identity",
    background: C.paper,
    body: `<g id="Presentation_Labels">
      ${label(140, 126, "HARMONY BALATON VILLA / LOGO IDENTITY")}
      <line x1="140" y1="166" x2="2260" y2="166" stroke="${C.rule}" stroke-width="2"/>
      ${label(140, 252, "01 / PRIMARY HORIZONTAL")}
      ${label(140, 1010, "02 / STACKED LOGO")}
      ${label(1330, 1010, "03 / STANDALONE MONOGRAM")}
      ${label(140, 1880, "04 / SINGLE-COLOR VERSIONS")}
      ${label(140, 2410, "05 / LIGHT + DARK APPLICATIONS")}
      ${label(140, 3020, "06 / FAVICON + SOCIAL PROFILE")}
    </g>

    <g id="01_Primary_Horizontal">
      <rect x="140" y="300" width="2120" height="610" rx="28" fill="#FFFFFF" stroke="${C.rule}" stroke-width="2"/>
      <g transform="translate(305 360) scale(0.93)">
        ${symbol({ x: 80, y: 90, scale: 0.62, color: C.blue, id: "Primary_Symbol" })}
        ${wordmark({ x: 610, y: 286, nameColor: C.blue, descriptorColor: C.green, idPrefix: "Primary" })}
      </g>
    </g>

    <g id="02_Stacked_Logo">
      <rect x="140" y="1060" width="1050" height="720" rx="28" fill="#FFFFFF" stroke="${C.rule}" stroke-width="2"/>
      <g transform="translate(225 1115) scale(0.68)">
        ${symbol({ x: 440, y: 70, scale: 0.72, color: C.blue, id: "Stacked_Symbol" })}
        ${wordmark({ x: 700, y: 815, anchor: "middle", nameColor: C.blue, descriptorColor: C.green, nameSize: 170, descriptorSize: 31, nameTracking: 10, descriptorTracking: 13, descriptorGap: 108, idPrefix: "Stacked" })}
      </g>
    </g>

    <g id="03_Standalone_Monogram">
      <rect x="1330" y="1060" width="930" height="720" rx="28" fill="${C.ivory}" stroke="${C.rule}" stroke-width="2"/>
      ${symbol({ x: 1525, y: 1174, scale: 0.75, color: C.blue, id: "Monogram" })}
    </g>

    <g id="04_Black_White">
      <rect x="140" y="1930" width="1010" height="360" rx="28" fill="#FFFFFF" stroke="${C.rule}" stroke-width="2"/>
      <g transform="translate(200 1938) scale(0.52)">
        ${symbol({ x: 80, y: 90, scale: 0.62, color: C.black, id: "Black_Symbol" })}
        ${wordmark({ x: 610, y: 286, nameColor: C.black, descriptorColor: C.black, idPrefix: "Black" })}
      </g>
      <rect x="1250" y="1930" width="1010" height="360" rx="28" fill="${C.blue}"/>
      <g transform="translate(1310 1938) scale(0.52)">
        ${symbol({ x: 80, y: 90, scale: 0.62, color: C.white, id: "White_Symbol" })}
        ${wordmark({ x: 610, y: 286, nameColor: C.white, descriptorColor: C.white, idPrefix: "White" })}
      </g>
    </g>

    <g id="05_Light_Dark_Applications">
      <rect x="140" y="2460" width="1010" height="420" rx="28" fill="${C.ivory}"/>
      <g transform="translate(190 2515) scale(0.54)">
        ${symbol({ x: 80, y: 90, scale: 0.62, color: C.blue, id: "Light_Symbol" })}
        ${wordmark({ x: 610, y: 286, nameColor: C.blue, descriptorColor: C.green, idPrefix: "Light" })}
      </g>
      <rect x="1250" y="2460" width="1010" height="420" rx="28" fill="${C.blue}"/>
      <g transform="translate(1300 2515) scale(0.54)">
        ${symbol({ x: 80, y: 90, scale: 0.62, color: C.ivory, id: "Dark_Symbol" })}
        ${wordmark({ x: 610, y: 286, nameColor: C.ivory, descriptorColor: C.gold, idPrefix: "Dark" })}
      </g>
    </g>

    <g id="06_Favicon_Social">
      <rect x="140" y="3070" width="230" height="230" rx="42" fill="${C.blue}"/>
      ${symbol({ x: 174, y: 3108, scale: 0.225, color: C.ivory, id: "Favicon_Symbol" })}
      <circle cx="545" cy="3185" r="115" fill="${C.blue}"/>
      ${symbol({ x: 464, y: 3109, scale: 0.225, color: C.ivory, id: "Social_Symbol" })}
      <g id="Palette" transform="translate(900 3070)">
        <rect x="0" y="0" width="230" height="150" rx="18" fill="${C.blue}"/>
        <rect x="250" y="0" width="230" height="150" rx="18" fill="${C.green}"/>
        <rect x="500" y="0" width="230" height="150" rx="18" fill="${C.ivory}" stroke="${C.rule}"/>
        <rect x="750" y="0" width="230" height="150" rx="18" fill="${C.gold}"/>
        <text x="0" y="198" fill="${C.blue}" font-family="Manrope" font-size="23" font-weight="600" letter-spacing="2">#183B4E</text>
        <text x="250" y="198" fill="${C.blue}" font-family="Manrope" font-size="23" font-weight="600" letter-spacing="2">#6F8F89</text>
        <text x="500" y="198" fill="${C.blue}" font-family="Manrope" font-size="23" font-weight="600" letter-spacing="2">#F5F1E8</text>
        <text x="750" y="198" fill="${C.blue}" font-family="Manrope" font-size="23" font-weight="600" letter-spacing="2">#C5A36A</text>
      </g>
    </g>`,
  });
}

const assets = new Map([
  ["primary-horizontal.svg", lockupHorizontal()],
  ["stacked.svg", lockupStacked()],
  ["monogram.svg", monogram()],
  ["primary-horizontal-black.svg", lockupHorizontal({ base: C.black, descriptor: C.black })],
  ["primary-horizontal-white.svg", lockupHorizontal({ base: C.white, descriptor: C.white })],
  ["light-application.svg", application({ dark: false })],
  ["dark-application.svg", application({ dark: true })],
  ["favicon.svg", favicon()],
  ["social-profile.svg", social()],
  ["identity-board.svg", identityBoard()],
]);

for (const [name, data] of assets) {
  fs.writeFileSync(path.join(sourceDir, name), data, "utf8");
}

fs.writeFileSync(
  path.join(sourceDir, "manifest.json"),
  JSON.stringify(
    {
      brand: "Harmony Balaton Villa",
      concept: "Stillwater H",
      colors: C,
      typography: { display: "Bodoni Moda SemiBold", descriptor: "Manrope SemiBold" },
      assets: [...assets.keys()],
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`Wrote ${assets.size} SVG source files to ${sourceDir}`);
