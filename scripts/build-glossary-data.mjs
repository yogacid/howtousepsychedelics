import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Extracts glossary terms from the glossary page into public/glossary-data.json,
// consumed by the tooltip/auto-link script in Base.astro.

const GLOSSARY_FILE = join(import.meta.dirname, '..', 'src', 'pages', 'glossary.astro');
const OUT_FILE = join(import.meta.dirname, '..', 'public', 'glossary-data.json');

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

const src = await readFile(GLOSSARY_FILE, 'utf-8');

const termRe = /<div class="glossary-term" id="([^"]+)">\s*<h3 class="glossary-term-name"><a[^>]*>([\s\S]*?)<\/a><\/h3>\s*<p class="glossary-term-def">([\s\S]*?)<\/p>/g;

const terms = [];
let m;
while ((m = termRe.exec(src)) !== null) {
  const id = m[1];
  const fullName = stripHtml(m[2]);
  const def = stripHtml(m[3]);

  // "Sitter (trip sitter)" → names: ["Sitter", "trip sitter"];
  // "Closed-eye visuals (CEVs)" → ["Closed-eye visuals", "CEVs"]
  const names = [];
  const parenMatch = fullName.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    names.push(parenMatch[1].trim());
    parenMatch[2].split('/').forEach((alias) => {
      const a = alias.trim();
      if (a && !/^e\.g\./.test(a)) names.push(a);
    });
  } else {
    names.push(fullName);
  }
  // "Empathogen / entactogen" → both halves
  if (names[0].includes(' / ')) {
    const parts = names[0].split(' / ').map((s) => s.trim());
    names.splice(0, 1, ...parts);
  }

  terms.push({ id, name: fullName, names, def });
}

if (!terms.length) {
  console.error('build-glossary-data: no terms found — check glossary.astro markup');
  process.exit(1);
}

await writeFile(OUT_FILE, JSON.stringify(terms));
console.log(`build-glossary-data: wrote ${terms.length} terms to public/glossary-data.json`);
