import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PAGES_DIR = join(import.meta.dirname, '..', 'src', 'pages');
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
    const pRe = /<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/g;
    let pMatch;
    while ((pMatch = pRe.exec(sectionHtml)) !== null) {
      const text = stripHtml(pMatch[1]);
      if (text.length > 10) paragraphs.push(text);
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
      text: paragraphs.join(' ').slice(0, 500),
    });
  }

  return sections;
}

async function buildIndex() {
  const files = (await readdir(PAGES_DIR)).filter(
    (f) => f.endsWith('.astro') && !SKIP.has(f)
  );

  const index = [];

  for (const file of files) {
    const src = await readFile(join(PAGES_DIR, file), 'utf-8');
    const html = src.slice(extractFrontmatterEnd(src));
    const slug = file.replace('.astro', '');
    const url = '/' + (slug === 'index' ? '' : slug);

    const meta = extractPageMeta(html);
    if (!meta.title) continue;

    const descMatch = src.match(/description="([^"]*)"/);
    const pageDesc = descMatch ? descMatch[1] : '';

    index.push({
      page: meta.title,
      url,
      section: null,
      hash: '',
      text: (meta.subtitle + ' ' + pageDesc).trim().slice(0, 400),
    });

    const sections = extractSections(html);
    for (const sec of sections) {
      index.push({
        page: meta.title,
        url,
        section: sec.title,
        hash: '#' + sec.id,
        text: (sec.h3s.join(' — ') + ' ' + sec.text).trim().slice(0, 400),
      });
    }
  }

  await writeFile(OUT_FILE, JSON.stringify(index));
  console.log(`Search index: ${index.length} entries from ${files.length} pages → public/search-index.json`);
}

buildIndex();
