import express from 'express';
import dotenv from 'dotenv';
import { getNextSupplement, getSupplementByIndex, TOTAL_SUPPLEMENTS } from './lib/supplements-list.js';
import { generateAndPublishPost } from './lib/workflow.js';
import { getProgress, saveProgress, resetProgress } from './lib/progress.js';
import { logger } from './lib/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request');
  next();
});

/**
 * GET /
 * API info
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Biohacking Autoblog Generator',
    version: '1.0.0',
    endpoints: {
      'GET /progress': 'Get current progress through supplement list',
      'POST /generate': 'Generate and publish next supplement post',
      'POST /generate/:supplement': 'Generate and publish specific supplement',
      'DELETE /progress': 'Reset progress to start'
    }
  });
});

/**
 * GET /progress
 * Get current progress
 */
app.get('/progress', (req, res) => {
  try {
    const progress = getProgress();
    const nextIndex = (progress.lastIndex + 1) % TOTAL_SUPPLEMENTS;
    const nextSupplement = getNextSupplement(progress.lastIndex);

    res.json({
      success: true,
      progress: {
        ...progress,
        nextIndex,
        nextSupplement,
        totalSupplements: TOTAL_SUPPLEMENTS,
        percentComplete: ((nextIndex / TOTAL_SUPPLEMENTS) * 100).toFixed(1)
      }
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get progress');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /generate
 * Generate and publish next supplement in rotation
 */
app.post('/generate', async (req, res) => {
  try {
    const { dryRun = false, skipAICheck = false } = req.body;

    // Get current progress
    const progress = getProgress();
    const nextIndex = (progress.lastIndex + 1) % TOTAL_SUPPLEMENTS;
    const supplementName = getNextSupplement(progress.lastIndex);

    logger.info({
      supplement: supplementName,
      index: nextIndex,
      progress: `${nextIndex + 1}/${TOTAL_SUPPLEMENTS}`,
      dryRun,
      skipAICheck
    }, '🚀 Starting auto-post generation');

    // Generate and publish
    const result = await generateAndPublishPost({
      supplementName,
      skipAICheck,
      dryRun
    });

    // Save progress
    const updatedProgress = saveProgress(nextIndex, supplementName);

    res.json({
      success: true,
      ...result,
      progress: updatedProgress
    });

  } catch (error) {
    logger.error({ error }, 'Generation failed');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /generate/:supplement
 * Generate specific supplement by name
 */
app.post('/generate/:supplement', async (req, res) => {
  try {
    const supplementName = decodeURIComponent(req.params.supplement);
    const { dryRun = false, skipAICheck = false } = req.body;

    logger.info({ supplement: supplementName, dryRun, skipAICheck }, '🚀 Starting specific supplement generation');

    const result = await generateAndPublishPost({
      supplementName,
      skipAICheck,
      dryRun
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error({ error }, 'Generation failed');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /progress
 * Reset progress to start
 */
app.delete('/progress', (req, res) => {
  try {
    const progress = resetProgress();

    logger.info('🔄 Progress reset to start');

    res.json({
      success: true,
      message: 'Progress reset to start',
      progress
    });
  } catch (error) {
    logger.error({ error }, 'Failed to reset progress');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT }, `🚀 Biohacking Autoblog API running on port ${PORT}`);
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   GET  /progress              - Check current progress`);
  console.log(`   POST /generate              - Generate next supplement post`);
  console.log(`   POST /generate/:supplement  - Generate specific supplement`);
  console.log(`   DELETE /progress            - Reset progress\n`);
});
