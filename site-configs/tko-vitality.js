/**
 * Site Config: TKO Vitality
 * https://tkovitality.co
 * Telehealth platform for weight loss, hormones, vitality
 */

export const config = {
  name: 'TKO Vitality',
  slug: 'tko',
  url: 'https://tkovitality.co',

  persona: {
    name: 'TKO Wellness Team',
    background: 'Telehealth wellness advisors focused on transformation',
    tone: 'professional-warm',

    backstory: `You're a wellness advisor at a telehealth platform writing about medical treatments
like Tirzepatide, Sermorelin, NAD+, and BHRT. You help people understand these therapies
without medical jargon. You're empowering, honest, and focused on real transformations.
Your writing is professional but warm.`,

    key_phrases: [
      'from the comfort of home', 'licensed healthcare providers',
      'personalized treatment plan', 'medical-grade therapy',
      'real results with professional support', 'convenient, private, effective',
      'life-changing results', 'feel like yourself again'
    ],

    disclaimers: [
      "Consult with a licensed healthcare provider",
      "Individual results may vary",
      "Medical supervision required",
      "Not a substitute for professional medical advice"
    ]
  },

  content: {
    word_count: { min: 1400, max: 1700 },
    temperature: 0.85,

    title_formulas: [
      "{topic}: Medical Weight Loss That Actually Works",
      "What {topic} Does (And What to Really Expect)",
      "{topic} Through Telehealth: Is It Right for You?",
      "Real Results: How {topic} Helps People Transform",
      "{topic} Explained: The Complete Guide",
      "Starting {topic}: What Your Doctor Considers",
      "{topic} vs Other Treatments: Which Is Better?"
    ],

    structure: [
      'Hook (transformation promise)',
      'What it does (science made simple)',
      'Why telehealth',
      'How treatment works (consultation, dosing)',
      'Real patient results',
      'What your doctor considers',
      'Combining treatments (if applicable)',
      'Side effects (honest)',
      'FAQ',
      'Bottom line (transformation focus)'
    ],

    typos_per_article: 1,
    run_on_sentences: 1
  },

  topics: [
    'Tirzepatide',
    'Semaglutide',
    'Sermorelin',
    'NAD+',
    'BHRT (Bioidentical Hormone Replacement)',
    'Testosterone Replacement Therapy',
    'Peptide Therapy',
    'GLP-1 Medications',
    'Medical Weight Loss',
    'Hormone Optimization'
  ],

  internal_links: {
    base_url: 'https://tkovitality.co',
    categories: {
      'weight-loss': '/treatments/weight-loss',
      'hormones': '/treatments/hormone-therapy',
      'peptides': '/treatments/peptide-therapy',
      'vitality': '/treatments/vitality',
      'how-it-works': '/how-it-works',
      'consultation': '/book-consultation'
    }
  }
};

export default config;
