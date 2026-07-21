import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const PAGES_DIR = join(import.meta.dirname, '..', 'src', 'pages');
const BLOG_DIR = join(import.meta.dirname, '..', 'src', 'content', 'blog');
const OUT_FILE = join(import.meta.dirname, '..', 'public', 'search-index.json');

const SKIP = new Set(['404.astro']);

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&middot;/g, '·')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFrontmatterEnd(src) {
  const first = src.indexOf('---');
  if (first === -1) return 0;
  const second = src.indexOf('---', first + 3);
  if (second === -1) return 0;
  return second + 3;
}

function extractPageMeta(html) {
  const titleMatch = html.match(/class="content-hero-title"[^>]*>([^<]+)</);
  const subtitleMatch = html.match(/class="content-hero-subtitle"[^>]*>([\s\S]*?)<\/p>/);
  const h1Match = html.match(/<h1[^>]*>([^<]+)/);
  return {
    title: titleMatch ? stripHtml(titleMatch[1]) : (h1Match ? stripHtml(h1Match[1]) : null),
    subtitle: subtitleMatch ? stripHtml(subtitleMatch[1]) : '',
  };
}

function extractSections(html) {
  const sections = [];
  const h2Re = /<h2[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/g;
  let match;
  const h2Positions = [];

  while ((match = h2Re.exec(html)) !== null) {
    h2Positions.push({
      id: match[1],
      title: stripHtml(match[2]),
      start: match.index + match[0].length,
    });
  }

  for (let i = 0; i < h2Positions.length; i++) {
    const start = h2Positions[i].start;
    const end = i + 1 < h2Positions.length ? h2Positions[i + 1].start - 200 : html.length;
    const sectionHtml = html.slice(start, end);

    const paragraphs = [];
    const pRe = /<(?:p|li|td|th)[^>]*>([\s\S]*?)<\/(?:p|li|td|th)>/g;
    let pMatch;
    while ((pMatch = pRe.exec(sectionHtml)) !== null) {
      const text = stripHtml(pMatch[1]);
      if (text.length > 3) paragraphs.push(text);
    }

    const h3s = [];
    const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
    let h3Match;
    while ((h3Match = h3Re.exec(sectionHtml)) !== null) {
      h3s.push(stripHtml(h3Match[1]));
    }

    sections.push({
      id: h2Positions[i].id,
      title: h2Positions[i].title,
      h3s,
      text: paragraphs.join(' ').slice(0, 800),
    });
  }

  return sections;
}

async function buildIndex() {
  const files = (await readdir(PAGES_DIR)).filter(
    (f) => f.endsWith('.astro') && !SKIP.has(f)
  );

  const index = [];

  // Substance page slugs — used to type page entries for palette grouping
  const SRC_DATA = join(import.meta.dirname, '..', 'src', 'data', 'substances.ts');
  const substanceIds = new Set();
  if (existsSync(SRC_DATA)) {
    const dataSrc = await readFile(SRC_DATA, 'utf-8');
    for (const m of dataSrc.matchAll(/^    id: '([^']+)',$/gm)) substanceIds.add(m[1]);
  }

  for (const file of files) {
    const src = await readFile(join(PAGES_DIR, file), 'utf-8');
    const html = src.slice(extractFrontmatterEnd(src));
    const slug = file.replace('.astro', '');
    const url = '/' + (slug === 'index' ? '' : slug + '/');

    const meta = extractPageMeta(html);
    if (!meta.title) continue;

    const descMatch = src.match(/description="([^"]*)"/);
    const pageDesc = descMatch ? descMatch[1] : '';
    const pageType = substanceIds.has(slug)
      ? 'Substances'
      : slug === 'research'
        ? 'Research'
        : 'Guides';

    index.push({
      page: meta.title,
      url,
      section: null,
      hash: '',
      type: pageType,
      text: (meta.subtitle + ' ' + pageDesc).trim().slice(0, 400),
    });

    const sections = extractSections(html);
    for (const sec of sections) {
      index.push({
        page: meta.title,
        url,
        section: sec.title,
        hash: '#' + sec.id,
        type: pageType,
        text: (sec.h3s.join(' — ') + ' ' + sec.text).trim().slice(0, 700),
      });
    }
  }

  // ── Index data-driven content (HUDs, research library, comparison) ──
  if (existsSync(SRC_DATA)) {
    const dataSrc = await readFile(SRC_DATA, 'utf-8');
    const recRe = /(\w+): \{\s*id: '([^']+)',\s*name: '([^']+)',\s*class: '([^']+)',\s*mechanism: '([^']+)',/g;
    const totals = [];
    let rm;
    while ((rm = recRe.exec(dataSrc)) !== null) {
      const [, , id, name, klass, mech] = rm;
      const block = dataSrc.slice(rm.index, dataSrc.indexOf('\n  },', rm.index));
      const totalM = block.match(/total: '([^']+)'/);
      const peakM = block.match(/peak: '([^']+)'/);
      const tolM = block.match(/tolerance: \{ value: '([^']+)', sub: '([^']+)'/);
      if (totalM) totals.push(`${name} ${totalM[1]}`);
      index.push({
        page: name,
        url: '/' + id + '/',
        section: 'At a glance',
        hash: '',
        type: 'Substances',
        text: `${klass} ${mech} duration ${totalM ? totalM[1] : ''} peak ${peakM ? peakM[1] : ''} tolerance ${tolM ? tolM[1] + ' ' + tolM[2] : ''}`.trim().slice(0, 400),
      });
    }
    if (totals.length) {
      index.push({
        page: 'Substance Guides',
        url: '/substances/',
        section: 'How long does each psychedelic last?',
        hash: '#durations',
        type: 'Substances',
        text: ('Duration comparison of all psychedelics: ' + totals.join(' · ')).slice(0, 400),
      });
    }
  }

  const RESEARCH_FILE = join(PAGES_DIR, 'research.astro');
  if (existsSync(RESEARCH_FILE)) {
    const rSrc = await readFile(RESEARCH_FILE, 'utf-8');
    const studyRe = /substance: '([^']+)', topic: '([^']+)', year: (\d+),\s*authors: '([^']+)', journal: '([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)',\s*finding:\s*'((?:[^'\\]|\\.)*)',/g;
    let sm;
    let studies = 0;
    while ((sm = studyRe.exec(rSrc)) !== null) {
      const [, substance, topic, year, authors, journal, title, finding] = sm;
      index.push({
        page: 'Research Library',
        url: '/research/',
        section: `${authors} (${year})`,
        hash: '',
        type: 'Research',
        text: `${substance} ${topic} ${title.replace(/\\'/g, "'")} — ${finding.replace(/\\'/g, "'")} ${journal}`.slice(0, 400),
      });
      studies++;
    }
    console.log(`build-search-index: indexed ${studies} research studies`);
  }

  // ── Index blog posts ──
  let blogCount = 0;
  if (existsSync(BLOG_DIR)) {
    const blogFiles = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
    for (const file of blogFiles) {
      const src = await readFile(join(BLOG_DIR, file), 'utf-8');

      // Parse frontmatter
      const fmEnd = extractFrontmatterEnd(src);
      const fmBlock = src.slice(3, fmEnd - 3).trim();
      let title = '', description = '', draft = false;
      for (const line of fmBlock.split('\n')) {
        const [key, ...rest] = line.split(':');
        const val = rest.join(':').trim().replace(/^["']|["']$/g, '');
        if (key.trim() === 'title') title = val;
        if (key.trim() === 'description') description = val;
        if (key.trim() === 'draft' && val === 'true') draft = true;
      }
      if (draft || !title) continue;

      const body = src.slice(fmEnd).trim();
      const slug = file.replace('.md', '');
      const url = '/blog/' + slug + '/';

      // Page-level entry
      index.push({
        page: title,
        url,
        section: null,
        hash: '',
        type: 'Blog',
        text: description.slice(0, 400),
      });

      // Extract markdown h2 sections
      const h2Re = /^## (.+)$/gm;
      let h2Match;
      const h2Positions = [];
      while ((h2Match = h2Re.exec(body)) !== null) {
        h2Positions.push({
          title: h2Match[1].trim(),
          start: h2Match.index + h2Match[0].length,
        });
      }
      for (let i = 0; i < h2Positions.length; i++) {
        const start = h2Positions[i].start;
        const end = i + 1 < h2Positions.length ? h2Positions[i + 1].start : body.length;
        const sectionText = body.slice(start, end)
          .replace(/^###? .+$/gm, '')
          .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
          .replace(/[*_`~]/g, '')
          .replace(/\n+/g, ' ')
          .trim();
        const sectionId = h2Positions[i].title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        index.push({
          page: title,
          url,
          section: h2Positions[i].title,
          hash: '#' + sectionId,
          type: 'Blog',
          text: sectionText.slice(0, 400),
        });
      }
      blogCount++;
    }
  }

  await writeFile(OUT_FILE, JSON.stringify(index));
  console.log(`Search index: ${index.length} entries from ${files.length} pages + ${blogCount} blog posts → public/search-index.json`);
}

buildIndex();
