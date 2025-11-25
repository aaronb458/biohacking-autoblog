/**
 * Site Config: Champion Peptides
 * https://championpeptides.com
 * Research peptides (RPO/RUO positioning)
 */

export const config = {
  name: 'Champion Peptides',
  slug: 'champion',
  url: 'https://championpeptides.com',

  persona: {
    name: 'Champion Research Team',
    background: 'Research peptide experts with scientific credibility',
    tone: 'scientific-accessible',

    backstory: `You're a research writer for a peptide company focusing on scientific accuracy
while remaining accessible. You cite studies, explain mechanisms, but keep it understandable.
Your content is for researchers and informed biohackers. You maintain RPO/RUO positioning
(Research Purposes Only / Research Use Only).`,

    key_phrases: [
      'research shows', 'studies indicate', 'mechanism of action',
      'for research purposes only', 'clinical data suggests',
      'bioavailability', 'half-life', 'dosing protocols (research)',
      'peer-reviewed studies', 'PMID referenced'
    ],

    disclaimers: [
      "For research purposes only",
      "Not for human consumption",
      "Not intended to diagnose, treat, cure, or prevent any disease",
      "Consult scientific literature for research protocols",
      "Must be handled by qualified researchers"
    ]
  },

  content: {
    word_count: { min: 1500, max: 2000 },
    temperature: 0.80,

    title_formulas: [
      "{topic}: What the Research Actually Shows",
      "Understanding {topic}: Mechanism and Studies",
      "{topic} Research: Complete Scientific Review",
      "{topic} vs {other}: What Studies Tell Us",
      "The Science Behind {topic}: A Research Overview",
      "{topic}: Mechanisms, Studies, and Research Applications",
      "Complete {topic} Guide: Everything Researchers Need to Know"
    ],

    structure: [
      'Introduction (what it is)',
      'Mechanism of action (how it works)',
      'Research findings (studies with PMID)',
      'Potential applications (research context)',
      'Dosing in research (cited studies)',
      'Half-life and bioavailability',
      'Stacking/combinations (research protocols)',
      'Safety profile (from studies)',
      'FAQ (research-focused)',
      'Conclusion',
      'References (PMID list)'
    ],

    typos_per_article: 1,
    run_on_sentences: 1,
    include_pmid_references: true
  },

  topics: [
    // Healing/Recovery Peptides
    'BPC-157', 'TB-500 (Thymosin Beta-4)', 'GHK-Cu',

    // Growth Hormone Releasing
    'Ipamorelin', 'CJC-1295', 'Sermorelin', 'GHRP-2', 'GHRP-6',
    'Tesamorelin', 'Hexarelin',

    // Metabolic/Weight
    'AOD-9604', 'Tirzepatide', 'Semaglutide', 'Retatrutide',

    // Cognitive/Neuroprotective
    'Semax', 'Selank', 'Dihexa', 'P21', 'Cerebrolysin',

    // Anti-Aging
    'Epithalon', 'GHK-Cu', 'Thymosin Alpha-1',

    // Tanning/Sexual
    'Melanotan II', 'PT-141 (Bremelanotide)',

    // Antimicrobial
    'LL-37',

    // Other Research Peptides
    'Pentadecapeptide', 'NA-Selank', 'NA-Semax',
    'Pinealon', 'Cortagen'
  ],

  internal_links: {
    base_url: 'https://championpeptides.com',
    categories: {
      'healing': '/research/healing-peptides',
      'growth-hormone': '/research/gh-releasing-peptides',
      'metabolic': '/research/metabolic-peptides',
      'cognitive': '/research/cognitive-peptides',
      'anti-aging': '/research/anti-aging-peptides',
      'all-peptides': '/peptides'
    }
  }
};

export default config;
