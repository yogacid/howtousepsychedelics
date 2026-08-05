// ─────────────────────────────────────────────────────────────
// Scans site prose against docs/voice.md.
//
// Catches the MECHANICAL violations only — banned words and phrases,
// em-dash density, structural tics. It cannot judge rhythm, whether an
// opening is concrete, or whether a closing lands. Those need a human.
//
// Reports; never fails a build. `npm run check:voice`
//   --page <name>   limit to one page/post
//   --rule <id>     limit to one rule
// ─────────────────────────────────────────────────────────────

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const only = (f) => { const i = args.indexOf(f); return i > -1 ? args[i + 1] : null; };
const onlyPage = only('--page');
const onlyRule = only('--rule');

// ── Rules ───────────────────────────────────────────────────
// `word: true` wraps the pattern in word boundaries.
// Filler only. Words with a legitimate technical sense in this domain were
// removed in Aug 2026 after a site-wide sweep showed them firing almost
// entirely on correct usage — robust, elevate, synergy, therapeutic,
// landscape, holding space. See docs/voice.md for the reasoning; don't
// re-add them without new evidence that they're actually being misused.
const BANNED_WORDS = [
  'delve', 'tapestry', 'leverage', 'streamline', 'cutting-edge',
  'multifaceted', 'holistic', 'paradigm', 'game-changer',
  'game-changing', 'groundbreaking', 'unlock', 'unleash', 'empower',
  'foster', 'harness', 'spearhead', 'embark', 'high vibration',
  'raising consciousness',
];

// Flagged for a human to judge rather than banned.
const SOFT_WORDS = ['evidence-based', 'landmark'];

const BANNED_PHRASES = [
  "it's worth noting", 'it is worth noting', "it's important to remember",
  'it is important to remember', "in today's", 'in the world of',
  'at htup, we believe', 'as we navigate these uncertain times',
  "let's dive in", "let's get into it", 'the good news is',
  "here's the thing", 'at its core', 'the universe is telling us',
];

const SPARING = ['journey', 'transformative', 'navigate', 'integration', 'sacred', 'ancient wisdom'];

const RULES = [
  { id: 'banned-word', label: 'Banned word', list: BANNED_WORDS, word: true, sev: 'high' },
  { id: 'soft-word', label: 'Context-dependent word', list: SOFT_WORDS, word: true, sev: 'check' },
  { id: 'banned-phrase', label: 'Banned phrase', list: BANNED_PHRASES, sev: 'high' },
];

// ── Text extraction ─────────────────────────────────────────
function proseFromAstro(src) {
  // Strip frontmatter, script/style blocks, tags, and entities so we score
  // the words a reader actually sees.
  let s = src.replace(/^---[\s\S]*?---/, '');
  s = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&')
       .replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ');
  return s.replace(/\s+/g, ' ').trim();
}
function proseFromMd(src) {
  let s = src.replace(/^---[\s\S]*?---/, '');
  s = s.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  return s.replace(/\s+/g, ' ').trim();
}

function context(text, idx, len) {
  const a = Math.max(0, idx - 45), b = Math.min(text.length, idx + len + 45);
  return (a > 0 ? '…' : '') + text.slice(a, b).trim() + (b < text.length ? '…' : '');
}

// ── Scan ────────────────────────────────────────────────────
const files = [];
for (const f of await readdir(path.join(ROOT, 'src/pages'))) {
  if (f.endsWith('.astro') && f !== '404.astro') files.push({ name: f.replace('.astro', ''), p: path.join(ROOT, 'src/pages', f), kind: 'astro' });
}
for (const f of await readdir(path.join(ROOT, 'src/content/blog'))) {
  if (f.endsWith('.md')) files.push({ name: 'blog/' + f.replace('.md', ''), p: path.join(ROOT, 'src/content/blog', f), kind: 'md' });
}

const findings = [];
const stats = [];

