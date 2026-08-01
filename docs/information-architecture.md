# Substance Page Information Architecture — Spec

Status: proposed, not implemented
Audited: 31 July 2026, against all 12 substance pages in `src/pages/`

---

## 1. The problem

Every substance page was written as its own essay. There is no shared section
schema, and each page hand-writes its own sidebar TOC in markup, so nothing
detects drift. The result:

- **Psilocybin has 14 sections and 7,184 words.** Every other page averages
  ~2,100. Psilocybin was written first and absorbed everything the author cared
  about, including material that isn't about psilocybin.
- **Coverage gaps that matter for harm reduction.** MDMA has no testing section
  — the one substance where adulteration is the leading cause of death. Mescaline
  never explains its pharmacology. Ayahuasca has no legal section.
- **Thesis content is shelved as substance content.** "Psilocybin & the Living
  World" is an argument about psychedelics that happens to live on the psilocybin
  page. "Enactive cognition" is an `h3` under *How Psilocybin Works*, filed
  beside 5-HT2A agonism, as though it were pharmacology.

**The content quality is high.** This spec changes where things go, not whether
they're right. The two exceptions are logged in §9.

### 1.1 Current coverage

✓ present · – absent

| Section | psi | aya | dmt | 5meo | mes | lsd | ibo | ket | mdma | can | 2cb | sal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| What it is | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Origin / species / sources | ✓ | – | – | ✓ | ✓ | – | – | – | – | – | – | – |
| History & cultural roots | ✓ | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | ✓ |
| How it works | ✓ | ✓ | ✓ | ✓ | **–** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Effects | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dosage | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **–** | ✓ | ✓ |
| Methods of consumption | ✓ | – | – | – | – | – | – | – | – | – | – | – |
| Research | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ |
| Ecology / living world | ✓ | – | – | – | ✓ | – | – | – | – | – | – | – |
| Risks | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Testing | ✓ | – | – | – | – | ✓ | – | – | **–** | – | ✓ | – |
| Legal status | ✓ | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | ✓ |
| Preparing | ✓ | – | – | – | – | – | – | – | – | – | – | – |
| Ethics & sovereignty | – | ✓ | – | – | ✓ | – | – | – | – | – | – | – |
| Compared to others | – | – | – | – | – | ✓ | – | ✓ | – | ✓ | ✓ | – |
| FAQ (count) | 14 | 3 | 5 | 4 | 2 | 3 | 6 | 2 | 2 | 5 | 2 | 3 |

---

## 2. The section model

Two lists, separated by one test:

> **Does this question have a true answer for every substance?**
> Yes → universal. No → conditional.

*Dose* has a real answer for all twelve. *Ceremony* is not a short answer for
2C-B; it's a question that doesn't apply. Forcing it would produce a line that
misleads by implying the question was meaningful.

**A universal section may be one sentence.** Mescaline's legal status is
essentially "Schedule I, with a narrow religious exemption." That sentence is a
complete section. Thin is fine; missing is not — because when a section is
missing the reader can't tell whether there's nothing to say or whether we
forgot.

---

## 3. Universal sections

Every substance page. Same names, same order, no exceptions.

**1. What it is**
Chemical identity and class. What physical form the reader will actually
encounter. One paragraph of orientation for someone who knows nothing.

**2. Where it comes from**
The organism or the synthesis, and the supply chain between it and the reader.
Absorbs the current *Species Guide* (psilocybin), *Sources: Toad vs. Synthetic*
(5-MeO), and *Peyote vs. San Pedro* (mescaline). For lab compounds this is who
made it, when, from what precursors, and what the precursor supply chain
implies. Conservation pressure lives here as an `h3` where it exists
(peyote, iboga, Bufo alvarius).

**3. History & cultural roots**
The human lineage. Traditional use, the Western encounter, the modern era.
Kept separate from §2 by design: a botanical origin and a colonial encounter are
different facts and shouldn't be merged. For lab compounds this is short and
still real — LSD's history runs back through ergot poisoning in medieval Europe.

**4. How it works**
Receptor pharmacology, then network/systems level. Mechanism only. Interpretive
frameworks (REBUS is borderline, enactivism is not) belong on `/science/`.

**5. Effects**
Phase by phase, matching the HUD timeline in `substances.ts`.

**6. Dose & method**
Ranges plus routes plus preparation. Absorbs psilocybin's *Methods of
Consumption*, which is currently unique to that page despite lemon-tek
equivalents existing for most substances (ayahuasca brewing, San Pedro
preparation, iboga TA vs. HCl, DMT freebase vs. changa).

**7. What the research shows**
Clinical evidence, honestly qualified. Mirrors the evidence dots in the HUD.

