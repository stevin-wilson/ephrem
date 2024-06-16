// - - - - - - - - - -
import {AxiosRequestConfig} from 'axios';
import {fetchBibles} from './api-bible.js';
import {
  dateReviver,
  defaultCacheDir,
  getThresholdDate,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';
import {BibleResponse, Bibles, BiblesCache} from '../types.js';

// - - - - - - - - - -
//  Abbreviation -> Bible

/**
 * Returns the cache path for bibles.
 * @param cacheDir - The directory where the cache is stored. Defaults to defaultCacheDir if not specified.
 * @returns - The cache path for bibles.
 */
const getBiblesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/bibles.json`;
};

// - - - - - - - - - -
/**
 * Saves the Bibles object to the specified cache directory in JSON format.
 * If no cache directory is provided, the default cache directory will be used.
 * @param bibles - The Bibles object to be saved.
 * @param [cacheDir] - The cache directory path.
 * @returns - A Promise that resolves when the Bibles object is successfully saved.
 */
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
/**
 * Cleans the bibles cache by removing entries that are older than the specified maximum age.
 * @param bibles - The bibles cache object.
 * @param [maxAgeDays] - The maximum age of entries to keep in days.
 * @param [currentTimestamp] - The current timestamp.
 * If not provided, the current date will be used.
 * @returns - The cleaned bibles cache object.
 */
const cleanBiblesCache = (
  bibles: Bibles,
  maxAgeDays = 14,
  currentTimestamp?: Date
): Bibles => {
  const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);

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
/**
 * Loads the Bibles from the cache directory.
 * @param cacheDir - The cache directory path. Default value is defaultCacheDir.
 * @param [maxAgeDays] - The maximum age of the cached Bibles in days.
 * @param [currentTimestamp] - The current timestamp.
 * @returns - A promise that resolves to the loaded Bibles.
 */
export const loadBibles = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number,
  currentTimestamp?: Date
): Promise<Bibles> => {
  try {
    const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
    const bibles = JSON.parse(jsonData, dateReviver) as Bibles;
    return typeof maxAgeDays === 'number' && maxAgeDays >= 0
      ? cleanBiblesCache(bibles, maxAgeDays, currentTimestamp)
      : bibles;
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
/**
 * Prepares bible data for caching.
 * @param bibleResponse - The response from the bible API.
 * @param timestamp - The current timestamp.
 * @returns The prepared bible data for caching.
 */
const prepareBibleData = (bibleResponse: BibleResponse, timestamp: Date) => {
  const {id, abbreviation, language} = bibleResponse;
  return {
    [abbreviation]: {
      id,
      language: language.id,
      scriptDirection: language.scriptDirection,
      cachedOn: timestamp,
    },
  };
};

/**
 * Updates bibles in the cache for the specified languages.
 * @param languages - The ISO 639-3 three digit language codes for which to update the bibles.
 * @param cache - The cache object where the bibles will be updated.
 * @param [biblesToExclude] - The list of bible abbreviations to exclude from the update.
 * @param [config] - The Axios request configuration options.
 * @param [timestamp] - The timestamp for the bible update.
 * @returns - A promise that resolves once the bibles have been updated.
 */
export const updateBibles = async (
  languages: string[],
  cache: BiblesCache,
  biblesToExclude: string[] = [],
  config: AxiosRequestConfig = {},
  timestamp: Date = new Date()
): Promise<void> => {
  for (const language of languages) {
    const bibleResponses: BibleResponse[] = await fetchBibles(language, config);
    bibleResponses
      .filter(
        bibleResponse => !biblesToExclude.includes(bibleResponse.abbreviation)
      )
      .forEach(bibleResponse => {
        Object.assign(cache.bibles, prepareBibleData(bibleResponse, timestamp));
      });
  }
  cache.updatedSinceLoad = true;
};
