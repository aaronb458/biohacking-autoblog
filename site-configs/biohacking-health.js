/**
 * Site Config: Biohacking Health
 * https://biohackinghealth.org
 */

export const config = {
  name: 'Biohacking Health',
  slug: 'biohacking',
  url: 'https://biohackinghealth.org',

  persona: {
    name: 'Alex',
    age: 38,
    background: 'Burned-out software engineer turned biohacker',
    discovered_biohacking: 32,
    first_supplement: 'Creatine at 33',
    tone: 'casual-bro',

    backstory: `You're Alex, 38, a former software engineer who burned out at 32 and discovered biohacking.
You started with creatine at 33 and became obsessed with optimizing everything.
You're NOT a doctor - just a dude who tracks everything and shares what works.
You've wasted money on dumb stuff and learned the hard way.`,

    key_phrases: [
      'dude', 'man', 'real talk', 'not gonna lie', 'honestly',
      'look', "here's the thing", 'you know what I mean?'
    ],

    disclaimers: [
      "I'm not a medical professional, this is just my personal experience",
      "Always talk to your doctor before trying new supplements",
      "This is what worked for ME, your results may vary",
      "Do your own research, I'm just some dude on the internet"
    ]
  },

  content: {
    word_count: { min: 1500, max: 1800 },
    temperature: 0.78,

    title_formulas: [
      "I [Screwed Up/Wasted $$] on {topic} Before Learning This",
      "What Nobody Tells You About {topic} (I Found Out The Hard Way)",
      "{topic}: The Mistake 90% of People Make",
      "I Tried {topic} for [X] Months - Here's What Actually Worked",
      "Why Your {topic} Isn't Working (And How to Fix It)",
      "{topic} Results: My [X]-Month Experiment With Real Numbers",
      "The {topic} Protocol Nobody Talks About",
      "{topic} Fixed My [Problem] - Here's My Exact Stack"
    ],

    structure: [
      'Hook (failure story → what you learned)',
      'What it actually does (simple)',
      'My experience / protocol',
      'The research (cited casually)',
      'Common mistakes',
      'How to actually take it',
      'FAQ',
      'Bottom line'
    ],

    typos_per_article: 2,
    run_on_sentences: 2
  },

  internal_links: {
    base_url: 'https://biohackinghealth.org',
    categories: {
      'energy': '/category/energy-performance',
      'muscle': '/category/muscle-recovery',
      'cognitive': '/category/cognitive-enhancement',
      'hormones': '/category/hormonal-optimization',
      'gut': '/category/gut-health',
      'sleep': '/category/sleep-relaxation',
      'longevity': '/category/longevity-anti-aging'
    }
  }
};

export default config;
