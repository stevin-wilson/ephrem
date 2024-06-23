import {
  dateReviver,
  getThresholdDate,
  normalizeLanguage,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';
import {CACHE_DIR, MAX_CACHE_AGE_DAYS} from './cache-utils.js';
import {Bibles, Passages} from './cache-types.js';
import {BibleResponse} from '../api-bible/api-types.js';

const getPassagesCachePath = (cacheDir: string = CACHE_DIR) => {
  return `${cacheDir}/passages.json`;
};

export const savePassages = async (
  passages: Passages,
  cacheDir: string = CACHE_DIR
) => {
  await writeJsonFile(
    getPassagesCachePath(cacheDir),
    JSON.stringify(passages, null, 2)
  );
};

export const cleanPassagesCache = (
  passages: Passages,
  currentTimestamp?: Date,
  maxCacheAgeDays = MAX_CACHE_AGE_DAYS
): [Passages, boolean] => {
  if (!maxCacheAgeDays || maxCacheAgeDays < 0) {
    return [passages, false];
  }

  const thresholdDate = getThresholdDate(maxCacheAgeDays, currentTimestamp);

  const cleanedPassages: Passages = {};
  let removedRecords = false;

  for (const [passageAndBible, currentPassages] of Object.entries(passages)) {
    const filteredPassages = currentPassages.filter(
      passage => passage.cachedOn > thresholdDate
    );
    if (filteredPassages.length !== currentPassages.length) {
      removedRecords = true;
    }

    if (filteredPassages.length > 0) {
      cleanedPassages[passageAndBible] = filteredPassages;
    }
  }
  return [cleanedPassages, removedRecords];
};

export const loadPassages = async (
  cacheDir: string = CACHE_DIR
): Promise<Passages> => {
  try {
    const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
    return JSON.parse(jsonData, dateReviver) as Passages;
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return {} as Passages;
  }
};
