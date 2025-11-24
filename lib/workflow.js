import { fetchPubMedResearch } from './pubmed.js';
import { fetchKeywordResearch } from './dataforseo.js';
import { generateBlogPostWithRetry } from './content-generator.js';
import { publishToWordPress } from './wordpress.js';
import { savePublishedPost } from './internal-links.js';
import { logger } from './logger.js';

/**
 * Complete workflow: Research → Generate → Check AI → Publish
 */

export async function generateAndPublishPost({
  supplementName,
  skipAICheck = false,
  dryRun = false
}) {
  logger.info({ supplementName, dryRun }, '🚀 Starting blog post workflow');

  try {
    // Step 1: Fetch PubMed research
    logger.info({ step: 'pubmed-research' }, '▶️  Fetching PubMed research');
    const researchData = await fetchPubMedResearch(supplementName, 20);
    logger.info({ paperCount: researchData.paper_count }, '✅ PubMed research complete');

    // Step 2: Fetch keyword data
    logger.info({ step: 'keyword-research' }, '▶️  Fetching keyword research');
    const keywordData = await fetchKeywordResearch(supplementName);
    logger.info({ keywordCount: keywordData.keyword_count }, '✅ Keyword research complete');

    // Step 3: Generate content with AI detection retry
    logger.info({ step: 'generate-content' }, '▶️  Generating blog content');
    const content = await generateBlogPostWithRetry({
      supplementName,
      keywordData,
      researchData,
      checkAI: !skipAICheck,
      targetScore: 75,
      maxAttempts: 3
    });

    logger.info({
      wordCount: content.word_count,
      humanScore: content.humanScore,
      aiScore: content.aiScore,
      attempts: content.attempts
    }, '✅ Content generated');

    // Step 4: Publish to WordPress (unless dry run)
    let wordpressResult = null;
    if (!dryRun) {
      logger.info({ step: 'wordpress-publish' }, '▶️  Publishing to WordPress');
      wordpressResult = await publishToWordPress(content);
      logger.info({ postUrl: wordpressResult.postUrl }, '✅ Published to WordPress');

      // Step 5: Save published post for internal linking
      await savePublishedPost(supplementName, wordpressResult.postUrl, wordpressResult.postId);
      logger.info('📎 Saved post for internal linking');
    } else {
      logger.info('⏭️  Skipping WordPress publish (dry run)');
    }

    const result = {
      success: true,
      supplement: supplementName,
      title: content.title,
      wordCount: content.word_count,
      humanScore: content.humanScore,
      aiScore: content.aiScore,
      attempts: content.attempts,
      passedThreshold: content.passedThreshold,
      wordpressPostId: wordpressResult?.postId,
      wordpressPostUrl: wordpressResult?.postUrl,
      generatedAt: content.generated_at
    };

    logger.info(result, '✅ Workflow complete');

    return result;

  } catch (error) {
    logger.error({ error, supplementName }, '❌ Workflow failed');
    throw error;
  }
}