for (const f of files) {
  if (onlyPage && !f.name.includes(onlyPage)) continue;
  const raw = await readFile(f.p, 'utf8');
  const text = f.kind === 'astro' ? proseFromAstro(raw) : proseFromMd(raw);
  if (text.split(' ').length < 60) continue;
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).length;

  for (const rule of RULES) {
    if (onlyRule && rule.id !== onlyRule) continue;
    for (const term of rule.list) {
      const pat = rule.word
        ? new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|d|ing|ed)?\\b`, 'g')
        : new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      for (const m of lower.matchAll(pat)) {
        findings.push({ page: f.name, rule: rule.id, sev: rule.sev, label: rule.label, term, ctx: context(text, m.index, m[0].length) });
      }
    }
  }

  // "Not X. Y." / "It's not X, it's Y." tic
  if (!onlyRule || onlyRule === 'not-x-y') {
    for (const m of lower.matchAll(/\b(it'?s not|is not|are not|was not) [^.,;]{3,60}[.,] (it'?s|it is|they'?re|but) /g)) {
      findings.push({ page: f.name, rule: 'not-x-y', sev: 'high', label: '"Not X. Y." tic', term: '', ctx: context(text, m.index, m[0].length) });
    }
  }

  // Rhetorical-question opener
  if (!onlyRule || onlyRule === 'rhetorical-open') {
    for (const m of lower.matchAll(/\b(have you ever|ever wondered|what if i told you|did you know)\b/g)) {
      findings.push({ page: f.name, rule: 'rhetorical-open', sev: 'high', label: 'Rhetorical-question opener', term: '', ctx: context(text, m.index, m[0].length) });
    }
  }

  // Em-dash density: budget is 1 per 400 words.
  const dashes = (text.match(/—/g) || []).length;
  const budget = Math.max(1, Math.round(words / 400));
  if ((!onlyRule || onlyRule === 'em-dash') && dashes > budget) {
    findings.push({ page: f.name, rule: 'em-dash', sev: 'high', label: 'Em-dash overuse', term: `${dashes} used, budget ${budget}`, ctx: `${words} words` });
  }

  const sparing = SPARING.map((w) => {
    const n = (lower.match(new RegExp(`\\b${w}\\w*\\b`, 'g')) || []).length;
    return n ? `${w}×${n}` : null;
  }).filter(Boolean);

  stats.push({ page: f.name, words, dashes, budget, semis: (text.match(/;/g) || []).length, sparing: sparing.join(' ') });
}

// ── Report ──────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
const byPage = {};
for (const f of findings) (byPage[f.page] ||= []).push(f);

const highTotal = findings.filter((f) => f.sev === 'high').length;
const checkTotal = findings.filter((f) => f.sev === 'check').length;

console.log('\n  VOICE SCAN — docs/voice.md\n');
const pages = Object.keys(byPage).sort((a, b) =>
  byPage[b].filter((x) => x.sev === 'high').length - byPage[a].filter((x) => x.sev === 'high').length);

for (const p of pages) {
  const hi = byPage[p].filter((f) => f.sev === 'high');
  const ck = byPage[p].filter((f) => f.sev === 'check');
  if (!hi.length && !ck.length) continue;
  console.log(`  ${p}  —  ${hi.length} to fix, ${ck.length} to check`);
  const seen = new Set();
  for (const f of [...hi, ...ck]) {
    const key = f.rule + f.term + f.ctx.slice(0, 30);
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`    ${f.sev === 'high' ? '✗' : '?'} ${pad(f.label + (f.term ? ` "${f.term}"` : ''), 42)} ${f.ctx}`);
  }
  console.log('');
}

console.log('  ── Density (em-dash budget = 1 per 400 words) ──');
console.log(`  ${pad('page', 34)}${pad('words', 8)}${pad('em-dash', 10)}${pad('semis', 8)}sparing-list usage`);
for (const s of stats.sort((a, b) => (b.dashes / b.budget) - (a.dashes / a.budget)).slice(0, 18)) {
  const flag = s.dashes > s.budget ? '!' : ' ';
  console.log(`  ${pad(s.page, 34)}${pad(s.words, 8)}${pad(`${s.dashes}/${s.budget}${flag}`, 10)}${pad(s.semis, 8)}${s.sparing}`);
}

console.log(`\n  ${highTotal} to fix · ${checkTotal} to check · ${stats.length} files scanned`);
console.log('  Mechanical rules only — rhythm, openings and closings need a human.\n');
