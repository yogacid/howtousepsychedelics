// ─────────────────────────────────────────────────────────────
// Scans site prose against docs/voice.md.
//
// Catches the MECHANICAL violations only — banned words and phrases,
// em-dash density, structural tics. It cannot judge rhythm, whether an
// opening is concrete, or whether a closing lands. Those need a human.
//
// Covers src/pages, src/content/blog, and src/components — components carry
// reader-facing copy too (banners, HUD labels, the feedback modal), and it was
// unscanned until Aug 2026.
//
// Reports; never fails a build. `npm run check:voice`
//   --page <name>   limit to one page/post/component (substring match,
//                   e.g. --page components/ for every component)
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

// Drop {…} expressions that contain no markup — {s.name}, {ri > 0 ? 'a' : b},
// {'●'.repeat(n)}. Innermost first, repeatedly, so nesting unwinds. Groups that
// wrap markup are kept: their text nodes are prose ("Reference ranges from
// published research…" lives inside a ternary in SubstanceHud). A dropped group
// still gives up any string literal that reads like a sentence, so copy written
// as a JS string is never silently skipped.
function dropCodeExpressions(s) {
  for (let pass = 0; pass < 12; pass++) {
    let changed = false;
    s = s.replace(/\{([^{}]*)\}/g, (m, body) => {
      if (body.includes('<')) return m;
      changed = true;
      const kept = [];
      for (const lit of body.matchAll(/'([^']*)'|"([^"]*)"|`([^`]*)`/g)) {
        const t = lit[1] ?? lit[2] ?? lit[3] ?? '';
        if ((t.match(/[A-Za-z]{2,}/g) || []).length >= 2) kept.push(t);
      }
      return kept.length ? ` ${kept.join(' ')} ` : ' ';
    });
    if (!changed) break;
  }
  return s;
}

// Tag stripper that knows where a tag actually ends: a '>' only closes it when
// it is outside quotes and braces. `<div style={i > 0 ? …}>` used to cut the tag
// short and spill its expression into the prose. Everything between '<' and the
// real '>' is discarded, which is what keeps data-tip / title / aria-label text
// out of the scan — those are tooltips and labels, not prose.
function stripTags(s) {
  let out = '', i = 0;
  while (i < s.length) {
    if (s[i] === '<' && /[A-Za-z/!>]/.test(s[i + 1] || '')) {
      let depth = 0, quote = null;
      i++;
      while (i < s.length) {
        const c = s[i];
        if (quote) { if (c === quote) quote = null; }
        else if (c === '"' || c === "'" || c === '`') quote = c;
        else if (c === '{') depth++;
        else if (c === '}') depth = Math.max(0, depth - 1);
        else if (c === '>' && depth === 0) { i++; break; }
        i++;
      }
      out += ' ';
      continue;
    }
    out += s[i];
    i++;
  }
  return out;
}

// Leftover scaffolding from expressions that wrap markup — `s.doses.bands.map`,
// `&&`, `=>`, stray parens. Dotted chains are only treated as code when a
// segment is longer than two characters, so "e.g." and "i.e." survive.
function dropCodeResidue(s) {
  s = s.replace(/\b[A-Za-z_$][\w$]*(?:\.[\w$]+)+/g, (m) =>
    m.split('.').every((seg) => seg.length <= 2) ? m : ' ');
  s = s.replace(/=>|&&|\|\||===|!==|>=|<=/g, ' ');
  s = s.replace(/(^|\s)[()]+(?=\s|$)/g, ' ');
  return s.replace(/[{}]/g, ' ');  // half of a group whose other half wrapped markup
}

function proseFromAstro(src) {
  // Strip frontmatter, script/style blocks, comments, expressions, tags, and
  // entities so we score the words a reader actually sees.
  let s = src.replace(/^---[\s\S]*?---/, '');
  s = s.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ' ');  // {/* notes to other authors */}
  s = dropCodeExpressions(s);
  s = stripTags(s);
  s = dropCodeResidue(s);
  s = s.replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&')
       .replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/&#\d+;/g, ' ');
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
// A page below 60 words is a stub; a component below 8 is chrome (icon rows,
// keyboard hints) rather than prose. Both are skipped.
const MIN_WORDS = { page: 60, component: 8 };

// Em-dash density needs enough prose to mean anything. The budget rounds to 1
// for everything under 600 words, so on a 40-word banner a single dash reads as
// at budget and two reads as double — neither is a real judgement. Below this
// line the count is reported without being called a violation; every other rule
// still applies.
const DENSITY_MIN_WORDS = 200;

