import axios from 'axios';
import { logger } from './logger.js';

/**
 * ZeroGPT AI Detection Service
 */

export async function checkAIDetection(content) {
  const apiKey = process.env.ZEROGPT_API_KEY;

  if (!apiKey) {
    throw new Error('ZEROGPT_API_KEY not configured in environment variables');
  }

  // Strip HTML tags for analysis
  const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

  logger.info({ textLength: plainText.length }, 'Checking content with ZeroGPT API');

  try {
    const response = await axios.post(
      'https://api.zerogpt.com/api/detect/detectText',
      { input_text: plainText },
      {
        headers: {
          'Content-Type': 'application/json',
          'ApiKey': apiKey,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'ZeroGPT API request failed');
    }

    const data = response.data.data;

    const result = {
      isHuman: data.isHuman,
      fakePercentage: data.fakePercentage,
      feedback: data.feedback,
      aiWords: data.aiWords,
      textWords: data.textWords,
      highlightedSentences: data.h || [],
    };

    logger.info(
      {
        isHuman: result.isHuman,
        fakePercentage: result.fakePercentage,
        feedback: result.feedback,
      },
      'ZeroGPT detection complete'
    );

    return result;
  } catch (error) {
    logger.error({ error: error.message }, 'ZeroGPT API error');
    throw new Error(`ZeroGPT API error: ${error.message}`);
  }
}

export function passesHumanThreshold(result, threshold = 75) {
  return result.isHuman >= threshold;
}