**8. Risks & contraindications**
Medical, psychological, interaction. Substance-specific red flags get their own
`h3` — ibogaine cardiac, ayahuasca MAOI, MDMA hyperthermia/hyponatraemia,
ketamine bladder.

**9. Verifying what you have**
Reagents, species identification, source trust, what a test can and can't tell
you. **Currently missing on 9 of 12 pages, including MDMA.** For substances
where verification is genuinely limited (ayahuasca brew), the section says so
and explains what to ask the facilitator instead.

**10. Legal status**
Jurisdictional summary linking to `/law/#law-table`. Currently missing on 6 of
12.

**11. If you're considering this**
*Only* the substance-specific delta on top of `/assessment/`, `/preparation/`,
`/navigation/`, `/integration/`. Ayahuasca's is the dieta and the retreat-vetting
questions. Ibogaine's is the cardiac workup and the medical-supervision
requirement. Psilocybin's is three sentences about potency variation and starting
low — not the 1,400-word preparation guide currently on the page, which shadows
`/preparation/` and will drift from it.

**12. FAQ**
Target 5–8 per page. Psilocybin's 14 is over; MDMA/ketamine/mescaline/2C-B at 2
are under.

---

## 4. Conditional sections

Closed list. Four types. Adding a fifth is a deliberate decision, not a drafting
convenience — see §6 for the type-level enforcement.

### `ceremony` — Ceremony & container
For substances with a living ceremonial container a reader might actually enter.

**Applies to:** ayahuasca, ibogaine, mescaline

Not salvia — the Mazatec context is real but effectively inaccessible, so it
belongs in History. Not 5-MeO — contemporary "Bufo ceremony" is a recent Western
and mestizo invention, which is a point the `ethics` section should make rather
than one a `ceremony` section would obscure.

### `ethics` — Ethics & sovereignty
For substances with a living Indigenous lineage where non-Indigenous use raises
real, unresolved questions.

**Applies to:** psilocybin, ayahuasca, mescaline, ibogaine, 5-MeO-DMT, salvia

- **psilocybin** — currently buried inside *History* (María Sabina, Wasson,
  the extraction dynamic). Promote it. It's as substantial as ayahuasca's.
- **5-MeO-DMT** — two distinct issues: toad conservation/animal welfare, and
  invented tradition. The page already handles both well; this gives them a home.
- **salvia** — Mazatec custodianship, and the fact that most Western use bears
  no relationship to it.

Borderline, excluded: **DMT**. Smoked DMT has no traditional lineage. Jurema
traditions (Mimosa tenuiflora, Brazilian Indigenous and Afro-Brazilian Catimbó)
do, and that belongs in DMT's *History*. Revisit if that section grows.

Excluded: cannabis (lineage too diffuse to make a sovereignty claim), LSD, MDMA,
ketamine, 2C-B (lab compounds, no lineage).

### `compared` — Compared to [X]
For substances routinely conflated with a neighbour, where the confusion has
practical consequences.

**Applies to:** lsd (vs. psilocybin), ketamine (vs. classical psychedelics),
2cb (vs. psilocybin/LSD/MDMA), dmt (vs. 5-MeO-DMT), fivemedmt (vs. N,N-DMT)

The DMT ↔ 5-MeO pair is the highest-stakes one on the site: similar names,
roughly an order-of-magnitude difference in active dose, and a materially
different risk profile. Both pages need it, cross-linked.

Cannabis's current *Cannabis & Other Psychedelics* is about **combinations**, not
comparison. Fold it into §11 *If you're considering this* and link `/checker/`.

### `access` — Access & sourcing
Where legal or clinical access routes exist and choosing badly is dangerous or
expensive.

**Applies to:** ibogaine (clinic standards, cardiac screening, what a
legitimate provider does), ketamine (clinics, at-home telehealth, Spravato),
psilocybin (Oregon Measure 109, Colorado Prop 122)

Ayahuasca retreat vetting stays in §11 rather than becoming an `access` section
— it's guidance for the reader's own process, not a description of a regulated
route.

---

## 5. Canonical order

Conditional sections in brackets. The cultural block (2–5) runs together so the
page reads: where it came from → who used it → how → what you owe them → then
pharmacology.

```
 1. What it is
 2. Where it comes from
      └─ [nature card renders here, end of section]
 3. History & cultural roots
 4. [Ceremony & container]
 5. [Ethics & sovereignty]
 6. How it works
 7. Effects
 8. Dose & method
 9. [Compared to X]
10. What the research shows
11. Risks & contraindications
12. Verifying what you have
13. Legal status
14. [Access & sourcing]
15. If you're considering this
16. FAQ
```

**Tradeoff noted:** placing `ethics` at position 5 rather than late means a
reader hits it before they've decided anything, which is the point — but it also
means they hit it before they're invested. The alternative (after Risks) buries
it. Going with early.

### 5.1 Assignment matrix