const files = [];
for (const f of await readdir(path.join(ROOT, 'src/pages'))) {
  if (f.endsWith('.astro') && f !== '404.astro') files.push({ name: f.replace('.astro', ''), p: path.join(ROOT, 'src/pages', f), kind: 'astro', group: 'page' });
}
for (const f of await readdir(path.join(ROOT, 'src/content/blog'))) {
  if (f.endsWith('.md')) files.push({ name: 'blog/' + f.replace('.md', ''), p: path.join(ROOT, 'src/content/blog', f), kind: 'md', group: 'page' });
}
for (const f of await readdir(path.join(ROOT, 'src/components'))) {
  if (f.endsWith('.astro')) files.push({ name: 'components/' + f.replace('.astro', ''), p: path.join(ROOT, 'src/components', f), kind: 'astro', group: 'component' });
}

const findings = [];
const stats = [];

for (const f of files) {
  if (onlyPage && !f.name.includes(onlyPage)) continue;
  const raw = await readFile(f.p, 'utf8');
  const text = f.kind === 'astro' ? proseFromAstro(raw) : proseFromMd(raw);
  if (!text || text.split(/\s+/).length < MIN_WORDS[f.group]) continue;
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

  // Em-dash density: budget is 1 per 400 words, judged only on files long
  // enough for the budget to mean something.
  const dashes = (text.match(/—/g) || []).length;
  const scored = words >= DENSITY_MIN_WORDS;
  const budget = scored ? Math.max(1, Math.round(words / 400)) : null;
  if ((!onlyRule || onlyRule === 'em-dash') && scored && dashes > budget) {
    findings.push({ page: f.name, rule: 'em-dash', sev: 'high', label: 'Em-dash overuse', term: `${dashes} used, budget ${budget}`, ctx: `${words} words` });
  }

  const sparing = SPARING.map((w) => {
    const n = (lower.match(new RegExp(`\\b${w}\\w*\\b`, 'g')) || []).length;
    return n ? `${w}×${n}` : null;
  }).filter(Boolean);

  stats.push({ group: f.group, page: f.name, words, dashes, budget, semis: (text.match(/;/g) || []).length, sparing: sparing.join(' ') });
}

// ── Report ──────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
const groupOf = new Map(files.map((f) => [f.name, f.group]));
const byPage = {};
for (const f of findings) (byPage[f.page] ||= []).push(f);

const highTotal = findings.filter((f) => f.sev === 'high').length;
const checkTotal = findings.filter((f) => f.sev === 'check').length;

console.log('\n  VOICE SCAN — docs/voice.md');

function findingsBlock(group) {
  const names = Object.keys(byPage)
    .filter((p) => groupOf.get(p) === group)
    .sort((a, b) => byPage[b].filter((x) => x.sev === 'high').length - byPage[a].filter((x) => x.sev === 'high').length);
  for (const p of names) {
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
  return names.length;
}

function densityBlock(group, rows) {
  console.log(`  ${pad(group === 'page' ? 'page' : 'component', 34)}${pad('words', 8)}${pad('em-dash', 10)}${pad('semis', 8)}sparing-list usage`);
  for (const s of rows) {
    // Unscored files show their raw count, marked '·' only when the copy really
    // leans on dashes: two or more, at better than one per 100 words. A single
    // dash in a 40-word banner is prose, and marking it would make the column
    // meaningless — every short file carries a rate past the 1-per-400 budget.
    const cell = s.budget === null
      ? `${s.dashes}/–${s.dashes >= 2 && s.dashes > s.words / 100 ? '·' : ' '}`
      : `${s.dashes}/${s.budget}${s.dashes > s.budget ? '!' : ' '}`;
    console.log(`  ${pad(s.page, 34)}${pad(s.words, 8)}${pad(cell, 10)}${pad(s.semis, 8)}${s.sparing}`);
  }
}

const pageStats = stats.filter((s) => s.group === 'page');
const compStats = stats.filter((s) => s.group === 'component');

console.log('\n  ── Pages & posts ──\n');
if (!findingsBlock('page')) console.log('  clean\n');
console.log('  ── Density (em-dash budget = 1 per 400 words) ──');
const overBudget = (s) => (s.budget ? s.dashes / s.budget : 0);
densityBlock('page', pageStats.sort((a, b) => overBudget(b) - overBudget(a)).slice(0, 18));

if (compStats.length) {
  console.log('\n  ── Components ──\n');
  if (!findingsBlock('component')) console.log('  clean\n');
  console.log(`  ── Density (under ${DENSITY_MIN_WORDS} words the budget is not scored; '·' = over rate) ──`);
  densityBlock('component', compStats.sort((a, b) => (b.dashes / b.words) - (a.dashes / a.words)));
}

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
console.log(`\n  ${highTotal} to fix · ${checkTotal} to check · ${plural(pageStats.length, 'page')} + ${plural(compStats.length, 'component')} scanned`);
console.log('  Mechanical rules only — rhythm, openings and closings need a human.\n');
