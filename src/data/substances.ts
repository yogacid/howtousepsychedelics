// ─────────────────────────────────────────────────────────────
// Substance HUD data — single source of truth for the
// "At a glance" panels on substance pages.
// Values mirror the prose and dosage tables on each page;
// update both together.
// ─────────────────────────────────────────────────────────────

export interface Phase {
  label: string;
  from: number;
  to: number;
}

export interface Route {
  name: string;
  unit: 'min' | 'h';
  axisMax: number;
  phases: Phase[];
  afterglow?: boolean;
  total: string;
  peak: string;
  first: string;
}

export interface DoseBand {
  label: string;
  range: string;
  note: string;
  caution?: boolean;
}

export interface Chip {
  text: string;
  tone?: 'accent' | 'warn';
}

export interface Substance {
  id: string;
  name: string;
  class: string;
  mechanism: string;
  chips: Chip[];
  routes: Route[];
  doses: {
    unit: string;
    bands: DoseBand[];
    footnote?: string;
  };
  evidence: {
    items: { condition: string; strength: number }[];
    researchFilter?: string;
    note?: string;
  };
  interactions: {
    items: { name: string; danger?: boolean }[];
  };
  tolerance: { value: string; sub: string };
  legal: { value: string; sub: string };
  /** reagent/verification guidance — only where testing is real practice */
  testing?: string;
  /** substance-specific "get help fast" signs — only where a distinctive medical red flag exists */
  emergency?: string;
  /** plain-language answer to "I'm on antidepressants — what happens?" */
  ssri?: string;
}

