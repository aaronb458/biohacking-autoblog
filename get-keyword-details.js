import { fetchKeywordResearch } from './lib/dataforseo.js';

// Fetch detailed keyword data for Creatine Monohydrate
console.log('🔍 Fetching detailed keyword research for Creatine Monohydrate...\n');

const result = await fetchKeywordResearch('Creatine Monohydrate');

console.log('📊 KEYWORD RESEARCH RESULTS\n');
console.log(`Supplement: ${result.supplement_name}`);
console.log(`Total Keywords Found: ${result.keyword_count}`);
console.log(`Raw Keywords Analyzed: ${result.total_raw_keywords}\n`);

console.log('🎯 TOP KEYWORDS BY OPPORTUNITY SCORE\n');
console.log('(Opportunity Score = Search Volume / Difficulty × Relevance Multipliers)\n');

result.top_keywords.forEach((kw, index) => {
  console.log(`${index + 1}. "${kw.keyword}"`);
  console.log(`   Search Volume: ${kw.search_volume.toLocaleString()}/month`);
  console.log(`   Difficulty: ${kw.difficulty}/100`);
  console.log(`   Competition: ${kw.competition}`);
  console.log(`   Intent: ${kw.intent}`);
  console.log(`   Opportunity Score: ${kw.opportunity_score.toLocaleString()}`);
  console.log('');
});

console.log('💡 KEYWORD STRATEGY NOTES:\n');
console.log('- Primary keyword should appear in title, H1, first paragraph, and 2-3 more times');
console.log('- Use keyword variations naturally throughout the content');
console.log('- High search volume + low difficulty = best opportunities');
console.log('- "Research" and "benefits" keywords are boosted 1.5-2.5x for relevance');
console.log('- Transactional keywords ("buy", "price") are penalized in scoring\n');

console.log('📈 ESTIMATED MONTHLY TRAFFIC POTENTIAL:\n');
const totalVolume = result.top_keywords.reduce((sum, kw) => sum + kw.search_volume, 0);
const avgPosition = 15; // Conservative estimate for new content
const avgCTR = 0.02; // 2% CTR at position 15
const estimatedClicks = Math.round(totalVolume * avgCTR);

console.log(`Total search volume for top keywords: ${totalVolume.toLocaleString()}/month`);
console.log(`Estimated position for new content: #${avgPosition}`);
console.log(`Estimated CTR at position ${avgPosition}: ${(avgCTR * 100).toFixed(1)}%`);
console.log(`Potential monthly clicks: ${estimatedClicks.toLocaleString()}`);
console.log('(Actual traffic will improve as the site builds authority)\n');
