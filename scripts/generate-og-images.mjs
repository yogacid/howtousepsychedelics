import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import esbuild from 'esbuild';

const ROOT = join(import.meta.dirname, '..');
const FONT_CACHE = join(ROOT, '.font-cache');
const OUT_DIR = join(ROOT, 'public', 'og');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const SUBSTANCES_FILE = join(ROOT, 'src', 'data', 'substances.ts');

const WIDTH = 1200;
const HEIGHT = 630;

// ── Brand tokens (mirrors src/styles/global.css dark theme) ──
const COLORS = {
  bg: '#0a0a0a',
  bgElevated: '#1e1e1e',
  border: 'rgba(255,255,255,0.10)',
  textPrimary: '#f5f5f5',
  textMuted: '#9a9a9a',
  accent: '#40d9cc',
  accentDim: 'rgba(64,217,204,0.14)',
  green: '#6dd456',
};

// ── Fonts: satori needs static (non-variable) TTF/OTF. The self-hosted
// woff2 files are variable fonts satori's bundled opentype parser can't
// read, so pull static per-weight TTFs from Google's legacy CSS API
// (a spoofed old-browser UA is what makes it hand back .ttf instead of
// .woff2) and cache them locally to keep repeat builds offline-fast.
const FONT_SPECS = [
  { family: 'DM Sans', weight: 400 },
  { family: 'DM Sans', weight: 500 },
  { family: 'DM Sans', weight: 700 },
  { family: 'Space Grotesk', weight: 700 },
];

async function fetchStaticTtf(family, weight) {
  const cachePath = join(FONT_CACHE, `${family.replace(/\s+/g, '-')}-${weight}.ttf`);
  if (existsSync(cachePath)) return readFile(cachePath);

  const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${weight}`;
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)' },
  }).then((r) => r.text());
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.ttf)\)/);
  if (!match) throw new Error(`No static TTF found for ${family} ${weight}`);

  const buf = Buffer.from(await fetch(match[1]).then((r) => r.arrayBuffer()));
  await mkdir(FONT_CACHE, { recursive: true });
  await writeFile(cachePath, buf);
  return buf;
}

async function loadFonts() {
  const fonts = await Promise.all(
    FONT_SPECS.map(async (spec) => ({
      name: spec.family,
      data: await fetchStaticTtf(spec.family, spec.weight),
      weight: spec.weight,
      style: 'normal',
    }))
  );
  return fonts;
}

async function loadLogoDataUri() {
  const buf = await readFile(join(ROOT, 'public', 'logo-dark.png'));
  // Site logo PNG is a wide lockup (mark + wordmark); crop to the
  // square eye mark on the left is impractical here, so this loads
  // the whole file — callers size the <img> box to the mark's aspect.
  return `data:image/png;base64,${buf.toString('base64')}`;
}

async function loadSubstances() {
  const result = await esbuild.build({
    entryPoints: [SUBSTANCES_FILE],
    bundle: false,
    write: false,
    format: 'esm',
    platform: 'node',
    loader: { '.ts': 'ts' },
  });
  const code = result.outputFiles[0].text;
  const mod = await import(`data:text/javascript,${encodeURIComponent(code)}`);
  return mod.substances;
}

function extractFrontmatterEnd(src) {
  const first = src.indexOf('---');
  if (first === -1) return 0;
  const second = src.indexOf('---', first + 3);
  return second === -1 ? 0 : second + 3;
}

async function loadBlogPosts() {
  if (!existsSync(BLOG_DIR)) return [];
  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const src = await readFile(join(BLOG_DIR, file), 'utf-8');
    const fmEnd = extractFrontmatterEnd(src);
    const fmBlock = src.slice(3, fmEnd - 3).trim();
    let title = '', description = '', category = '', draft = false;
    const lines = fmBlock.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [key, ...rest] = line.split(':');
      let val = rest.join(':').trim();
      // Quoted values can wrap across lines (CMS folds long descriptions)
      if (/^["']/.test(val) && !/["']$/.test(val)) {
        const quote = val[0];
        while (i + 1 < lines.length && !val.endsWith(quote)) {
          i++;
          val += ' ' + lines[i].trim();
        }
      }
      val = val.replace(/^["']|["']$/g, '').trim();
      const k = key.trim();
      if (k === 'title') title = val;
      if (k === 'description') description = val;
      if (k === 'category') category = val;
      if (k === 'draft' && val === 'true') draft = true;
    }
    if (draft || !title) continue;
    posts.push({ slug: file.replace('.md', ''), title, description, category });
  }
  return posts;
}

// ── Shared card chrome: logo mark + wordmark, top-left; domain, bottom-right ──
function cardShell({ logo, eyebrow, children, footer }) {
  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px',
        background: `linear-gradient(135deg, #061410 0%, ${COLORS.bg} 45%, #050d16 100%)`,
        fontFamily: 'DM Sans',
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { position: 'absolute', top: -120, left: -100, width: 420, height: 420, borderRadius: 420, background: COLORS.green, opacity: 0.16, filter: 'blur(110px)', display: 'flex' },
          },
        },
        {
          type: 'div',
          props: {
            style: { position: 'absolute', bottom: -160, right: -120, width: 480, height: 480, borderRadius: 480, background: '#2e9fd8', opacity: 0.18, filter: 'blur(130px)', display: 'flex' },
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: 14 },
                  children: [
                    { type: 'img', props: { src: logo, width: 240, height: 60, style: { display: 'flex' } } },
                  ],
                },
              },
              eyebrow,
            ],
          },
        },
        {
          type: 'div',
          props: { style: { display: 'flex', flexDirection: 'column', position: 'relative' }, children },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'flex-end', position: 'relative' },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: 22, color: COLORS.textMuted, letterSpacing: '0.02em' },
                  children: footer ?? 'howtousepsychedelics.com',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function pill(text, tone = 'accent') {
  const color = tone === 'warn' ? '#f0b840' : COLORS.accent;
  const bg = tone === 'warn' ? 'rgba(240,184,64,0.12)' : COLORS.accentDim;
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        background: bg,
        border: `1px solid ${color}33`,
        borderRadius: 100,
        padding: '10px 24px',
      },
      children: text,
    },
  };
}