export const substances: Record<string, Substance> = {
  psilocybin: {
    id: 'psilocybin',
    name: 'Psilocybin',
    class: 'Classical psychedelic',
    mechanism: '5-HT2A agonist',
    chips: [
      { text: 'Addiction potential: very low', tone: 'accent' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral',
        unit: 'h',
        axisMax: 8,
        phases: [
          { label: 'Onset', from: 0, to: 0.75 },
          { label: 'Come-up', from: 0.75, to: 2 },
          { label: 'Peak', from: 2, to: 4 },
          { label: 'Return', from: 4, to: 6 },
        ],
        afterglow: true,
        total: '4–6 h',
        peak: '2–4 h in',
        first: '20–60 min',
      },
    ],
    doses: {
      unit: 'dried P. cubensis',
      bands: [
        { label: 'Microdose', range: '0.05–0.3 g', note: 'sub-perceptual' },
        { label: 'Threshold', range: '0.5–1 g', note: 'mild shifts' },
        { label: 'Moderate', range: '1–2.5 g', note: 'clear effects' },
        { label: 'High', range: '2.5–5 g', note: 'ego dissolution likely' },
        { label: 'Very high', range: '5+ g', note: 'needs experienced support', caution: true },
      ],
      footnote: 'Potency varies up to 4× between species & cultivars — calibrate down.',
    },
    evidence: {
      items: [
        { condition: 'Reducing depression', strength: 4 },
        { condition: 'Easing end-of-life anxiety', strength: 3 },
        { condition: 'Reducing alcohol use', strength: 3 },
      ],
      researchFilter: 'Psilocybin',
    },
    interactions: {
      items: [{ name: 'Lithium', danger: true }, { name: 'MAOIs' }, { name: 'SSRIs' }],
    },
    tolerance: { value: '~14 days', sub: 'full reset · strong cross-tolerance with LSD' },
    legal: { value: 'Illegal, exceptions', sub: 'OR & CO services · decrim cities' },
    ssri: 'Usually blunted — not typically dangerous',
  },

  lsd: {
    id: 'lsd',
    name: 'LSD',
    class: 'Classical psychedelic',
    mechanism: '5-HT2A agonist',
    chips: [
      { text: 'Addiction potential: very low', tone: 'accent' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral',
        unit: 'h',
        axisMax: 14,
        phases: [
          { label: 'Onset', from: 0, to: 1.25 },
          { label: 'Come-up', from: 1.25, to: 3 },
          { label: 'Peak', from: 3, to: 6 },
          { label: 'Return', from: 6, to: 11 },
        ],
        afterglow: true,
        total: '8–12 h',
        peak: '3–6 h in',
        first: '30–90 min',
      },
    ],
    doses: {
      unit: 'µg, verified blotter',
      bands: [
        { label: 'Microdose', range: '5–20 µg', note: 'sub-perceptual' },
        { label: 'Threshold', range: '25–50 µg', note: 'mild shifts' },
        { label: 'Moderate', range: '75–125 µg', note: 'clear effects' },
        { label: 'High', range: '150–250 µg', note: 'ego dissolution likely' },
        { label: 'Very high', range: '250+ µg', note: 'not without experience', caution: true },
      ],
      footnote: 'Blotter strength is unverifiable without testing — Ehrlich reagent rules out NBOMes.',
    },
    evidence: {
      items: [
        { condition: 'Reducing anxiety', strength: 3 },
        { condition: 'Easing end-of-life distress', strength: 2 },
      ],
      researchFilter: 'LSD',
    },
    interactions: {
      items: [{ name: 'Lithium', danger: true }, { name: 'SSRIs' }, { name: 'MAOIs' }],
    },
    tolerance: { value: '~14 days', sub: 'full reset · strong cross-tolerance with psilocybin' },
    legal: { value: 'Illegal', sub: 'Schedule I in most jurisdictions' },
    testing: 'Ehrlich reagent rules out NBOMes on blotter',
    ssri: 'Usually blunted — not typically dangerous',
  },

  mdma: {
    id: 'mdma',
    name: 'MDMA',
    class: 'Entactogen',
    mechanism: 'Serotonin releaser',
    chips: [
      { text: 'Addiction potential: low–moderate', tone: 'accent' },
      { text: 'Hyperthermia risk', tone: 'warn' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral',
        unit: 'h',
        axisMax: 7,
        phases: [
          { label: 'Onset', from: 0, to: 0.75 },
          { label: 'Come-up', from: 0.75, to: 1.5 },
          { label: 'Peak', from: 1.5, to: 3 },
          { label: 'Return', from: 3, to: 5 },
        ],
        afterglow: false,
        total: '4–6 h',
        peak: '1.5–3 h in',
        first: '30–60 min',
      },
    ],
    doses: {
      unit: 'mg, tested material',
      bands: [
        { label: 'Low', range: '60–80 mg', note: 'mild empathic opening' },
        { label: 'Moderate', range: '80–120 mg', note: 'typical therapeutic dose' },
        { label: 'High', range: '120–150 mg', note: 'elevated cardiovascular load', caution: true },
        { label: 'Redose', range: '½ dose, once', note: 'diminishing returns beyond', caution: true },
      ],
      footnote: 'Space sessions 1–3 months apart; hydrate moderately; manage heat.',
    },
    evidence: {
      items: [{ condition: 'Treating PTSD', strength: 4 }],
      researchFilter: 'MDMA',
      note: 'FDA declined approval in 2024; additional trial requested',
    },
    interactions: {
      items: [{ name: 'MAOIs', danger: true }, { name: 'SSRIs' }, { name: 'Stimulants' }],
    },
    tolerance: { value: '1–3 months', sub: 'recommended spacing between sessions' },
    legal: { value: 'Illegal, exceptions', sub: 'Australia: prescribed for PTSD' },
    testing: 'Marquis + Simon\u2019s reagents distinguish MDMA from cathinones',
    emergency: 'severe overheating, confusion, or muscle rigidity',
    ssri: 'Largely blocked — added strain without benefit',
  },

  dmt: {
    id: 'dmt',
    name: 'DMT',
    class: 'Classical psychedelic',
    mechanism: '5-HT2A agonist',
    chips: [
      { text: 'Addiction potential: very low', tone: 'accent' },
      { text: 'No tolerance buildup', tone: 'accent' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Vaporized',
        unit: 'min',
        axisMax: 25,
        phases: [
          { label: 'Onset', from: 0, to: 1 },
          { label: 'Come-up', from: 1, to: 3 },
          { label: 'Peak', from: 3, to: 10 },
          { label: 'Return', from: 10, to: 20 },
        ],
        afterglow: false,
        total: '15–20 min',
        peak: '2–3 min in',
        first: 'seconds',
      },
    ],
    doses: {
      unit: 'mg, vaporized freebase',
      bands: [
        { label: 'Threshold', range: '5–15 mg', note: 'mild visuals, warmth' },
        { label: 'Low', range: '15–25 mg', note: 'immersive; reality partially present' },
        { label: 'Breakthrough', range: '25–50 mg', note: 'complete replacement of reality', caution: true },
      ],
      footnote: 'Sit or lie down before inhaling — effects arrive before you can put the device down.',
    },
    evidence: {
      items: [{ condition: 'Reducing depression', strength: 2 }],
      researchFilter: 'DMT',
      note: 'early-phase trials; rich neuroscience literature',
    },
    interactions: {
      items: [{ name: 'MAOIs', danger: true }, { name: 'SSRIs' }, { name: 'Lithium' }],
    },
    tolerance: { value: 'None', sub: 'no tolerance develops — unique among psychedelics' },
    legal: { value: 'Illegal', sub: 'Schedule I; ayahuasca exemptions exist' },
    ssri: 'Blunted — and never combine with MAOIs',
  },

  fivemedmt: {
    id: 'fivemedmt',
    name: '5-MeO-DMT',
    class: 'Atypical tryptamine',
    mechanism: '5-HT1A/2A agonist',
    chips: [
      { text: 'Reactivations common', tone: 'accent' },
      { text: 'Never combine with MAOIs', tone: 'warn' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Vaporized',
        unit: 'min',
        axisMax: 50,
        phases: [
          { label: 'Onset', from: 0, to: 1 },
          { label: 'Peak', from: 1, to: 15 },
          { label: 'Return', from: 15, to: 45 },
        ],
        afterglow: false,
        total: '30–45 min',
        peak: '5–15 min in',
        first: 'seconds',
      },
    ],
    doses: {
      unit: 'mg, vaporized (synthetic)',
      bands: [
        { label: 'Threshold', range: '2–5 mg', note: 'altered awareness, warmth' },
        { label: 'Moderate', range: '5–10 mg', note: 'significant ego softening' },
        { label: 'Breakthrough', range: '10–20 mg', note: 'complete dissolution typical', caution: true },
      ],
      footnote: 'Potency is far higher than N,N-DMT — milligram-precise measurement is non-negotiable.',
    },
    evidence: {
      items: [{ condition: 'Reducing depression', strength: 2 }],
      researchFilter: '5-MeO-DMT',
      note: 'phase 1–2 trials underway',
    },
    interactions: {
      items: [{ name: 'MAOIs', danger: true }, { name: 'SSRIs' }, { name: 'Lithium' }],
    },
    tolerance: { value: 'Minimal', sub: 'rapid but short-lived' },
    legal: { value: 'Illegal', sub: 'US Schedule I since 2011' },
    ssri: 'Do not combine — serotonergic risk',
  },

  ayahuasca: {
    id: 'ayahuasca',
    name: 'Ayahuasca',
    class: 'Plant medicine brew',
    mechanism: 'DMT + harmala MAOIs',
    chips: [
      { text: 'Dieta preparation required', tone: 'accent' },
      { text: 'Serious medication interactions', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral (ceremony)',
        unit: 'h',
        axisMax: 6,
        phases: [
          { label: 'Onset', from: 0, to: 0.75 },
          { label: 'Come-up', from: 0.75, to: 1.5 },
          { label: 'Peak', from: 1.5, to: 3 },
          { label: 'Return', from: 3, to: 5 },
        ],
        afterglow: true,
        total: '4–6 h',
        peak: '1–3 h in',
        first: '20–60 min',
      },
    ],
    doses: {
      unit: 'served by facilitator',
      bands: [
        { label: 'One cup', range: 'brew-dependent', note: 'strength varies enormously between brews' },
        { label: 'Second cup', range: 'if offered', note: 'traditional mid-ceremony reinforcement' },
      ],
      footnote: 'There is no standard dose — the ceremony container and brew determine intensity.',
    },
    evidence: {
      items: [{ condition: 'Reducing depression', strength: 3 }],
      researchFilter: 'Ayahuasca',
    },
    interactions: {
      items: [{ name: 'SSRIs', danger: true }, { name: 'Stimulants', danger: true }, { name: 'Tyramine foods' }],
    },
    tolerance: { value: 'Low', sub: 'consecutive ceremony nights are traditional' },
    legal: { value: 'Varies', sub: 'legal in Brazil & Peru · religious exemptions elsewhere' },
    emergency: 'high fever, rigidity, or racing heart — possible serotonin syndrome',
    ssri: 'Dangerous — serotonin syndrome risk; do not combine',
  },

  mescaline: {
    id: 'mescaline',
    name: 'Mescaline',
    class: 'Classical psychedelic',
    mechanism: '5-HT2A agonist (phenethylamine)',
    chips: [
      { text: 'Addiction potential: very low', tone: 'accent' },
      { text: 'Peyote: conservation concern', tone: 'warn' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral',
        unit: 'h',
        axisMax: 13,
        phases: [
          { label: 'Onset', from: 0, to: 1.25 },
          { label: 'Come-up', from: 1.25, to: 3 },
          { label: 'Peak', from: 3, to: 6 },
          { label: 'Return', from: 6, to: 11 },
        ],
        afterglow: true,
        total: '10–12 h',
        peak: '3–6 h in',
        first: '45–90 min',
      },
    ],
    doses: {
      unit: 'mg mescaline HCl',
      bands: [
        { label: 'Threshold', range: '100–150 mg', note: 'mild shifts' },
        { label: 'Moderate', range: '200–300 mg', note: 'full experience' },
        { label: 'High', range: '300–500 mg', note: 'strong visuals, ego dissolution' },
        { label: 'Very high', range: '500+ mg', note: 'not without extensive experience', caution: true },
      ],
      footnote: 'San Pedro over peyote where possible — peyote is slow-growing and culturally protected.',
    },
    evidence: {
      items: [{ condition: 'Modern clinical trials', strength: 1 }],
      note: 'long history of ceremonial use; little modern clinical research',
    },
    interactions: {
      items: [{ name: 'MAOIs', danger: true }, { name: 'SSRIs' }, { name: 'Stimulants' }],
    },
    tolerance: { value: '~14 days', sub: 'cross-tolerance with other classical psychedelics' },
    legal: { value: 'Illegal, exceptions', sub: 'NAC peyote exemption · CO natural medicine' },
    ssri: 'Usually blunted — data limited',
  },

  ketamine: {
    id: 'ketamine',
    name: 'Ketamine',
    class: 'Dissociative anesthetic',
    mechanism: 'NMDA antagonist',
    chips: [
      { text: 'Addiction potential: moderate', tone: 'warn' },
      { text: 'Bladder harm with frequent use', tone: 'warn' },
      { text: 'Schedule III (US) — prescribable', tone: 'accent' },
    ],
    routes: [
      {
        name: 'Intranasal',
        unit: 'min',
        axisMax: 90,
        phases: [
          { label: 'Onset', from: 0, to: 8 },
          { label: 'Come-up', from: 8, to: 15 },
          { label: 'Peak', from: 15, to: 40 },
          { label: 'Return', from: 40, to: 75 },
        ],
        afterglow: false,
        total: '60–90 min',
        peak: '15–40 min in',
        first: '5–10 min',
      },
      {
        name: 'Intramuscular',
        unit: 'min',
        axisMax: 120,
        phases: [
          { label: 'Onset', from: 0, to: 5 },
          { label: 'Come-up', from: 5, to: 12 },
          { label: 'Peak', from: 12, to: 50 },
          { label: 'Return', from: 50, to: 100 },
        ],
        afterglow: false,
        total: '75–120 min',
        peak: '12–50 min in',
        first: '2–5 min',
      },
    ],
    doses: {
      unit: 'route-dependent',
      bands: [
        { label: 'Intranasal', range: '50–150 mg', note: 'effects 20–45 min' },
        { label: 'Intramuscular', range: '0.5–2 mg/kg', note: 'clinical settings' },
        { label: 'Oral / sublingual', range: '100–300 mg', note: 'lower bioavailability' },
        { label: 'Frequent use', range: 'any route', note: 'dependence & bladder damage', caution: true },
      ],
      footnote: 'Never use near water or while standing; never combine with depressants.',
    },
    evidence: {
      items: [
        { condition: 'Reducing depression', strength: 5 },
        { condition: 'Reducing suicidality', strength: 4 },
      ],
      researchFilter: 'Ketamine',
      note: 'esketamine is FDA-approved (2019)',
    },
    interactions: {
      items: [{ name: 'Alcohol', danger: true }, { name: 'Benzodiazepines', danger: true }, { name: 'Opioids', danger: true }],
    },
    tolerance: { value: 'Builds quickly', sub: 'with regular use — dependence is real' },
    legal: { value: 'Legal medically', sub: 'Schedule III · widely prescribed off-label' },
    testing: 'Fentanyl test strips are cheap insurance for any powder',
    emergency: 'unresponsive or vomiting while sedated — recovery position, then call',
    ssri: 'Generally compatible — often co-prescribed clinically',
  },

  ibogaine: {
    id: 'ibogaine',
    name: 'Ibogaine',
    class: 'Atypical oneirogen',
    mechanism: 'Multi-receptor (iboga alkaloid)',
    chips: [
      { text: 'Cardiac screening mandatory', tone: 'warn' },
      { text: 'Fatalities documented', tone: 'warn' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral (clinical)',
        unit: 'h',
        axisMax: 48,
        phases: [
          { label: 'Onset', from: 0, to: 2 },
          { label: 'Visionary', from: 2, to: 12 },
          { label: 'Processing', from: 12, to: 36 },
        ],
        afterglow: true,
        total: '24–48 h',
        peak: '4–12 h in',
        first: '1–3 h',
      },
    ],
    doses: {
      unit: 'mg/kg, medical supervision only',
      bands: [
        { label: 'Test dose', range: '1–3 mg/kg', note: 'assesses cardiac response' },
        { label: 'Sub-flood', range: '5–8 mg/kg', note: 'psychological work' },
        { label: 'Flood', range: '10–20 mg/kg', note: 'addiction interruption · max cardiac risk', caution: true },
      ],
      footnote: 'ECG screening, cardiac monitoring, and medical staff are non-negotiable — this is not a self-administered substance.',
    },
    evidence: {
      items: [
        { condition: 'Interrupting opioid dependence', strength: 3 },
        { condition: 'Veteran TBI recovery', strength: 2 },
      ],
      researchFilter: 'Ibogaine',
    },
    interactions: {
      items: [{ name: 'QT-prolonging drugs', danger: true }, { name: 'Opioids', danger: true }, { name: 'SSRIs', danger: true }],
    },
    tolerance: { value: 'N/A', sub: 'typically a single supervised treatment' },
    legal: { value: 'Illegal (US)', sub: 'clinics operate in Mexico & New Zealand' },
    emergency: 'any chest pain, fainting, or irregular heartbeat',
    ssri: 'Do not combine — cardiac & serotonergic risk',
  },

  cannabis: {
    id: 'cannabis',
    name: 'Cannabis',
    class: 'Cannabinoid',
    mechanism: 'CB1 partial agonist',
    chips: [
      { text: 'Addiction potential: moderate', tone: 'warn' },
      { text: 'Psychosis risk with heavy use', tone: 'warn' },
      { text: 'Legal status varies widely', tone: 'accent' },
    ],
    routes: [
      {
        name: 'Inhaled',
        unit: 'h',
        axisMax: 3.5,
        phases: [
          { label: 'Onset', from: 0, to: 0.1 },
          { label: 'Come-up', from: 0.1, to: 0.5 },
          { label: 'Peak', from: 0.5, to: 1.5 },
          { label: 'Return', from: 1.5, to: 3 },
        ],
        afterglow: false,
        total: '2–3 h',
        peak: '30–90 min in',
        first: 'minutes',
      },
      {
        name: 'Oral',
        unit: 'h',
        axisMax: 9,
        phases: [
          { label: 'Onset', from: 0, to: 1.25 },
          { label: 'Come-up', from: 1.25, to: 2.5 },
          { label: 'Peak', from: 2.5, to: 4.5 },
          { label: 'Return', from: 4.5, to: 8 },
        ],
        afterglow: false,
        total: '6–8 h',
        peak: '2–4 h in',
        first: '30–90 min',
      },
    ],
    doses: {
      unit: 'mg THC (oral)',
      bands: [
        { label: 'Low', range: '2.5–5 mg', note: 'mild; sensible start' },
        { label: 'Moderate', range: '5–10 mg', note: 'clear effects' },
        { label: 'High', range: '10–20 mg', note: 'strong; anxiety possible' },
        { label: 'Very high', range: '20+ mg', note: 'overwhelming for most', caution: true },
      ],
      footnote: 'Edible onset is slow — never redose before 2 hours have passed.',
    },
    evidence: {
      items: [
        { condition: 'Easing chronic pain', strength: 3 },
        { condition: 'Nausea & appetite', strength: 3 },
      ],
      note: 'large but uneven evidence base',
    },
    interactions: {
      items: [{ name: 'Psychedelics (amplifies)' }, { name: 'Alcohol' }, { name: 'Heart conditions' }],
    },
    tolerance: { value: 'Days–weeks', sub: 'builds with regular use; resets with breaks' },
    legal: { value: 'Varies widely', sub: 'legal in Canada & many US states' },
  },

  twocb: {
    id: 'twocb',
    name: '2C-B',
    class: 'Phenethylamine psychedelic',
    mechanism: '5-HT2A partial agonist',
    chips: [
      { text: 'Steep dose–response curve', tone: 'warn' },
      { text: 'Schedule I (US)', tone: 'warn' },
    ],
    routes: [
      {
        name: 'Oral',
        unit: 'h',
        axisMax: 7,
        phases: [
          { label: 'Onset', from: 0, to: 1 },
          { label: 'Come-up', from: 1, to: 2 },
          { label: 'Peak', from: 2, to: 4 },
          { label: 'Return', from: 4, to: 6 },
        ],
        afterglow: false,
        total: '4–6 h',
        peak: '2–4 h in',
        first: '45–75 min',
      },
    ],
    doses: {
      unit: 'mg, tested material',
      bands: [
        { label: 'Threshold', range: '5–12 mg', note: 'perceptual brightening' },
        { label: 'Low–moderate', range: '12–18 mg', note: 'clear, manageable' },
        { label: 'Moderate', range: '18–25 mg', note: 'full experience' },
        { label: 'High', range: '25–35 mg', note: 'psychologically demanding', caution: true },
      ],
      footnote: 'A few milligrams separate mild from overwhelming — always weigh, never eyeball.',
    },
    evidence: {
      items: [],
      note: 'no modern clinical trials — evidence is anecdotal and observational',
    },
    interactions: {
      items: [{ name: 'MAOIs', danger: true }, { name: 'Stimulants' }, { name: 'SSRIs' }],
    },
    tolerance: { value: '~1–2 weeks', sub: 'partial cross-tolerance with classicals' },
    legal: { value: 'Illegal', sub: 'Schedule I in most jurisdictions' },
    testing: 'Frequently mis-sold — verify with Marquis reagent',
    ssri: 'Limited data — assume blunting and added strain',
  },

  salvia: {
    id: 'salvia',
    name: 'Salvia divinorum',
    class: 'Atypical dissociative',
    mechanism: 'κ-opioid agonist (non-serotonergic)',
    chips: [
      { text: 'Physical safety is the main risk', tone: 'warn' },
      { text: 'Not federally scheduled (US)', tone: 'accent' },
    ],
    routes: [
      {
        name: 'Smoked',
        unit: 'min',
        axisMax: 25,
        phases: [
          { label: 'Onset', from: 0, to: 0.5 },
          { label: 'Peak', from: 0.5, to: 5 },
          { label: 'Return', from: 5, to: 20 },
        ],
        afterglow: false,
        total: '10–20 min',
        peak: '1–2 min in',
        first: 'seconds',
      },
      {
        name: 'Quid (chewed)',
        unit: 'min',
        axisMax: 120,
        phases: [
          { label: 'Onset', from: 0, to: 12 },
          { label: 'Come-up', from: 12, to: 30 },
          { label: 'Peak', from: 30, to: 45 },
          { label: 'Return', from: 45, to: 100 },
        ],
        afterglow: false,
        total: '1–2 h',
        peak: '30–45 min in',
        first: '5–15 min',
      },
    ],
    doses: {
      unit: 'leaf & extracts',
      bands: [
        { label: 'Plain leaf', range: 'smoked', note: 'mild; rarely breaks through' },
        { label: '5× extract', range: 'small amount', note: 'light–moderate' },
        { label: '10–20× extract', range: 'small amount', note: 'full breakthrough possible', caution: true },
        { label: 'Quid (fresh leaf)', range: 'buccal', note: 'gentler, traditional route' },
      ],
      footnote: 'A sober sitter and a hazard-free space matter more here than with any classical psychedelic.',
    },
    evidence: {
      items: [],
      note: 'κ-opioid pharmacology of research interest; no clinical trials',
    },
    interactions: {
      items: [{ name: 'Few known pharmacological interactions' }, { name: 'Environment is the hazard' }],
    },
    tolerance: { value: 'Minimal', sub: 'no significant tolerance reported' },
    legal: { value: 'Varies by state', sub: 'unscheduled federally (US); banned in many states' },
  },
};
