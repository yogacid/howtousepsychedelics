// ─────────────────────────────────────────────────────────────
// Journey HUD data — the "where you are in the arc" panels
// on the four journeying pages.
// ─────────────────────────────────────────────────────────────

export interface JourneyPhase {
  id: string;
  name: string;
  url: string;
  when: string;
  effort: string;
  question: string;
  practices: string[];
  pitfall: { label: string; note: string };
  tools: { label: string; url: string }[];
}

export const arc: { id: string; name: string; url: string; when: string }[] = [
  { id: 'assessment', name: 'Assess', url: '/assessment/', when: 'before anything' },
  { id: 'preparation', name: 'Prepare', url: '/preparation/', when: 'weeks before' },
  { id: 'navigation', name: 'Journey', url: '/navigation/', when: 'the day itself' },
  { id: 'integration', name: 'Integrate', url: '/integration/', when: 'days–months after' },
];

export const phases: Record<string, JourneyPhase> = {
  assessment: {
    id: 'assessment',
    name: 'Assessment',
    url: '/assessment/',
    when: 'Before anything else',
    effort: 'One honest sitting + medical review',
    question: 'Should I do this at all — and is now the time?',
    practices: ['Medical & medication review', 'Psychological readiness check', 'Family history reflection', 'Motivation inventory'],
    pitfall: {
      label: 'Deciding first, assessing after',
      note: 'screening only works if you’re willing to hear "not now"',
    },
    tools: [
      { label: 'Readiness Assessment', url: '/readiness/' },
      { label: 'Interaction Checker', url: '/checker/' },
    ],
  },
  preparation: {
    id: 'preparation',
    name: 'Preparation',
    url: '/preparation/',
    when: 'The 2–4 weeks before',
    effort: 'Ongoing — small daily attention',
    question: 'What am I bringing, and what container will hold it?',
    practices: ['Intention setting', 'Set & setting design', 'Building the container', 'Sitter & logistics', 'Body preparation'],
    pitfall: {
      label: 'Preparing the room, not the person',
      note: 'playlists and blankets matter less than an honest mind',
    },
    tools: [
      { label: 'Journey Planner', url: '/planner/' },
      { label: 'Set & setting checklist', url: '/blog/a-set-and-setting-checklist-for-your-next-psychedelic-session/' },
    ],
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation',
    url: '/navigation/',
    when: 'The day itself',
    effort: 'Full day — clear your schedule',
    question: 'How do I meet whatever arises?',
    practices: ['Surrender over control', 'Breath as anchor', 'Grounding techniques', 'Asking for support', 'Trusting the arc'],
    pitfall: {
      label: 'Fighting the difficult passage',
      note: 'resistance amplifies; the way through is through',
    },
    tools: [
      { label: 'Crisis resources', url: '/crisis/' },
      { label: 'Holding space (for sitters)', url: '/facilitation/' },
    ],
  },
  integration: {
    id: 'integration',
    name: 'Integration',
    url: '/integration/',
    when: 'Days to months after',
    effort: 'Little and often beats rarely and deep',
    question: 'What does this mean — and what actually changes?',
    practices: ['Journaling & articulation', 'Rest and gentleness', 'Conversation with trusted others', 'One small embodied change', 'Patience with meaning'],
    pitfall: {
      label: 'Insight without follow-through',
      note: 'an unintegrated breakthrough fades like a dream',
    },
    tools: [
      { label: 'Integration articles', url: '/blog/' },
      { label: 'The Essential Guide', url: '/guide/' },
    ],
  },
};