| | `ceremony` | `ethics` | `compared` | `access` | nature card |
|---|---|---|---|---|---|
| psilocybin | | ✓ | | ✓ | ✓ |
| ayahuasca | ✓ | ✓ | | | ✓ |
| dmt | | | ✓ | | ✓ |
| fivemedmt | | ✓ | ✓ | | ✓ |
| mescaline | ✓ | ✓ | | | ✓ |
| ibogaine | ✓ | ✓ | | ✓ | ✓ |
| salvia | | ✓ | | | ✓ |
| cannabis | | | | | ✓ |
| lsd | | | ✓ | | |
| mdma | | | | | |
| ketamine | | | ✓ | ✓ | |
| twocb | | | ✓ | | |

---

## 6. The nature card

### Rule

Renders **only on naturally-occurring substances** — those where a living
organism makes the compound. Presence and absence both carry meaning: a reader
who sees it on eight pages and not on four learns something true about the
difference, rather than wondering what was skipped.

**Gets it (8):** psilocybin, ayahuasca, dmt, fivemedmt, mescaline, ibogaine,
salvia, cannabis

**Doesn't (4):** lsd, mdma, ketamine, twocb

**LSD is the judgment call, resolved as no.** It's semi-synthetic: lysergic acid
comes from *Claviceps purpurea*, a fungus that infects rye, but LSD itself
doesn't occur in nature — Hofmann made it at Sandoz in 1938. The ergot story is
good and should be written, but it belongs in LSD's *History & cultural roots*
(currently missing entirely), running from St. Anthony's Fire through Hofmann.

**MDMA is not a nature card.** Its environmental story is real but is the
opposite kind: safrole, a precursor, is distilled from *Cinnamomum
parthenoxylon* (mreah prew phnom) in Cambodia's Cardamom Mountains, where whole
trees have been felled and distilled on-site for the illicit trade. That is an
environmental **harm** story, not a connection story, and putting it in a nature
card would flatten the distinction the card exists to make. It belongs in
MDMA's **§2 Where it comes from**, alongside the synthesis history — and it
should note that the shift toward PMK-glycidate and other precursor routes has
reduced, not eliminated, the safrole link.

### Form

A callout card, not a section, rendered at the end of §2. Consistent visual
treatment across all eight. Two to four sentences plus a link to
`/nature/#<substance>`.

**Each card must be specific to that organism.** Eight variations of
"psychedelics often increase feelings of connection to nature →" would be a
footer ad and would defeat the purpose. The test: could this paragraph appear on
any other page? If yes, rewrite it.

**Second test, added 1 Aug 2026 after the first draft failed it:** the hook must
say something about **the compound's ecological life** — what it does, or
appears to do, for the organism that makes it. Facts about *human* dealings with
the organism (conservation status, supply chains, how the combination was
discovered) are interesting but belong in §2 *Where it comes from*, not here.
The first mescaline hook was a growth-rate/conservation fact sitting directly
below a "Peyote conservation" callout that already said it, under a link
promising phenomenology — off-topic and redundant at once. Ibogaine's first hook
failed the same way (a *Voacanga* supply-chain fact). Both rewritten.

**The card's link text describes its destination, not the page's thesis.**
`/nature/#<substance>` lands on *The Organisms Themselves*, so the label is
"More on the organisms behind these compounds →". The original label —
"Why ecological themes recur in psychedelic experience" — promised an argument
the anchor does not deliver.

**Cards must never sit adjacent to another card.** Three injectors put cards on
these pages: the server-rendered `<NatureCard>`, the `.email-cta-box` injector
in `Base.astro`, and the `.feedback-card` injector in `Feedback.astro`. Only
Feedback originally checked for collisions. `Base.astro`'s CTA injector now
resolves its slots against a `endsWithCard()` guard and searches outward for the
nearest acceptable position; `Feedback`'s `usable()` now also rejects a section
ending in a `.nature-card`. Any fourth injector added later must do the same.

### The eight hooks

**psilocybin** — The genetic recipe for making psilocybin has moved *sideways*
between unrelated fungi that share the same habitats: dung and decaying wood.
Whatever the compound is for, it's something happening in the soil, most likely
involving insects. That human nervous systems respond to it at all is a
coincidence of shared receptor biology, not design.
*(Reynolds et al. 2018 — horizontal gene cluster transfer. See §9.1: the page
currently miscites this as convergent evolution.)*

**ayahuasca** — Neither plant works alone by mouth. DMT from *Psychotria
viridis* is destroyed by an enzyme in the gut before it reaches the brain;
β-carbolines in the *Banisteriopsis caapi* vine switch that enzyme off. Two
species out of tens of thousands in the Amazon, useless apart, active together.
How anyone found that combination is a genuinely open question.

