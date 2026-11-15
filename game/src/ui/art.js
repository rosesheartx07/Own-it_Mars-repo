// Station drawings in inline SVG (made by us, no image licenses needed).
const wrap = (inner, cls = '') => `<svg class="art ${cls}" viewBox="0 0 120 100" aria-hidden="true">${inner}</svg>`;
const shadow = '<ellipse cx="60" cy="88" rx="44" ry="7" fill="#5a1d0a" opacity=".35"/>';

export const ART = {
  habitat: wrap(`${shadow}
    <rect x="18" y="58" width="84" height="26" rx="6" fill="#d9d3c7"/>
    <path d="M24 60 a36 34 0 0 1 72 0z" fill="#f4efe6" stroke="#b9b1a3" stroke-width="2"/>
    <path d="M36 44 a26 22 0 0 1 22 -14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    <rect x="52" y="64" width="16" height="20" rx="3" fill="#4b6a88"/>
    <circle cx="34" cy="70" r="5" fill="#8fd3ff" stroke="#4b6a88" stroke-width="2"/>
    <circle cx="86" cy="70" r="5" fill="#8fd3ff" stroke="#4b6a88" stroke-width="2"/>
    <rect x="57" y="18" width="3" height="14" fill="#888"/><circle cx="58.5" cy="16" r="4" fill="#e4572e"/>`),
  solar: wrap(`${shadow}
    ${[0, 1, 2].map(i => `
      <rect x="${22 + i * 28}" y="62" width="3" height="22" fill="#777"/>
      <g transform="translate(${10 + i * 28} ${36 + (i % 2) * 4}) skewX(-18)">
        <rect width="30" height="26" rx="2" fill="#2a4f8f" stroke="#c9d6ea" stroke-width="2"/>
        <path d="M10 0v26M20 0v26M0 9h30M0 17h30" stroke="#7fa6e0" stroke-width="1.2"/>
      </g>`).join('')}
    <circle cx="102" cy="16" r="9" fill="#ffd34d"/><circle cx="102" cy="16" r="14" fill="#ffd34d" opacity=".3"/>`),
  greenhouse: wrap(`${shadow}
    <rect x="16" y="70" width="88" height="14" rx="4" fill="#cfc6b6"/>
    <path d="M18 72 a42 40 0 0 1 84 0z" fill="#b8f0d8" opacity=".75" stroke="#7cc7a8" stroke-width="2"/>
    <path d="M60 32v40M32 44l10 28M88 44l-10 28" stroke="#7cc7a8" stroke-width="1.5"/>
    <ellipse cx="60" cy="40" rx="30" ry="6" fill="#c38dff" opacity=".35"/>
    ${[30, 44, 58, 72, 86].map((x, i) => `<circle cx="${x}" cy="${66 - (i % 2) * 4}" r="${6 + (i % 2) * 2}" fill="${i % 2 ? '#4caf50' : '#7bd36b'}"/>`).join('')}`),
  garage: wrap(`${shadow}
    <rect x="12" y="44" width="62" height="40" rx="4" fill="#c9a27a"/>
    <path d="M10 46 L43 26 L76 46z" fill="#a5754e"/>
    <rect x="24" y="58" width="38" height="26" rx="2" fill="#5b4636"/>
    <path d="M24 64h38M24 70h38M24 76h38" stroke="#7a604a" stroke-width="2"/>
    <path d="M84 84 L88 58 L104 40" stroke="#f1b13b" stroke-width="7" stroke-linecap="round" fill="none"/>
    <circle cx="88" cy="58" r="5" fill="#555"/><circle cx="104" cy="40" r="4" fill="#555"/>
    <path d="M104 40 l8 -6 M104 40 l9 2" stroke="#555" stroke-width="3" stroke-linecap="round"/>
    <rect x="78" y="82" width="16" height="5" rx="2" fill="#555"/>`),
  crater: wrap(`
    <ellipse cx="60" cy="62" rx="52" ry="28" fill="#8e3a14"/>
    <ellipse cx="60" cy="64" rx="40" ry="20" fill="#6e2a0c"/>
    <ellipse cx="60" cy="67" rx="26" ry="11" fill="#561f08"/>
    <path d="M10 58 a52 28 0 0 1 100 0" stroke="#c4683a" stroke-width="4" fill="none"/>
    <rect x="70" y="36" width="3" height="28" fill="#ddd"/><path d="M73 37 h16 l-4 6 h-12z" fill="#e4572e"/>
    <rect x="36" y="56" width="10" height="8" rx="1" fill="#ddd"/><circle cx="41" cy="54" r="3" fill="#7cff8c"/>`),
  ship: wrap(`${shadow}
    <path d="M60 8 C76 22 80 44 78 70 H42 C40 44 44 22 60 8z" fill="#f4f1ea" stroke="#b9b1a3" stroke-width="2"/>
    <circle cx="60" cy="38" r="8" fill="#8fd3ff" stroke="#4b6a88" stroke-width="3"/>
    <path d="M42 56 L26 80 H44z M78 56 L94 80 H76z" fill="#e4572e"/>
    <rect x="50" y="70" width="20" height="8" fill="#888"/>
    <path d="M52 78 q8 14 16 0" fill="#ffb347" opacity=".9"/>`),
  lab: wrap(`${shadow}
    <path d="M14 84 L40 34 H80 L106 84z" fill="#fafafa" stroke="#c8c8c8" stroke-width="2"/>
    <path d="M40 34 L60 84 L80 34" stroke="#ddd" stroke-width="2" fill="none"/>
    <rect x="48" y="58" width="24" height="26" rx="2" fill="#7fb0d6"/>
    <path d="M57 44 v10 l-8 16 h22 l-8 -16 v-10z" fill="#bff3c9" stroke="#3a7d4f" stroke-width="2"/>
    <circle cx="58" cy="64" r="2" fill="#3a7d4f"/><circle cx="64" cy="62" r="1.6" fill="#3a7d4f"/>`),
  dust: wrap(`
    <path d="M6 60 q20 -18 40 0 t40 0 t40 0" stroke="#c4683a" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M0 40 q20 -18 40 0 t40 0 t40 0" stroke="#e08a52" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M10 78 q20 -14 40 0 t40 0" stroke="#a8502a" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>
    ${[[20, 22], [50, 30], [84, 18], [100, 70], [30, 90], [70, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#c4683a"/>`).join('')}`),
};

// The map background: a top-down Martian landscape.
export const MAP_SVG = `<svg class="map-bg" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <radialGradient id="ground" cx="50%" cy="45%" r="75%">
      <stop offset="0" stop-color="#d9733f"/><stop offset=".6" stop-color="#bf5428"/><stop offset="1" stop-color="#8e3612"/>
    </radialGradient>
    <radialGradient id="crater"><stop offset="0" stop-color="#7a2c0c"/><stop offset=".7" stop-color="#9b3f17"/><stop offset="1" stop-color="#d9733f" stop-opacity="0"/></radialGradient>
    <pattern id="grain" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="7" r="1.4" fill="#fff" opacity=".08"/><circle cx="28" cy="22" r="1.2" fill="#000" opacity=".08"/><circle cx="16" cy="34" r="1" fill="#fff" opacity=".07"/>
    </pattern>
  </defs>
  <rect width="1000" height="620" fill="url(#ground)"/>
  <rect width="1000" height="620" fill="url(#grain)"/>
  ${[[120, 520, 70], [880, 110, 55], [520, 560, 40], [930, 470, 80], [60, 90, 45], [470, 90, 30], [700, 300, 26]].map(([x, y, r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#crater)"/><circle cx="${x - r * .15}" cy="${y - r * .15}" r="${r * .82}" fill="none" stroke="#e8935e" stroke-width="3" opacity=".35"/>`).join('')}
  <path d="M0 250 q120 -40 250 0 t250 0" stroke="#e8935e" stroke-width="16" fill="none" opacity=".18"/>
  <path d="M520 380 q120 -40 250 0 t250 0" stroke="#e8935e" stroke-width="14" fill="none" opacity=".18"/>
</svg>
<svg class="map-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <path d="M25 18 V82 M75 18 V82 M25 50 H75 M25 18 H75 M25 82 H75" stroke="#f6c9a0" stroke-width="10" stroke-dasharray="2 18" stroke-linecap="round" fill="none" opacity=".7" vector-effect="non-scaling-stroke"/>
</svg>`;
