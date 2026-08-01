// ─────────────────────────────────────────────────────────────
// Substance page section vocabulary.
//
// Every substance page is built from the same closed set of
// section roles. `substances.ts` declares which roles each page
// actually has; <SubstanceNav> renders the sidebar from that
// declaration, so a page and its table of contents cannot drift
// apart the way they did when every page hand-wrote its own list.
//
// See docs/information-architecture.md for the rationale and the
// per-page migration plan.
// ─────────────────────────────────────────────────────────────

/**
 * Universal roles have a true answer for every substance — a thin
 * section is fine, a missing one is a gap. Conditional roles are
 * only meaningful for some substances; "ceremony" is not a short
 * answer for 2C-B, it is a question that does not apply.
 */
export type SectionId =
  // universal
  | 'what'
  | 'origin'
  | 'history'
  | 'how'
  | 'effects'
  | 'dose'
  | 'research'
  | 'risks'
  | 'verifying'
  | 'legal'
  | 'considering'
  | 'faq'
  // conditional
  | 'ceremony'
  | 'ethics'
  | 'compared'
  | 'access';

export const UNIVERSAL_SECTIONS: SectionId[] = [
  'what', 'origin', 'history', 'how', 'effects', 'dose',
  'research', 'risks', 'verifying', 'legal', 'considering', 'faq',
];

export const CONDITIONAL_SECTIONS: SectionId[] = ['ceremony', 'ethics', 'compared', 'access'];

/**
 * Canonical page order, conditionals interleaved. The cultural block
 * (origin → history → ceremony → ethics) runs together so a page reads
 * "where it came from, who used it, how, what you owe them" before it
 * pivots to pharmacology.
 */
export const SECTION_ORDER: SectionId[] = [
  'what',
  'origin',
  'history',
  'ceremony',
  'ethics',
  'how',
  'effects',
  'dose',
  'compared',
  'research',
  'risks',
  'verifying',
  'legal',
  'access',
  'considering',
  'faq',
];

/** Default anchor slug for a role. Pages override via `sections.anchors`. */
export const DEFAULT_ANCHOR: Record<SectionId, string> = {
  what: 'what',
  origin: 'sources',
  history: 'history',
  ceremony: 'ceremony',
  ethics: 'ethics',
  how: 'how',
  effects: 'effects',
  dose: 'dosage',
  compared: 'compared',
  research: 'research',
  risks: 'risks',
  verifying: 'testing',
  legal: 'legal',
  access: 'access',
  considering: 'considering',
  faq: 'faq',
};

/** Default sidebar label. Pages override via `sections.labels`. */
export const DEFAULT_LABEL: Record<SectionId, string> = {
  what: 'What it is',
  origin: 'Where it comes from',
  history: 'History & cultural roots',
  ceremony: 'Ceremony & container',
  ethics: 'Ethics and sovereignty',
  how: 'How it works',
  effects: 'Effects',
  dose: 'Dosage',
  compared: 'Compared to',
  research: 'Research',
  risks: 'Risks',
  verifying: 'Verifying what you have',
  legal: 'Legal status',
  access: 'Access & sourcing',
  considering: 'If you are considering this',
  faq: 'FAQ',
};

/**
 * A section that exists on a page but has no canonical role yet.
 * Every entry here is migration debt: it should eventually fold into
 * a canonical section as an h3, or justify a new conditional role.
 * Keeping them explicit means the debt is visible and countable.
 */
export interface ExtraSection {
  anchor: string;
  label: string;
  /** Renders immediately after this role in the sidebar. */
  after: SectionId;
}

export interface SectionManifest {
  /**
   * Anchor prefix for this page ('mes' → '#mes-what'). Empty string
   * keeps bare anchors. These match what each page already ships —
   * they are deliberately NOT standardised, because renaming would
   * break existing inbound deep links for no reader benefit.
   */
  prefix: string;
  /**
   * Roles this page has, **in the order they appear in the document**.
   * The sidebar has to match the page, so until a page is migrated this
   * reflects reality rather than SECTION_ORDER. `orderDeviation()` reports
   * the difference — that report is the Phase 3 migration list.
   */
  has: SectionId[];
  /** Anchor *slugs* overriding DEFAULT_ANCHOR. `prefix` is still applied. */
  anchors?: Partial<Record<SectionId, string>>;
  labels?: Partial<Record<SectionId, string>>;
  extra?: ExtraSection[];
}

export interface ResolvedSection {
  id: SectionId | null;
  anchor: string;
  label: string;
}

function withPrefix(prefix: string, slug: string): string {
  return prefix ? `${prefix}-${slug}` : slug;
}

/**
 * Resolve a manifest into ordered sidebar entries, following the page's
 * actual document order (`has`) so the sidebar and the page agree.
 */
export function resolveSections(m: SectionManifest): ResolvedSection[] {
  const out: ResolvedSection[] = [];

  for (const id of m.has) {
    out.push({
      id,
      // Overrides are slugs, not full anchors — the prefix still applies.
      anchor: withPrefix(m.prefix, m.anchors?.[id] ?? DEFAULT_ANCHOR[id]),
      label: m.labels?.[id] ?? DEFAULT_LABEL[id],
    });
    for (const ex of m.extra ?? []) {
      if (ex.after === id) {
        out.push({ id: null, anchor: withPrefix(m.prefix, ex.anchor), label: ex.label });
      }
    }
  }
  return out;
}

/** Universal roles this page is missing — the gap report. */
export function missingSections(m: SectionManifest): SectionId[] {
  const present = new Set(m.has);
  return UNIVERSAL_SECTIONS.filter((id) => !present.has(id));
}

/**
 * True when the page's document order already matches SECTION_ORDER.
 * Pages that return false are Phase 3 reordering work, not bugs.
 */
export function orderDeviation(m: SectionManifest): { ok: boolean; expected: SectionId[] } {
  const expected = SECTION_ORDER.filter((id) => m.has.includes(id));
  return { ok: JSON.stringify(expected) === JSON.stringify(m.has), expected };
}