**dmt** — DMT turns up across an extraordinary spread of unrelated organisms —
*Mimosa*, *Acacia*, *Psychotria*, *Phalaris* grasses — and in trace amounts in
mammals including us. It is one of the most widely distributed psychoactive
compounds in the living world, and there is no established account of what it
does in any of them.

**fivemedmt** — The same molecule comes from the parotoid glands of a Sonoran
Desert toad and from the seeds of South American *Anadenanthera* trees — two
lineages separated by a continent and hundreds of millions of years of
divergence. One of those sources is being depleted by demand; the other isn't;
and synthetic 5-MeO is chemically identical to both.

**mescaline** — A peyote button takes 10–30 years to reach the size where it's
worth harvesting. San Pedro reaches usable size in a few years and grows in
gardens. Same molecule, two cacti on completely different clocks — which is the
entire reason one is threatened and the other is a common ornamental.

**ibogaine** — Most ibogaine in circulation was never inside an iboga plant.
It's semi-synthesised from *Voacanga africana*, a more common relative, through a
supply chain that exists largely to take pressure off *Tabernanthe iboga* — a
plant Gabon has declared national heritage and restricted for export.

**salvia** — Salvinorin A is a terpene, not an alkaloid: it contains no
nitrogen, which makes it the only known natural compound that acts strongly on a
neurotransmitter receptor without one. The plant is nearly as odd — it sets seed
poorly, has no confirmed wild population, and is propagated from cuttings in a
small area of Oaxaca. It may exist because people kept it alive.

**cannabis** — Cannabis is among the oldest plants humans domesticated —
genomic work points to a single origin in East Asia roughly 12,000 years ago.
It has been shaped by living alongside human settlement for longer than almost
anything else we grow, which makes "wild cannabis" a much blurrier category than
it sounds.

---

## 7. `substances.ts` schema changes

The section list moves out of per-page markup and into data. This is what makes
the spec durable rather than a one-time cleanup: sidebars generate from the
manifest, so drift becomes impossible and the coverage matrix becomes queryable.

```ts
/** Does a living organism make this compound? Drives the nature card. */
export type Origin = 'natural' | 'semi-synthetic' | 'synthetic';

/**
 * Closed vocabulary. Adding a member is a deliberate IA decision —
 * it is not a place to put content that doesn't fit elsewhere.
 * The build fails on anything not listed here.
 */
export type ConditionalSection = 'ceremony' | 'ethics' | 'compared' | 'access';

export interface NatureCard {
  /** 2–4 sentences, specific to this organism. Must not be generic. */
  hook: string;
  /** Anchor on /nature/ */
  anchor: string;
}

export interface Substance {
  // ...existing fields unchanged...

  origin: Origin;

  /** Required iff origin === 'natural'. Enforced at build time. */
  nature?: NatureCard;

  /** Conditional sections this page carries, in canonical order. */
  conditional: ConditionalSection[];
}
```

Origin values:

```
natural         psilocybin, ayahuasca, dmt, fivemedmt, mescaline,
                ibogaine, salvia, cannabis
semi-synthetic  lsd
synthetic       mdma, ketamine, twocb
```

Supporting module — the canonical order in one place:

```ts
// src/data/sections.ts
export const UNIVERSAL_SECTIONS = [
  { id: 'what',       label: 'What it is' },
  { id: 'origin',     label: 'Where it comes from' },
  { id: 'history',    label: 'History & cultural roots' },
  { id: 'how',        label: 'How it works' },
  { id: 'effects',    label: 'Effects' },
  { id: 'dose',       label: 'Dose & method' },
  { id: 'research',   label: 'What the research shows' },
  { id: 'risks',      label: 'Risks & contraindications' },
  { id: 'verifying',  label: 'Verifying what you have' },
  { id: 'legal',      label: 'Legal status' },
  { id: 'considering',label: 'If you’re considering this' },
  { id: 'faq',        label: 'FAQ' },
] as const;

export const CONDITIONAL_SECTIONS = {
  ceremony: { label: 'Ceremony & container', after: 'history' },
  ethics:   { label: 'Ethics & sovereignty', after: 'ceremony' },
  compared: { label: 'Compared to',          after: 'dose' },
  access:   { label: 'Access & sourcing',    after: 'legal' },
} as const;
```

Then a `<SubstanceNav id="psilocybin" />` component builds the sidebar by
interleaving the two, and each page's `id` attributes must match — a build-time
check can assert that every declared section id exists as an anchor in the
rendered page.

**Anchor IDs change.** Pages currently use per-page prefixes (`mes-what`,
`aya-what`, `#what`). Standardising to unprefixed ids means the sidebar
generator works uniformly. This breaks existing deep links — see §10.

### Downstream wins

- `/substances/` can render the coverage matrix as a real comparison feature
  ("which substances have a ceremonial container?").
