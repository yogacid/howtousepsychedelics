// ─────────────────────────────────────────────────────────────
// Verifies every section anchor declared in src/data/substances.ts
// actually exists in the built page, and reports the IA gap matrix.
//
// HARD FAIL  — a declared anchor is missing from the page, an anchor
//              is duplicated, or a natural substance has no nature card.
//              These are correctness bugs: the sidebar would 404 in-page.
// WARN ONLY  — document order deviates from SECTION_ORDER, or a
//              universal section is missing. These are the Phase 3 / Phase 1
//              migration backlog from docs/information-architecture.md,
//              not defects, so they must not block a deploy.
// ─────────────────────────────────────────────────────────────

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

// substances.ts / sections.ts are TypeScript, so parse rather than import.
const src = await readFile(path.join(ROOT, 'src/data/substances.ts'), 'utf8');
const sectionsSrc = await readFile(path.join(ROOT, 'src/data/sections.ts'), 'utf8');

function arrayLiteral(text, name) {
  const m = text.match(new RegExp(`${name}:\\s*SectionId\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) throw new Error(`check-sections: could not parse ${name} from sections.ts`);
  return [...m[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]);
}

function recordLiteral(text, name) {
  const m = text.match(new RegExp(`${name}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`));
  if (!m) throw new Error(`check-sections: could not parse ${name} from sections.ts`);
  return Object.fromEntries([...m[1].matchAll(/(\w+):\s*'([^']*)'/g)].map((x) => [x[1], x[2]]));
}

const UNIVERSAL = arrayLiteral(sectionsSrc, 'UNIVERSAL_SECTIONS');
const ORDER = arrayLiteral(sectionsSrc, 'SECTION_ORDER');
const DEFAULT_ANCHOR = recordLiteral(sectionsSrc, 'DEFAULT_ANCHOR');

// Split into per-substance blocks — from `export const substances` only, so
// the interface declarations above it aren't mistaken for entries.
const table = src.slice(src.indexOf('export const substances'));
const blocks = [...table.matchAll(/^ {2}([a-z]+): \{$([\s\S]*?)^ {2}\},$/gm)];
if (blocks.length !== 12) {
  console.error(`check-sections: expected 12 substances, parsed ${blocks.length}`);
  process.exit(1);
}

const errors = [];
const warnings = [];
const rows = [];

for (const [, id, body] of blocks) {
  const manifest = body.match(/sections: \{([\s\S]*?)\n {4}\},/);
  if (!manifest) {
    errors.push(`${id}: no sections manifest`);
    continue;
  }
  const mBody = manifest[1];

  const prefix = (mBody.match(/prefix: '([^']*)'/) || [, null])[1];
  if (prefix === null) {
    errors.push(`${id}: manifest has no prefix`);
    continue;
  }

  const has = [...(mBody.match(/has: \[([\s\S]*?)\]/) || [, ''])[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]);
  const anchorsBlock = (mBody.match(/anchors: \{([^}]*)\}/) || [, ''])[1];
  const anchorOverrides = Object.fromEntries(
    [...anchorsBlock.matchAll(/(\w+):\s*'([^']*)'/g)].map((x) => [x[1], x[2]])
  );
  const extras = [...mBody.matchAll(/\{ anchor: '([^']*)'/g)].map((x) => x[1]);

  const withPrefix = (slug) => (prefix ? `${prefix}-${slug}` : slug);
  const expected = [
    ...has.map((role) => withPrefix(anchorOverrides[role] ?? DEFAULT_ANCHOR[role])),
    ...extras.map(withPrefix),
  ];

  // Verify against the built page.
  const htmlPath = path.join(DIST, id, 'index.html');
  if (!existsSync(htmlPath)) {
    errors.push(`${id}: dist/${id}/index.html not found — run the build first`);
    continue;
  }
  const html = await readFile(htmlPath, 'utf8');
  const pageIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  const seen = new Set();
  const dupes = pageIds.filter((x) => (seen.has(x) ? true : (seen.add(x), false)));

  for (const anchor of expected) {
    if (!seen.has(anchor)) errors.push(`${id}: declared anchor #${anchor} does not exist on the page`);
    else if (dupes.includes(anchor)) errors.push(`${id}: anchor #${anchor} appears more than once`);
  }

  // Nature card contract.
  const origin = (body.match(/origin: '([a-z-]+)'/) || [, null])[1];
  const hasNature = /nature: \{/.test(body);
  if (!origin) errors.push(`${id}: no origin declared`);
  if (origin === 'natural' && !hasNature) errors.push(`${id}: origin is natural but no nature card`);
  if (origin !== 'natural' && hasNature) errors.push(`${id}: nature card on a ${origin} substance`);

  // Migration backlog (warnings only).
  const missing = UNIVERSAL.filter((u) => !has.includes(u));
  const canonical = ORDER.filter((o) => has.includes(o));
  const ordered = JSON.stringify(canonical) === JSON.stringify(has);
  if (!ordered) warnings.push(`${id}: document order deviates from canonical`);

  rows.push({ id, origin, missing, ordered, extras: extras.length });
}

// ── Report ──────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
console.log('\n  IA coverage — substance pages\n');
console.log(`  ${pad('page', 12)}${pad('origin', 16)}${pad('order', 8)}${pad('extra', 7)}missing universal sections`);
console.log(`  ${'─'.repeat(96)}`);
for (const r of rows.sort((a, b) => b.missing.length - a.missing.length)) {
  console.log(
    `  ${pad(r.id, 12)}${pad(r.origin, 16)}${pad(r.ordered ? 'ok' : 'drift', 8)}${pad(r.extras || '', 7)}${
      r.missing.join(', ') || '—'
    }`
  );
}
const totalMissing = rows.reduce((n, r) => n + r.missing.length, 0);
const totalExtra = rows.reduce((n, r) => n + r.extras, 0);
console.log(`  ${'─'.repeat(96)}`);
console.log(`  ${totalMissing} universal sections still to write · ${totalExtra} off-schema sections to fold in\n`);

if (warnings.length) {
  console.log('  Backlog (not blocking):');
  for (const w of warnings) console.log(`    · ${w}`);
  console.log('');
}

if (errors.length) {
  console.error('  ✗ check-sections FAILED\n');
  for (const e of errors) console.error(`    ${e}`);
  console.error('');
  process.exit(1);
}
console.log('  ✓ every declared anchor resolves\n');
