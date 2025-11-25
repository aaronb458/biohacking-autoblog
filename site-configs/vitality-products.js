/**
 * Site Config: Vitality Products Online
 * E-commerce wellness site
 */

export const config = {
  name: 'Vitality Products Online',
  slug: 'vitality',
  url: 'https://vitalityproductsonline.com',

  persona: {
    name: 'Vitality Wellness Team',
    background: 'Helpful wellness advisors who know about health products',
    tone: 'friendly-trustworthy',

    backstory: `You're a wellness advisor writing about health products and supplements.
You help people make informed choices without overwhelming them with science.
You're friendly, honest, and you actually care about helping people feel better.
Your writing is warm but not salesy. You focus on quality and real benefits.`,

    key_phrases: [
      'support your overall wellness', 'help you feel your best',
      'part of a healthy lifestyle', 'quality ingredients that matter',
      'trusted by health-conscious people', 'natural support',
      'holistic health', 'daily wellness routine'
    ],

    disclaimers: [
      "These statements have not been evaluated by the FDA",
      "Not intended to diagnose, treat, cure, or prevent any disease",
      "Consult your healthcare provider before use",
      "Individual results may vary"
    ]
  },

  content: {
    word_count: { min: 1400, max: 1700 },
    temperature: 0.85,

    title_formulas: [
      "{topic}: A Natural Way to Support [Benefit]",
      "Why {topic} Might Be What You're Missing",
      "{topic} Benefits: What the Research Says",
      "Choosing the Right {topic}: Your Complete Guide",
      "{topic} for Wellness: Everything You Need to Know",
      "How {topic} Supports Your Health Goals",
      "The Truth About {topic}: Benefits and Best Practices"
    ],

    structure: [
      'Hook (wellness promise)',
      'What it does for your wellness',
      'Why people choose this product',
      'How to use it (simple guide)',
      'What to expect (realistic)',
      'Quality matters (what to look for)',
      'Safety and considerations',
      'FAQ',
      'Takeaway'
    ],

    typos_per_article: 2,
    run_on_sentences: 1
  },

  topics: [
    // Vitamins & Minerals
    'Vitamin D3', 'Vitamin B Complex', 'Magnesium Glycinate', 'Zinc',
    'Vitamin C', 'Iron', 'Calcium', 'Potassium',

    // Adaptogens
    'Ashwagandha', 'Rhodiola', 'Holy Basil', 'Ginseng', 'Maca',

    // Gut Health
    'Probiotics', 'Digestive Enzymes', 'Collagen', 'L-Glutamine',

    // Energy & Focus
    'CoQ10', 'B12', 'Lion\'s Mane', 'Green Tea Extract',

    // Sleep & Relaxation
    'Melatonin', 'Magnesium', 'Valerian Root', 'GABA', 'L-Theanine',

    // General Wellness
    'Omega-3 Fish Oil', 'Turmeric/Curcumin', 'Elderberry', 'Quercetin'
  ],

  internal_links: {
    base_url: 'https://vitalityproductsonline.com',
    categories: {
      'vitamins': '/shop/vitamins',
      'supplements': '/shop/supplements',
      'adaptogens': '/shop/adaptogens',
      'gut-health': '/shop/gut-health',
      'sleep': '/shop/sleep-support',
      'energy': '/shop/energy-focus'
    }
  }
};

export default config;
