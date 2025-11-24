import axios from 'axios';
import { logger } from './logger.js';

/**
 * DataForSEO API Client for Keyword Research
 */

function generateMockKeywordData(supplementName) {
  const normalized = supplementName.toLowerCase();

  logger.info({ supplementName }, 'Using mock keyword data (DataForSEO not configured)');

  return {
    supplement_name: supplementName,
    top_keywords: [
      {
        keyword: normalized,
        search_volume: 8100,
        difficulty: 45,
        competition: 'Medium',
        intent: 'Informational',
        opportunity_score: 180
      },
      {
        keyword: `${normalized} benefits`,
        search_volume: 3600,
        difficulty: 42,
        competition: 'Medium',
        intent: 'Informational',
        opportunity_score: 85
      },
      {
        keyword: `${normalized} research`,
        search_volume: 2900,
        difficulty: 35,
        competition: 'Low',
        intent: 'Informational',
        opportunity_score: 121
      },
      {
        keyword: `${normalized} studies`,
        search_volume: 2400,
        difficulty: 33,
        competition: 'Low',
        intent: 'Informational',
        opportunity_score: 106
      },
      {
        keyword: `what is ${normalized}`,
        search_volume: 1500,
        difficulty: 28,
        competition: 'Low',
        intent: 'Informational',
        opportunity_score: 78
      }
    ],
    keyword_count: 5,
    total_raw_keywords: 25
  };
}

function scoreKeyword(keywordData) {
  if (!keywordData?.keyword) return 0;

  const keyword = keywordData.keyword.toLowerCase();
  const volume = keywordData.keyword_info?.search_volume || 0;
  const difficulty = keywordData.keyword_properties?.keyword_difficulty || 99;
  const competition = keywordData.keyword_info?.competition_level || 'UNKNOWN';

  if (volume === 0) return 0;

  let score = volume / (difficulty + 1);

  // Boost informational/research keywords
  if (keyword.includes('supplement') || keyword.includes('research')) score *= 2.5;
  if (keyword.includes('benefits') || keyword.includes('effects')) score *= 1.8;
  if (keyword.includes('studies') || keyword.includes('clinical')) score *= 1.5;

  // Competition adjustments
  if (competition === 'LOW') score *= 1.5;
  else if (competition === 'HIGH') score *= 0.7;

  // Penalize transactional/low-value keywords
  if (keyword.includes('buy') || keyword.includes('amazon')) score *= 0.2;
  if (keyword.includes('dosage') || keyword.includes('calculator')) score *= 0.1;
  if (keyword.includes('price') || keyword.includes('cost')) score *= 0.3;

  return Math.round(score);
}

export async function fetchKeywordResearch(supplementName) {
  // Check if credentials are set
  if (!process.env.DATAFORSEO_USERNAME || !process.env.DATAFORSEO_PASSWORD) {
    logger.warn('DataForSEO credentials not set - using mock keyword data');
    return generateMockKeywordData(supplementName);
  }

  const username = process.env.DATAFORSEO_USERNAME;
  const password = process.env.DATAFORSEO_PASSWORD;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  logger.info({ supplementName }, 'Fetching keyword research from DataForSEO');

  try {
    const [suggestionsResponse, relatedResponse] = await Promise.all([
      axios.post(
        'https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live',
        [{
          keyword: supplementName,
          location_name: 'United States',
          language_code: 'en',
          limit: 200
        }],
        { headers }
      ),
      axios.post(
        'https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live',
        [{
          keyword: supplementName,
          location_name: 'United States',
          language_code: 'en',
          depth: 2,
          limit: 200
        }],
        { headers }
      )
    ]);

    const allKeywords = [];

    [suggestionsResponse.data, relatedResponse.data].forEach((response) => {
      if (response.tasks?.[0]?.result?.[0]?.items) {
        response.tasks[0].result[0].items.forEach((item) => {
          if (item.keyword_data) {
            allKeywords.push(item.keyword_data);
          }
        });
      }
    });

    logger.info({ rawKeywordCount: allKeywords.length }, 'Extracted raw keywords');

    const processedKeywords = allKeywords
      .filter(kd => kd?.keyword)
      .map(kd => ({
        keyword: kd.keyword,
        search_volume: kd.keyword_info?.search_volume || 0,
        difficulty: kd.keyword_properties?.keyword_difficulty || 99,
        competition: kd.keyword_info?.competition_level || 'Unknown',
        intent: kd.search_intent_info?.main_intent || 'Unknown',
        opportunity_score: scoreKeyword(kd)
      }))
      .filter(item => item.opportunity_score > 0);

    // Deduplicate by lowercase keyword
    const seen = new Set();
    const uniqueKeywords = processedKeywords.filter(item => {
      const key = item.keyword.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by opportunity score and take top 15
    const topKeywords = uniqueKeywords
      .sort((a, b) => b.opportunity_score - a.opportunity_score)
      .slice(0, 15);

    logger.info({
      supplementName,
      topKeywordCount: topKeywords.length,
      topScore: topKeywords[0]?.opportunity_score
    }, 'Keyword research completed');

    return {
      supplement_name: supplementName,
      top_keywords: topKeywords,
      keyword_count: topKeywords.length,
      total_raw_keywords: allKeywords.length
    };

  } catch (error) {
    logger.error({ error, supplementName }, 'DataForSEO API failed');

    // Fallback to mock data on error
    if (error.message.includes('401')) {
      logger.warn({ supplementName }, 'DataForSEO credentials invalid - falling back to mock data');
      return generateMockKeywordData(supplementName);
    }

    throw new Error(`DataForSEO API failed: ${error.message}`);
  }
}
