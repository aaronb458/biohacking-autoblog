/**
 * Content Humanizer - Post-processing to reduce AI detection
 *
 * Techniques based on research:
 * 1. Sentence length variation (short 5-10 word sentences mixed with longer)
 * 2. Minor grammatical quirks (natural imperfections)
 * 3. Punctuation variation (commas, dashes, semicolons)
 * 4. Word substitutions (formal → casual variants)
 */

/**
 * Post-process AI content to make it more human-like
 */
function humanizeContent(content, options = {}) {
  const {
    addVariation = true,
    addQuirks = true,
    casualWords = true,
    splitLongSentences = true
  } = options;

  let humanized = content;

  // 1. Replace overly formal AI phrases with casual variants
  if (casualWords) {
    const formalToCasual = {
      'Additionally,': 'Also,',
      'Furthermore,': 'Plus,',
      'Moreover,': 'What\'s more,',
      'Consequently,': 'So,',
      'Nevertheless,': 'Still,',
      'Thus,': 'So,',
      'Therefore,': 'So,',
      'has been demonstrated to': 'has been shown to',
      'has been observed to': 'appears to',
      'it is important to note that': 'note that',
      'it should be noted that': '',
      'In order to': 'To',
      'due to the fact that': 'because',
      'in the event that': 'if',
      'is able to': 'can',
      'are able to': 'can'
    };

    for (const [formal, casual] of Object.entries(formalToCasual)) {
      const regex = new RegExp(formal, 'g');
      humanized = humanized.replace(regex, casual);
    }
  }

  // 2. Add sentence length variation by occasionally splitting long sentences
  if (splitLongSentences) {
    // Find sentences with multiple clauses (3+ commas or conjunctions)
    const sentences = humanized.match(/[^.!?]+[.!?]+/g) || [];

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const commaCount = (sentence.match(/,/g) || []).length;

      // If sentence has 3+ commas, occasionally break it up
      if (commaCount >= 3 && Math.random() > 0.5) {
        // Replace one comma with a period (creates variation)
        const commas = [...sentence.matchAll(/,/g)];
        if (commas.length > 0) {
          const randomComma = commas[Math.floor(Math.random() * commas.length)];
          if (randomComma.index) {
            const before = sentence.substring(0, randomComma.index);
            const after = sentence.substring(randomComma.index + 1);
            const newSentence = before + '.' + after.charAt(0).toUpperCase() + after.substring(1);
            humanized = humanized.replace(sentence, newSentence);
          }
        }
      }
    }
  }

  // 3. Add minor grammatical quirks (natural imperfections)
  if (addQuirks) {
    // Occasionally use contractions in scientific writing (rare but human)
    const contractions = {
      'it is known': 'it\'s known',
      'that is': 'that\'s',
      'there is': 'there\'s',
      'what is': 'what\'s'
    };

    // Apply contractions rarely (10% chance per occurrence)
    for (const [full, contracted] of Object.entries(contractions)) {
      if (Math.random() > 0.9) {
        const regex = new RegExp(full, 'i');
        humanized = humanized.replace(regex, contracted);
      }
    }

    // Occasionally start a sentence with "And" or "But" (conversational)
    humanized = humanized.replace(/\. In fact,/g, (match) =>
      Math.random() > 0.7 ? '. And in fact,' : match
    );

    humanized = humanized.replace(/\. However,/g, (match) =>
      Math.random() > 0.7 ? '. But' : match
    );
  }

  // 4. Add variation in transition words
  if (addVariation) {
    // Replace some instances of repeated transitions
    const transitions = ['In fact,', 'For instance,', 'For example,', 'Specifically,'];
    const variationMap = {
      'In fact,': ['Indeed,', 'Actually,', 'What\'s more,'],
      'For instance,': ['For example,', 'Take for instance,', 'Consider:'],
      'For example,': ['For instance,', 'Like:', 'Such as:'],
      'Additionally,': ['Also,', 'Plus,', 'What\'s more,']
    };

    for (const [original, variants] of Object.entries(variationMap)) {
      const regex = new RegExp(original, 'g');
      const matches = humanized.match(regex);

      if (matches && matches.length > 1) {
        // Replace some instances with variants
        let count = 0;
        humanized = humanized.replace(regex, () => {
          count++;
          // Keep first instance, vary the rest
          if (count > 1 && Math.random() > 0.5) {
            return variants[Math.floor(Math.random() * variants.length)];
          }
          return original;
        });
      }
    }
  }

  return humanized;
}

/**
 * Aggressive humanization - applies ALL techniques
 */
export function aggressiveHumanize(content) {
  return humanizeContent(content, {
    addVariation: true,
    addQuirks: true,
    casualWords: true,
    splitLongSentences: true
  });
}
