import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROGRESS_FILE = path.join(__dirname, '..', 'progress.json');

/**
 * Simple JSON file-based progress tracking
 */

export function getProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading progress file:', error);
  }

  // Default progress
  return {
    lastIndex: -1,
    lastSupplement: null,
    lastGenerated: null,
    totalGenerated: 0
  };
}

export function saveProgress(index, supplementName) {
  try {
    const progress = {
      lastIndex: index,
      lastSupplement: supplementName,
      lastGenerated: new Date().toISOString(),
      totalGenerated: (getProgress().totalGenerated || 0) + 1
    };

    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    return progress;
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

export function resetProgress() {
  try {
    const progress = {
      lastIndex: -1,
      lastSupplement: null,
      lastGenerated: null,
      totalGenerated: 0
    };

    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    return progress;
  } catch (error) {
    console.error('Error resetting progress:', error);
    throw error;
  }
}
