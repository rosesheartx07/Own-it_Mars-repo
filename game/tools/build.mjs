// Builds a single self-contained HTML file (dist/mars-outpost.html) that works offline,
// by double-click (file://) or on any static host. Usage: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modules = [ // dependency order
  ['engine', 'src/engine/engine.js'],
  ['content', 'src/game/content.js'],
  ['art', 'src/ui/art.js'],
  ['audio', 'src/ui/audio.js'],
  ['ui', 'src/ui/ui.js'],
];
const nameOf = Object.fromEntries(modules.map(([n, p]) => [p.split('/').pop(), n]));

let js = '';
for (const [name, path] of modules) {
  let code = readFileSync(join(root, path), 'utf8');
  if (name === 'audio') { // embed the song so the single file works offline
    const mp3 = readFileSync(join(root, 'assets/audio/music.mp3')).toString('base64');
    code = code.replace("'assets/audio/music.mp3'", () => `'data:audio/mpeg;base64,${mp3}'`);
  }
  const exported = [...code.matchAll(/^export (?:const|let|function) (\w+)/gm)].map(m => m[1]);
  code = code
    .replace(/^import \* as (\w+) from '([^']+)';$/gm, (_, alias, from) => `const ${alias} = __m_${nameOf[from.split('/').pop()]};`)
    .replace(/^import \{([^}]+)\} from '([^']+)';$/gm, (_, names, from) => `const {${names}} = __m_${nameOf[from.split('/').pop()]};`)
    .replace(/^export /gm, '');
  js += `const __m_${name} = (() => {\n${code}\nreturn { ${exported.join(', ')} };\n})();\n`;
}
js += '__m_ui.init();\n';

const css = readFileSync(join(root, 'src/ui/style.css'), 'utf8');
let html = readFileSync(join(root, 'index.html'), 'utf8')
  .replace('<link rel="stylesheet" href="src/ui/style.css">', () => `<style>\n${css}</style>`)
  .replace(/<script type="module">[\s\S]*?<\/script>/, () => `<script>\n${js}</script>`);

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/mars-outpost.html'), html);
console.log(`dist/mars-outpost.html written (${(html.length / 1024).toFixed(1)} KB)`);
