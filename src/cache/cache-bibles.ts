import {
  dateReviver,
  getThresholdDate,
  normalizeLanguage,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';

import {Bibles} from './cache-types.js';
import {BibleResponse} from '../api-bible/api-types.js';
import {getDefaultCacheDir, getDefaultMaxCacheAgeDays} from './cache-utils.js';

const getBiblesCachePath = (cacheDir: string = getDefaultCacheDir()) => {
  return `${cacheDir}/bibles.json`;
};

export const saveBibles = async (
  bibles: Bibles,
  cacheDir: string = getDefaultCacheDir()
) => {
  await writeJsonFile(
    getBiblesCachePath(cacheDir),
    JSON.stringify(bibles, null, 2)
  );
};

export const cleanBibles = (
  bibles: Bibles,
  timestamp?: Date,
  maxCacheAgeDays = getDefaultMaxCacheAgeDays()
): [Bibles, boolean] => {
  if (!maxCacheAgeDays || maxCacheAgeDays < 0) {
    return [bibles, false];
  }

  const thresholdDate = getThresholdDate(maxCacheAgeDays, timestamp);

  const cleanedBibles: Bibles = {};
  let removedRecords = false;

  for (const abbreviation of Object.keys(bibles)) {
    const bible = bibles[abbreviation];
    if (bible.cachedOn > thresholdDate) {
      cleanedBibles[abbreviation] = bible;
    } else {
      removedRecords = true;
    }
  }

  return [cleanedBibles, removedRecords];
};

export const loadBibles = async (
  cacheDir: string = getDefaultCacheDir()
): Promise<Bibles> => {
  try {
    const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
    return JSON.parse(jsonData, dateReviver) as Bibles;
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return {} as Bibles;
  }
};

export const prepareBibleData = (
  bibleResponse: BibleResponse,
  timestamp: Date
): Bibles => {
  const {id, abbreviation, language} = bibleResponse;
  return {
    [abbreviation]: {
      id,
      language: normalizeLanguage(language.id),
      cachedOn: timestamp,
    },
  };
};
