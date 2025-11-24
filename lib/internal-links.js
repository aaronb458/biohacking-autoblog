/**
 * Internal Linking System
 *
 * Manages cross-linking between blog posts for SEO and user engagement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BIOHACKING_SUPPLEMENTS } from './supplements-list.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LINKS_FILE = path.join(__dirname, '..', 'published-posts.json');

/**
 * Get list of published posts with URLs
 */
export function getPublishedPosts() {
  try {
    if (fs.existsSync(LINKS_FILE)) {
      const data = fs.readFileSync(LINKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading published posts:', error);
  }
  return [];
}

/**
 * Save published post info for internal linking
 */
export function savePublishedPost(supplement, url, postId) {
  try {
    const posts = getPublishedPosts();

    // Add new post
    posts.push({
      supplement,
      url,
      postId,
      publishedAt: new Date().toISOString(),
      slug: url.split('/').pop()
    });

    fs.writeFileSync(LINKS_FILE, JSON.stringify(posts, null, 2));
    return posts;
  } catch (error) {
    console.error('Error saving published post:', error);
    throw error;
  }
}

/**
 * Get relevant internal links for a supplement
 * Returns 3-5 related supplements that have been published
 */
export function getInternalLinksFor(supplementName) {
  const published = getPublishedPosts();

  if (published.length === 0) {
    return [];
  }

  // Find related supplements based on category/function
  const related = findRelatedSupplements(supplementName);

  // Filter to only include published posts
  const availableLinks = published
    .filter(post => related.includes(post.supplement))
    .slice(0, 5);

  return availableLinks;
}

/**
 * Find related supplements by category
 */
function findRelatedSupplements(supplementName) {
  // Category mappings for related supplements
  const categories = {
    // Cognitive/Nootropics
    cognitive: [
      'Lions Mane Mushroom',
      'Bacopa Monnieri',
      'Ginkgo Biloba',
      'Alpha-GPC',
      'L-Tyrosine',
      'Phosphatidylserine',
      'Huperzine A'
    ],

    // Energy/Performance
    energy: [
      'Creatine Monohydrate',
      'Beta-Alanine',
      'L-Carnitine',
      'Rhodiola Rosea',
      'Cordyceps Mushroom',
      'CoQ10',
      'Caffeine + L-Theanine'
    ],

    // Sleep/Relaxation
    sleep: [
      'Magnesium Glycinate',
      'Magnesium Threonate',
      'L-Theanine',
      'GABA',
      'Valerian Root',
      'Melatonin',
      'Glycine (for sleep)',
      'Apigenin'
    ],

    // Hormonal
    hormonal: [
      'Tongkat Ali (Longjack)',
      'Ashwagandha',
      'Fadogia Agrestis',
      'Tribulus Terrestris',
      'DIM (Diindolylmethane)',
      'Boron',
      'Zinc Picolinate'
    ],

    // Longevity/Anti-Aging
    longevity: [
      'NMN (Nicotinamide Mononucleotide)',
      'Resveratrol',
      'Quercetin',
      'Fisetin',
      'Spermidine',
      'Glutathione',
      'NAC (N-Acetyl Cysteine)',
      'Alpha-Lipoic Acid'
    ],

    // Gut Health
    gut: [
      'Probiotics (Multi-Strain)',
      'L-Glutamine',
      'Zinc Carnosine',
      'Digestive Enzymes',
      'Butyrate'
    ],

    // Recovery/Inflammation
    recovery: [
      'Curcumin (Turmeric Extract)',
      'Omega-3 Fish Oil',
      'Collagen Peptides',
      'MSM (Methylsulfonylmethane)',
      'Boswellia Serrata'
    ]
  };

  // Find which category the supplement belongs to
  for (const [category, supplements] of Object.entries(categories)) {
    if (supplements.includes(supplementName)) {
      // Return other supplements in same category
      return supplements.filter(s => s !== supplementName);
    }
  }

  // If not in a category, return empty array
  return [];
}

/**
 * Generate internal link HTML
 */
export function formatInternalLink(post, anchorText = null) {
  const text = anchorText || post.supplement;
  return `<a href="${post.url}">${text}</a>`;
}

/**
 * Get internal link suggestions as formatted text for AI prompt
 */
export function getInternalLinkSuggestions(supplementName) {
  const links = getInternalLinksFor(supplementName);

  if (links.length === 0) {
    return "No internal links available yet (this is one of the first posts).";
  }

  const suggestions = links.map(post => {
    return `- ${post.supplement}: <a href="${post.url}">${post.supplement}</a>`;
  }).join('\n');

  return `
**INTERNAL LINKS - MUST INCLUDE 2-3 OF THESE IN YOUR POST:**

${suggestions}

**How to use:** Naturally reference these supplements when relevant. Examples:
- "Similar cognitive benefits to <a href="${links[0]?.url}">Lions Mane</a>"
- "I stack this with <a href="${links[1]?.url}">${links[1]?.supplement}</a> for..."
- "If you're also taking <a href="${links[2]?.url}">${links[2]?.supplement}</a>, here's what to know..."

Spread these links throughout the post - don't cluster them all in one section.
`;
}
