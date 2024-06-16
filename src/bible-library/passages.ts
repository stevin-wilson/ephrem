import {
  dateReviver,
  defaultCacheDir,
  getThresholdDate,
  writeJsonFile,
} from '../utils.js';
import {
  BiblesCache,
  Passage,
  PassageAndFumsResponse,
  PassageOptions,
  PassageQuery,
  Passages,
  PassagesCache,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {fetchPassage} from './api-bible.js';
import {
  initializeBiblesCache,
  initializePassagesCache,
  needsBiblesCacheUpdate,
  updateBiblesCache,
} from './cache.js';

/**
 * Returns the path to the cache file for passages.
 * @param [cacheDir] - The directory to store the cache file.
 * @returns - The path to the cache file for passages.
 */
const getPassagesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/passages.json`;
};

// - - - - - - - - - -
/**
 * Saves passages to a cache directory.
 * @param passages - The passages to be saved.
 * @param [cacheDir] - The directory where the passages will be saved. If not specified, the default cache directory will be used.
 * @returns - A Promise that resolves once the passages are saved.
 */
export const savePassages = async (
  passages: Passages,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getPassagesCachePath(cacheDir),
    JSON.stringify(passages, null, 2)
  );
};

// - - - - - - - - - -

/**
 * Cleans the passages cache by removing passages that are older than a given threshold date.
 * @param passages - The passages cache to be cleaned.
 * @param [maxAgeDays] - The maximum age in days of the passages to keep. Passages older than this will be removed.
 * @param [currentTimestamp] - The current timestamp. If provided, it will be used instead of the system's current date and time.
 * @returns - The cleaned passages cache.
 */
const cleanPassagesCache = (
  passages: Passages,
  maxAgeDays = 14,
  currentTimestamp?: Date
): Passages => {
  const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);
  const cleanedPassages: Passages = {};
  for (const [passageAndBible, Passages] of Object.entries(passages)) {
    const filteredPassages = Passages.filter(
      passage => passage.cachedOn > thresholdDate
    );
    if (filteredPassages.length > 0) {
      cleanedPassages[passageAndBible] = filteredPassages;
    }
  }
  return cleanedPassages;
};

/**
 * Asynchronously loads passages from cache.
 * @param cacheDir - The directory where the cache file is located. Defaults to `defaultCacheDir`.
 * @param [maxAgeDays] - The maximum age (in days) of the passages to consider valid. If not provided, all passages will be returned.
 * @param [currentTimestamp] - The current timestamp used for calculating passage age. If not provided, the current date and time will be used.
 * @returns - A Promise that resolves to the loaded passages.
 */
export const loadPassages = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number,
  currentTimestamp?: Date
): Promise<Passages> => {
  try {
    const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
    const passages = JSON.parse(jsonData, dateReviver) as Passages;

    return typeof maxAgeDays === 'number' && maxAgeDays >= 0
      ? cleanPassagesCache(passages, maxAgeDays, currentTimestamp)
      : passages;
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

// - - - - - - - - - -
/**
 * Get a string representation of a passage ID and a Bible abbreviation.
 * @param passageID - The ID of the passage to concatenate.
 * @param bibleAbbreviation - The abbreviation of the Bible to concatenate.
 * @returns - The concatenated string.
 */
const getPassageAndBible = (passageID: string, bibleAbbreviation: string) =>
  `${passageID}@${bibleAbbreviation}`;

// - - - - - - - - - -
export const passageQueriesAreEqual = (
  query1: PassageQuery,
  query2: PassageQuery
): boolean => {
  return (
    query1.passageID === query2.passageID &&
    query1.bibleID === query2.bibleID &&
    query1.contentType === query2.contentType &&
    query1.includeNotes === query2.includeNotes &&
    query1.includeTitles === query2.includeTitles &&
    query1.includeChapterNumbers === query2.includeChapterNumbers &&
    query1.includeVerseNumbers === query2.includeVerseNumbers &&
    query1.includeVerseSpans === query2.includeVerseSpans
  );
};

// - - - - - - - - - -
const getPassage = async (
  passageID: string,
  bibleAbbreviation: string,
  passageOptions: PassageOptions = {},
  biblesCache: BiblesCache = initializeBiblesCache(),
  passagesCache: PassagesCache = initializePassagesCache(),
  config: AxiosRequestConfig = {},
  languages: string[] = [],
  biblesToExclude: string[] = [],
  forceApiCall = false
): Promise<PassageAndFumsResponse> => {
  // if already present in cache, return PassageAndFumsResponse from cache
  // else, fetch from API and return response and update PassageCache
  const needToUpdateCache = needsBiblesCacheUpdate(
    bibleAbbreviation,
    languages,
    biblesCache
  );

  if (needToUpdateCache) {
    await updateBiblesCache(
      languages,
      biblesCache,
      false,
      biblesToExclude,
      config
    );
  }

  const bibleID = biblesCache.bibles[bibleAbbreviation]?.id;
  if (!bibleID) {
    throw new Error(
      `Bible with abbreviation "${bibleAbbreviation}" not found in cache. Please ensure the correct abbreviations are used.`
    );
  }

  const passageQuery: PassageQuery = {
    passageID,
    bibleID,
    ...passageOptions,
  };

  const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);

  if (!forceApiCall) {
    const passages: Passage[] | undefined =
      passagesCache.passages[passageAndBible];

    if (passages !== undefined) {
      for (const passage of passages) {
        if (passageQueriesAreEqual(passage.query, passageQuery)) {
          return passage.response;
        }
      }
    }
  }

  const passageAndFums = await fetchPassage(
    passageID,
    bibleID,
    passageOptions,
    config
  );

  const passage: Passage = {
    query: passageQuery,
    response: passageAndFums,
    cachedOn: new Date(),
  };

  if (!(passageAndBible in passagesCache.passages)) {
    passagesCache.passages[passageAndBible] = [] as Passage[];
  }

  passagesCache.passages[passageAndBible].push(passage);
  passagesCache.updatedSinceLoad = true;

  return passageAndFums;
};