function statTile(label, value) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        background: COLORS.bgElevated,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: '20px 28px',
        minWidth: 200,
      },
      children: [
        {
          type: 'span',
          props: {
            style: { fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.accent },
            children: label,
          },
        },
        typeof value === 'string'
          ? {
              type: 'span',
              props: {
                style: { fontSize: 30, fontWeight: 500, color: COLORS.textPrimary, fontFamily: 'DM Sans' },
                children: value,
              },
            }
          : value,
      ],
    },
  };
}

// Evidence strength as drawn circles — the subsetted fonts have no ●/○ glyphs
function evidenceDots(strength) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', gap: 8, alignItems: 'center', height: 38 },
      children: Array.from({ length: 5 }, (_, i) => ({
        type: 'div',
        props: {
          style: {
            width: 18,
            height: 18,
            borderRadius: 18,
            display: 'flex',
            background: i < strength ? COLORS.accent : 'transparent',
            border: `2px solid ${i < strength ? COLORS.accent : COLORS.textMuted}`,
          },
        },
      })),
    },
  };
}

function buildSubstanceCard(substance, logo) {
  const route = substance.routes[0];
  const topEvidence = substance.evidence?.items?.[0];

  return cardShell({
    logo,
    eyebrow: pill(substance.class),
    footer: 'howtousepsychedelics.com/' + substance.id,
    children: [
      {
        type: 'span',
        props: {
          style: { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 108, color: COLORS.textPrimary, lineHeight: 1.05, letterSpacing: '-0.02em' },
          children: substance.name,
        },
      },
      {
        type: 'span',
        props: {
          style: { fontSize: 26, color: COLORS.textMuted, marginTop: 12, marginBottom: 36 },
          children: substance.mechanism,
        },
      },
      {
        type: 'div',
        props: {
          style: { display: 'flex', gap: 20 },
          children: [
            statTile('Total', route.total),
            statTile('Peak', route.peak),
            topEvidence
              ? statTile(topEvidence.condition, evidenceDots(topEvidence.strength))
              : statTile('Tolerance', substance.tolerance.value),
          ],
        },
      },
    ],
  });
}

function buildBlogCard(post, logo) {
  const title = post.title.length > 90 ? post.title.slice(0, 88) + '…' : post.title;
  const desc = post.description.length > 150 ? post.description.slice(0, 148) + '…' : post.description;

  return cardShell({
    logo,
    eyebrow: pill(post.category),
    footer: 'howtousepsychedelics.com/blog',
    children: [
      {
        type: 'span',
        props: {
          style: { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 60, color: COLORS.textPrimary, lineHeight: 1.15, letterSpacing: '-0.01em' },
          children: title,
        },
      },
      {
        type: 'span',
        props: {
          style: { fontSize: 26, color: COLORS.textMuted, marginTop: 24, lineHeight: 1.5 },
          children: desc,
        },
      },
    ],
  });
}

async function render(node, fonts) {
  const svg = await satori(node, { width: WIDTH, height: HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(join(OUT_DIR, 'blog'), { recursive: true });

  const [fonts, logo, substances, posts] = await Promise.all([
    loadFonts(),
    loadLogoDataUri(),
    loadSubstances(),
    loadBlogPosts(),
  ]);

  let count = 0;
  for (const substance of Object.values(substances)) {
    const png = await render(buildSubstanceCard(substance, logo), fonts);
    await writeFile(join(OUT_DIR, `${substance.id}.png`), png);
    count++;
  }
  for (const post of posts) {
    const png = await render(buildBlogCard(post, logo), fonts);
    await writeFile(join(OUT_DIR, 'blog', `${post.slug}.png`), png);
    count++;
  }

  console.log(`OG images: generated ${count} (${Object.keys(substances).length} substances + ${posts.length} blog posts) → public/og/`);
}

main();
