import axios from 'axios';
import { logger } from './logger.js';
import { getPersonaContext, getPersonaAnecdote } from './persona.js';
import { getInternalLinkSuggestions } from './internal-links.js';
import { aggressiveHumanize } from './humanizer.js';

/**
 * Generate VIRAL blog post content using Claude Sonnet 4.5
 * Implements PIMP Framework for maximum engagement and shareability
 * Maintains consistent persona across all posts
 * Includes internal linking for SEO
 */

export async function generateBlogPost({ supplementName, keywordData, researchData }) {
  logger.info({ supplementName }, 'Generating VIRAL blog post with PIMP framework');

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const researchDataString = JSON.stringify({
    keyword_data: keywordData,
    research_papers: researchData.research_papers,
    supplement_name: supplementName
  }, null, 2);

  const personaContext = getPersonaContext();
  const personaAnecdote = getPersonaAnecdote(supplementName);
  const internalLinks = getInternalLinkSuggestions(supplementName);

  const systemPrompt = `You are Alex, 38, burned-out software engineer turned biohacker. Write like you're texting a buddy about ${supplementName}.

CRITICAL - CASUAL DUDE-TO-DUDE CONVERSATION:
- Write like you're explaining this to a friend at the gym or over beers
- Use "I", "you", "dude", "man" naturally (not forced)
- Add disclaimers: "I'm not a doctor", "this is just what worked for me", "do your own research"
- Include 3-5 minor typos (their/there, your/you're, its/it's, effect/affect, loose/lose)
- Add 2-3 run-on sentences that ramble a bit before getting to the point
- Use phrases like "honestly", "look", "here's the thing", "real talk", "not gonna lie"

VOICE: One bro helping another bro. NO medical advice. Just sharing personal experience. Questions like "You know what I mean?" or "Ever notice how...?"

DISCLAIMERS (IMPORTANT):
- "I'm not a medical professional, this is just my personal experience"
- "Always talk to your doctor before trying new supplements"
- "This is what worked for ME, your results may vary"
- "Do your own research, I'm just some dude on the internet"

STRUCTURE:
- Title: "I [Screwed Up/Wasted Money on/Overdid] ${supplementName} Before [Learning This]"
- Hook (150w): Your failure story → what you learned → what you'll share
- Body (1200w): ONE simple protocol, YOUR actual numbers, mistakes you made
- Proof: Real metrics + research citations (PMID:123) but explained casually
- CTA: Offer help/tracking tool, casual tone

RHYTHM: Mix short punchy thoughts with longer rambling explanations. Ask questions. Start paragraphs with conversational phrases.

PERSONA (NEVER CONTRADICT):
- Age 38, discovered biohacking at 32 after burnout
- Former software engineer (NOT a doctor, NOT a medical professional)
- First supplement: creatine at 33
- Started working out at 33 (NOT before)
- Testosterone: 310→680 ng/dL (but always say "talk to your doctor")
- Obsessive tracker, admits wasting money on dumb stuff

${internalLinks}

PRACTICAL ADVICE FORMAT:
- "Here's what I'd do if I were starting over..."
- "The way I see it, based on my experience..."
- "This worked for me, but everyone's different..."
- Always remind them to consult a doctor

OUTPUT: Just the blog post. No meta-commentary. Start with:
<!-- Meta Description: [155-160 chars] -->
<h1>[Title]</h1>
[Hook paragraph...]

TARGET: 1,500-1,800 words, bold key points, short paragraphs (2-4 lines), CASUAL TONE.

REMEMBER: You're just a dude sharing what worked for YOU, not giving medical advice!`;

  const userPrompt = `Write about ${supplementName}. Include a named protocol, 3-5 specific metrics, 2-3 internal links. Reference this research:

${researchDataString}

Write like you're talking to a friend. Natural, conversational, human.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-sonnet-4.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.78, // Balanced for natural, human-like writing
        max_tokens: 8000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let htmlContent = response.data.choices[0]?.message?.content || '';

    if (!htmlContent) {
      throw new Error('AI generated empty content');
    }

    // Apply POST-PROCESSING humanization (Social Cat's secret sauce!)
    logger.info({ supplementName }, 'Applying post-processing humanization');
    htmlContent = aggressiveHumanize(htmlContent);

    // Extract meta description
    let metaDescription = '';
    const metaMatch = htmlContent.match(/<!-- Meta Description: (.*?) -->/);
    if (metaMatch) {
      metaDescription = metaMatch[1];
    }

    // Extract title
    let title = supplementName;
    const titleMatch = htmlContent.match(/<h1>(.*?)<\/h1>/);
    if (titleMatch) {
      title = titleMatch[1].replace(/<[^>]*>/g, '');
    }

    // Count words
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;

    const usage = response.data.usage;
    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;

    logger.info({
      supplementName,
      wordCount,
      titleLength: title.length,
      metaLength: metaDescription.length,
      inputTokens,
      outputTokens
    }, 'VIRAL blog post generated successfully');

    return {
      html_content: htmlContent,
      title,
      meta_description: metaDescription,
      word_count: wordCount,
      generated_at: new Date().toISOString(),
      input_tokens: inputTokens,
      output_tokens: outputTokens
    };

  } catch (error) {
    logger.error({ error, supplementName }, 'Content generation failed');
    throw new Error(`Content generation failed: ${error.message}`);
  }
}

/**
 * Generate blog post with retry logic for AI detection
 */
export async function generateBlogPostWithRetry({
  supplementName,
  keywordData,
  researchData,
  checkAI = true,
  targetScore = 75,
  maxAttempts = 3
}) {
  logger.info({ supplementName, targetScore, maxAttempts }, 'Starting VIRAL generation with retry logic');

  let bestResult = null;
  let bestScore = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    logger.info({ attempt, maxAttempts }, `Attempt ${attempt}/${maxAttempts}`);

    const content = await generateBlogPost({ supplementName, keywordData, researchData });

    // Skip AI check if disabled (for testing)
    if (!checkAI) {
      return {
        ...content,
        humanScore: 100,
        aiScore: 0,
        attempts: attempt,
        passedThreshold: true
      };
    }

    // Import zerogpt here to avoid circular dependency
    const { checkAIDetection } = await import('./zerogpt.js');
    const detection = await checkAIDetection(content.html_content);

    logger.info({
      attempt,
      humanScore: detection.isHuman,
      aiScore: detection.fakePercentage,
      targetScore
    }, 'AI detection complete');

    const result = {
      ...content,
      humanScore: detection.isHuman,
      aiScore: detection.fakePercentage,
      attempts: attempt,
      passedThreshold: detection.isHuman >= targetScore
    };

    // Track best
    if (detection.isHuman > bestScore) {
      bestScore = detection.isHuman;
      bestResult = result;
    }

    // If target met, return immediately
    if (detection.isHuman >= targetScore) {
      logger.info({ humanScore: detection.isHuman, targetScore }, '✅ Target human score achieved - VIRAL content ready!');
      return result;
    }

    // Delay between attempts
    if (attempt < maxAttempts) {
      logger.warn({ humanScore: detection.isHuman, targetScore }, `⚠️  Below target. Retrying with more viral edge...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Return best result
  if (bestResult) {
    logger.warn({
      bestScore,
      targetScore,
      attempts: maxAttempts
    }, `⚠️  Failed to reach target. Returning best result (${bestScore}%)`);
    return bestResult;
  }

  throw new Error('Failed to generate any valid content');
}