- `origin` is useful independently — it could surface in the HUD chips and
  filter the substances index.

---

## 8. Per-page work

### psilocybin — *reduce*
- Cut §11 down from the current 1,400-word *Preparing for an Experience* to the
  substance-specific delta only (potency variation between species and cultivars;
  start low with unfamiliar material; the 4–6h clearance figure). Link out.
- Promote the María Sabina / Wasson material out of *History* into `ethics`.
- Trim FAQ 14 → ~8. The lemon tek, meditation, and heroic dose entries are
  strong; several others duplicate `/preparation/`.
- Move *Psilocybin & the Living World* out (see §9).
- Move the *Enactive cognition* h3 out (see §9).
- Rename *Species Guide* → folds into §2 *Where it comes from*.
- Fix the Reynolds citation (§9.1).

### ayahuasca — *add 4*
- **§2 Where it comes from** — new. *B. caapi* + *P. viridis*; regional
  substitution with *Diplopterys cabrerana*; vine-only preparations; harvest
  pressure on wild *B. caapi*.
- **§3 History** — new. Currently absent; the material is scattered through
  *Ceremony* and *Ethics*. Amazonian lineages, the syncretic churches (Santo
  Daime, UDV, Barquinha), the export of ceremony to the global north.
- **§8 Dose & method** — new. No dosage section currently, which is a real gap
  even though brew concentration is unstandardised; that unstandardisation *is*
  the content.
