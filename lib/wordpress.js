import WPAPI from 'wpapi';
import { logger } from './logger.js';

/**
 * WordPress Publisher
 */

export async function publishToWordPress(content) {
  const { html_content, title, meta_description } = content;

  if (!process.env.WORDPRESS_URL || !process.env.WORDPRESS_USERNAME || !process.env.WORDPRESS_APP_PASSWORD) {
    throw new Error('WordPress credentials not configured');
  }

  const wp = new WPAPI({
    endpoint: `${process.env.WORDPRESS_URL}/wp-json`,
    username: process.env.WORDPRESS_USERNAME,
    password: process.env.WORDPRESS_APP_PASSWORD
  });

  logger.info({ title }, 'Publishing to WordPress');

  try {
    const post = await wp.posts().create({
      title,
      content: html_content,
      status: 'draft', // Save as draft instead of publishing immediately
      excerpt: meta_description,
      meta: {
        _yoast_wpseo_metadesc: meta_description,
        _yoast_wpseo_title: title
      }
    });

    logger.info({
      postId: post.id,
      postUrl: post.link,
      title
    }, 'Post published successfully');

    return {
      postId: post.id,
      postUrl: post.link
    };

  } catch (error) {
    logger.error({ error, title }, 'WordPress publishing failed');
    throw new Error(`WordPress publishing failed: ${error.message}`);
  }
}
