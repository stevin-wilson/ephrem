// - - - - - - - - - -
import {AxiosRequestConfig} from 'axios';
import {fetchBibles} from './api-bible.js';
import {defaultCacheDir, writeJsonFile} from '../utils.js';
import fs from 'fs-extra';
import {BibleResponse, Bibles, Cache} from '../types.js';

// - - - - - - - - - -
//  Abbreviation -> Bible

const getBiblesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/bibles.json`;
};

// - - - - - - - - - -
// serialize the BooksToChapters map to JSON
export const saveBibles = async (
  bibles: Bibles,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBiblesCachePath(cacheDir),
    JSON.stringify(bibles, null, 2)
  );
};

// - - - - - - - - - -
// deserialize JSON back to a BooksToChapters map
const cleanBiblesCache = (
  bibles: Bibles,
  maxAgeDays = 14,
  currentTimestamp?: Date
): Bibles => {
  let thresholdDate = currentTimestamp;
  if (thresholdDate === undefined) {
    thresholdDate = new Date();
  }
  thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);

  const cleanedBibles: Bibles = {};

  for (const abbreviation of Object.keys(bibles)) {
    const bible = bibles[abbreviation];
    if (bible.cachedOn > thresholdDate) {
      cleanedBibles[abbreviation] = bible;
    }
  }

  return cleanedBibles;
};

// - - - - - - - - - -
export const loadBibles = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number,
  currentTimestamp?: Date
): Promise<Bibles> => {
  try {
    const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
    const bibles = JSON.parse(jsonData) as Bibles;
    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanBiblesCache(bibles, maxAgeDays, currentTimestamp);
    } else {
      return bibles;
    }
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

// - - - - - - - - - -
export const updateBibles = async (
  languages: string[],
  cache: Cache,
  biblesToExclude: string[] = [],
  config: AxiosRequestConfig = {},
  timestamp?: Date
): Promise<void> => {
  if (timestamp === undefined) {
    timestamp = new Date();
  }
  for (const language of languages) {
    const bibleResponses: BibleResponse[] = await fetchBibles(language, config);

    for (const bibleResponse of bibleResponses) {
      if (biblesToExclude.includes(bibleResponse.abbreviation)) {
        continue;
      }

      cache.bibles[bibleResponse.abbreviation] = {
        id: bibleResponse.id,
        language: bibleResponse.language.id,
        scriptDirection: bibleResponse.language.scriptDirection,
        cachedOn: timestamp,
      };
    }
  }
  cache.updatedSinceLoad = true;
};