- **§9 Verifying** — new. Honest version: you largely can't test a brew. What to
  ask a facilitator instead; admixture plants (tobacco, toé/*Brugmansia*) that
  change the risk profile.
- **§10 Legal** — new. Currently absent. Brazil/Peru religious-use status, US
  RFRA case law (UDV, Santo Daime), the general illegality elsewhere.
- Keep `ceremony`, keep `ethics`.

### dmt — *add 3*
- **§2 Where it comes from** — new. Plant sources by region; extraction vs.
  synthesis; changa.
- **§9 Verifying** — new. Reagent behaviour; what "yellow" vs. "white" spice
  actually indicates.
- **`compared` vs. 5-MeO-DMT** — new, high priority. Cross-link.
- **§11 If you're considering this** — new. Sitter necessity, seated vs. supine,
  no-standing rule.

### fivemedmt — *restructure, add 2*
- Existing *Sources: Toad vs. Synthetic* → §2. Content is accurate and stays;
  the conservation callout becomes an `h3`.
- Promote the toad-conservation and invented-tradition material into `ethics`.
  The Seri/Comcaac correction and the 1983 "Albert Most" pamphlet attribution
  are both correct as written and are the strongest version of this content on
  the site — give them a proper home.
- **§9 Verifying** — new. Distinguishing 5-MeO from N,N; why a mislabelled
  sample is dangerous at these dose ratios.
- **`compared` vs. N,N-DMT** — new, high priority.

### mescaline — *add 4*
- **§4 How it works** — new. **Currently the only substance page with no
  pharmacology section at all.** Phenethylamine 5-HT2A agonism; contrast with
  tryptamines; the long duration.
- **§3 History** — new. Archaeological record (Texas/Mexico), NAC formation and
  the 1994 AIRFA amendment, Huichol/Wixárika pilgrimage, Western encounter.
- **§9 Verifying** — new. Marquis/Mecke behaviour; cactus identification;
  concentration variation between and within specimens.
- **§10 Legal** — new. Can be short: Schedule I; the NAC exemption; San Pedro's
  ornamental-plant status in most jurisdictions.
- Existing *Peyote vs. San Pedro* → §2. Content accurate, stays.
- Keep `ethics`, add `ceremony`.
- Replace the *Ecological Significance* section with the nature card (§9.2 — the
  current claim needs replacing regardless).

### ibogaine — *add 2*
- **§2 Where it comes from** — new section, but the content largely exists
  inside the current *What Ibogaine Is*: *T. iboga* root bark, the Apocynaceae
  relatives, TA extract vs. HCl, and the *Voacanga africana* semi-synthesis
  route. Split it out. This page already handles the supply chain better than
  any other.
- **§9 Verifying** — new. High stakes: purity and correct identification of HCl
  vs. TA changes the effective dose several-fold, and this interacts directly
  with the cardiac risk.
- Promote the Bwiti sovereignty / Gabonese heritage-listing material from
  *History* into `ethics`.
- Add `access` — clinic standards, pre-screening ECG and electrolytes, what a
  legitimate provider does. Partly exists as *Accessing Ibogaine Treatment
  Safely*; rename and align.
- Keep `ceremony`.

### salvia — *add 3*
- **§2 Where it comes from** — new. Sierra Mazateca; the cutting-propagation and
  no-known-wild-population point; fresh leaf vs. dried vs. standardised extract
  (5×/10×/20×), which is the single most consequential sourcing variable.
- **§9 Verifying** — new. Extract-strength labelling is unreliable and
  unregulated; that's the content.
- **§11 If you're considering this** — new. Sitter is non-optional; the
  standing/walking risk during the 5–10 minute peak.
- Promote Mazatec custodianship from *History* into `ethics`.

### cannabis — *add 2*
- **§8 Dose & method** — new. **Currently no dosage section**, which is the most
  surprising gap on the site given edible-dosing accidents. THC mg by route;
  the inhaled/oral onset difference; why edibles produce the majority of
  cannabis ER presentations.
- **§9 Verifying** — new. Regulated-market labelling vs. unregulated; synthetic
  cannabinoid adulteration in grey markets.
- **§2 Where it comes from** — new. Domestication history; hemp/drug divergence;
  what "indica/sativa" does and doesn't mean chemically.
- Fold *Cannabis & Other Psychedelics* into §11, link `/checker/`.
- *Is Cannabis a Psychedelic?* — keep, as an `h3` under §1 *What it is*.

### lsd — *add 4*
- **§3 History** — new. Ergot and St. Anthony's Fire; Hofmann 1938/1943;
  Sandoz distribution as Delysid; MK-Ultra; scheduling. **No nature card** — but
  this is where the ergot material goes.
- **§2 Where it comes from** — new. Semi-synthesis from lysergic acid; why
  blotter potency varies; the NBOMe substitution problem, which is the reason
  §9 matters.
- **§10 Legal** — new. Currently absent, and the analogue-scheduling angle
  (1P-LSD, ALD-52) is genuinely useful.
- **§11 If you're considering this** — new. The 8–12h clearance and what that
  implies for planning.
- Existing *LSD vs. Psilocybin* → `compared`. Existing *Testing Your Supply* →
  §9, rename.

### mdma — *add 4, highest priority*
- **§9 Verifying what you have** — new. **The most important single gap in this
  audit.** Marquis, Mecke, Simon's, and Folin reagents; what each distinguishes;
  fentanyl test strips and their limits; why reagent testing does not give
  dose; press-to-press variation.
- **§2 Where it comes from** — new. Merck 1912, Anton Köllisch, synthesised as
  an intermediate in haemostatic drug development (**not** as an appetite
  suppressant — that's a persistent myth worth correcting explicitly);
  Shulgin's 1970s reintroduction; precursor chemistry. **Include the safrole /
  Cambodia deforestation material here**, with the note that the shift to
  PMK-glycidate and other routes has reduced but not eliminated it.
- **§3 History** — new. Therapeutic use pre-1985, DEA emergency scheduling, the
  rave era, MAPS.
- **§10 Legal** — new. Schedule I; the 2024 FDA rejection of the MAPS NDA and
  what it changed; Australia's authorised-prescriber pathway.
- Existing *Neurotoxicity* and *Relational and Interpersonal Risks* → `h3`s
  under §8 Risks. Both are strong; they're just over-promoted to `h2`.

### ketamine — *add 4*
- **§2 Where it comes from** — new. Parke-Davis, Calvin Stevens 1962, developed
  out of PCP research; pharmaceutical vs. illicit supply; racemic vs.
  esketamine vs. arketamine.
- **§3 History** — new. Domino & Corssen 1964 human trials; battlefield use;
  WHO Essential Medicines listing; the 2000s antidepressant turn; Spravato
  approval 2019.
- **§9 Verifying** — new. Reagent behaviour; the common adulterant/substitution
  problem in illicit supply.
- **§10 Legal** — new. Schedule III (US); prescription status; the telehealth
  grey area.
- Existing *Ketamine Therapy in Practice* → `access`, expanded to cover
  at-home telehealth risk.
- Existing *Ketamine vs. Classical Psychedelics* → `compared`.

### twocb — *add 4*
- **§7 What the research shows** — new. Currently **no research section at
  all**. Honest content: there is very little human research; say so, and say
  what that means for risk estimation.
- **§3 History** — new. Shulgin 1974; PiHKAL; the legal "Erox"/"Nexus" period;
  1995 scheduling.
- **§2 Where it comes from** — new. Fully synthetic; the 2C-x family; why
  substitution with more dangerous analogues (2C-T-7, 25B-NBOMe) is the central
  sourcing risk.
- **§10 Legal** — new. Schedule I; analogue-act coverage.
- Existing *Testing 2C-B* → §9. Existing *2C-B vs. Psilocybin and LSD* →
  `compared`.

### Totals

New universal sections to write: **38**. Roughly:
`verifying` ×9 · `legal` ×6 · `history` ×6 · `origin` ×9 · `dose` ×2 ·
`considering` ×5 · `how` ×1 · `research` ×1

---

## 9. Content that relocates

**9.1 — "Psilocybin & the Living World" → `/blog/`**
It's a good essay stuck inside a reference page. The blog already exists
(11 posts in `src/content/blog/`), so there's a venue. Publish it there, link it
from the psilocybin nature card and from `/nature/`. Nothing is lost.

**9.2 — "Enactive cognition: altered organism-environment coupling" → `/science/`**
Currently an `h3` under *How Psilocybin Works*, sitting beside 5-HT2A agonism
and DMN suppression as though it were a mechanism. It's a philosophy-of-mind
position about psychedelics generally. Move it to `/science/` as a section
alongside *How Psychedelics Work* and *The Role of Mystical Experience*. This
strengthens it — it currently reads as an assertion in passing rather than an
argument that's been made.

**9.3 — Psilocybin's preparation section → `/preparation/`**
Check for anything in psilocybin's 1,400-word preparation section not already on
`/preparation/`; merge the delta there; leave a short substance-specific note.

**9.4 — `/nature/` gains per-substance anchors**
Eight `#<substance>` anchors so the nature cards have real targets. The page
already has the right shape (*The Empirical Pattern*, *Three Ecological
Motifs*, *Why This Happens*); this adds a section that works through the eight
organisms.

---

## 10. Accuracy issues found during the audit

**10.1 — RETRACTED 1 Aug 2026. The original page was substantially right; my
"fix" was the overcorrection.** I flagged the convergent-evolution wording as a
miscitation on the strength of the Reynolds 2018 *title* ("Horizontal gene
cluster transfer…") without checking the wider literature. Louis's thesis cites
**Meyer & Slot 2023** (*Fungal Genetics and Biology*, `10.1016/j.fgb.2023.103812`,
Crossref-verified) alongside Reynolds for "evolved independently at least twice
in distantly related lineages — a rare example of convergent evolution in
natural product biosynthesis." Slot co-authored both papers, so the 2023 review
is the same lab's later synthesis, and the two mechanisms are not exclusive: the
cluster appears to have arisen more than once *and* spread horizontally. The
page, the blog post and the psilocybin nature hook now follow the thesis and
cite both. **Lesson: a paper's title is not its finding, and the site's own
domain expert is a source — check the thesis before calling something an error.**

Original (now-withdrawn) note follows for the record.

**10.1 — psilocybin.astro:63 — miscited mechanism**
> "the biosynthetic gene cluster responsible for psilocybin production evolved
> independently at least twice in distantly related fungal lineages, a pattern
> known as convergent evolution (Reynolds et al., 2018)"

Reynolds et al. 2018 (*Evolution Letters*, "Horizontal gene cluster transfer
increased hallucinogenic mushroom diversity") argues for **horizontal gene
transfer** — the cluster moved between lineages sharing insect-rich habitats —
which is close to the *opposite* of convergent evolution. Convergence means it
arose separately; HGT means it was passed along. The ecological implication the
site draws is actually *stronger* under HGT. Verify against the paper and
rewrite.

**10.2 — mescaline.astro, *Ecological Significance* — unsupported claim**
> "mescaline deters predation by insects and mammals while being harmless or
> even attractive to certain bird species that disperse cactus seeds"

This closely tracks the well-established *Capsicum* finding (Tewksbury & Nabhan
2001, *Nature*) — capsaicin deters mammals but not birds, which disperse chili
seeds. I could not find a corresponding result for mescaline and cacti, and
peyote is not primarily bird-dispersed. This looks like the chili story
transposed onto a different plant. Either source it properly or replace it —
the §6 hook (peyote's 10–30 year growth clock vs. San Pedro's) is defensible
and makes the same conservation point.

Everything else checked out. Notably accurate and worth preserving verbatim:
5-MeO's correction of the "ancient toad ceremony" myth and its attribution of
the practice to the 1983 pamphlet; ibogaine's *Voacanga* supply-chain note and
the Gabonese export restriction; mescaline's peyote conservation callout.

---

## 11. Sequencing

**Phase 1 — safety gaps. ✅ DONE 31 July 2026 (uncommitted).**
- `mdma-testing` — reagent table (Marquis/Mecke/Simon's/Folin), what reagents
  can't tell you, PMA/PMMA and N-ethylpentylone, fentanyl strips, lab testing,
  dosing consequence. Existing one-line mentions in the dosage callout and the
  harm-reduction list now link here instead of duplicating.
- `ibo-testing` — HCl vs. TA vs. root bark are not interchangeable by weight;
  *Voacanga* vs. *T. iboga* TA; reagents don't work here; batch-matched CoA;
  cross-refs the existing cardiac screening rather than restating it.
- `meo-testing` — the N,N-DMT confusion with the site's own dose figures
  (25–50 mg vs. 10–20 mg), why Ehrlich can't distinguish them, why toad
  secretion can't be dosed by weight. Reciprocal warning added to the DMT
  page's "How is DMT different from 5-MeO-DMT?" FAQ.
- `mes-how` — phenethylamine vs. tryptamine, the 2C-B lineage, why doses are
  in hundreds of mg, MAO metabolism explaining the MAOI flag, the other peyote
  alkaloids, and an explicit caveat that network-level claims are extrapolated
  from psilocybin/LSD rather than measured for mescaline.
- **10.1 fixed** — Reynolds et al. 2018 verified via Crossref
  (`10.1002/evl3.42`); rewritten as horizontal gene transfer, with the stronger
  ecological argument that HGT actually supports.
- **10.2 fixed** — bird/insect claim replaced with the peyote-vs-San-Pedro
  growth-clock framing plus an honest statement that mescaline's ecological
  function is not settled.
- `substances.ts` — corrected MDMA's `testing` string (Simon's rules out MDA,
  not cathinones); added `testing` for fivemedmt and ibogaine.

Verified: build clean; all new sections render with sidebar entries matching
headings; all anchors and cross-page links resolve; console clean; feedback-card
injection unaffected. **Not** verified visually — the browser pane was
returning a 0×0 hidden viewport, so no screenshot was possible. All classes used
(`table-scroll`/`dosage-table`, `content-callout--warning`, `content-h3`) are
existing site patterns, and links inside `.article-body p`/`li` pick up the
existing `.article-body p a` styling — `.inline-link` itself has no CSS rules
and is a naming convention only.

**Phase 2 — schema. ✅ DONE 1 Aug 2026 (uncommitted).**
- `src/data/sections.ts` — `SectionId` union (12 universal + 4 conditional),
  `SECTION_ORDER`, `DEFAULT_ANCHOR`/`DEFAULT_LABEL`, `SectionManifest`,
  `resolveSections()`, `missingSections()`, `orderDeviation()`.
- `substances.ts` — `origin`, `nature`, and a `sections` manifest on all 12.
- `<SubstanceNav>` generates every sidebar; all 12 pages converted, so no page
  hand-writes its TOC any more.
- `<NatureCard>` renders only when `origin === 'natural'`.
- `scripts/check-sections.mjs`, wired into `npm run build` (also
  `npm run check:sections`). Hard-fails on a declared anchor that doesn't exist
  or is duplicated, and on a natural substance with no nature card. Warns
  without blocking on order deviation and missing universal sections, and
  prints the coverage matrix.

**Deviation from §7, deliberate: anchor ids were NOT standardised.** Renaming
`#mes-what` → `#what` across 11 pages would break existing inbound deep links
for a purely cosmetic gain, which is a bad trade on a site where GSC indexing
has taken real work. The per-page prefix is a data field (`sections.prefix`)
instead, and psilocybin keeps its bare ids. Overrides in `sections.anchors` are
*slugs* — the prefix still applies.

**Second deviation: `has` is ordered by document order, not `SECTION_ORDER`.**
The sidebar must match the page, and ayahuasca, mescaline and ketamine don't
currently follow canonical order. `orderDeviation()` reports them; reordering
those three pages is Phase 3 work.

**Phase 4 — relocations. ✅ DONE 1 Aug 2026 (uncommitted).**
- "Psilocybin & the Living World" → blog post
  `why-psilocybin-experiences-turn-ecological.md`, expanded with the corrected
  HGT material. Section removed from the psilocybin page.
- "Enactive cognition" h3 → `/science/#sci-enactive`, expanded into a full
  section with a biosemiotics subsection and an explicit epistemic-status
  callout marking it as a framework rather than a finding. Psilocybin's
  *How it works* now ends with a one-sentence pointer to it.
- `/nature/` gained an **"The Organisms Themselves"** section carrying the eight
  `#<substance>` anchors, rendered **from `substances.ts`** so the hooks cannot
  drift from the cards, plus a caution against over-reading the pattern.
- All eight nature cards live, absent on the four synthetics.

Verified: build + checker green; all 12 sidebars match document order; nature
cards present on exactly the 8 and absent on the 4; every `/nature/#<substance>`
link resolves; no stale `#ecology` references anywhere including the search
index; blog post and `/science/` section both indexed; console clean;
deep-link landing confirmed visually.

**Phase 3 — migration. NOT STARTED.** Write the 41 remaining universal
sections (see the checker's matrix for the live count), fold the 8 off-schema
sections into canonical ones, and reorder ayahuasca, mescaline and ketamine to
canonical order. Run `npm run check:sections` to see current state.

**Phase 5 — surface it.** Coverage matrix on `/substances/`; `origin` as a HUD
chip and an index filter.

**Phase 5 — surface it.** Coverage matrix on `/substances/`; `origin` as a HUD
chip and an index filter.
