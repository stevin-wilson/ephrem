import {
  dateReviver,
  defaultCacheDir,
  getThresholdDate,
  writeJsonFile,
} from '../utils.js';
import {
  Cache,
  Passage,
  PassageOptions,
  PassageQuery,
  Passages,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {fetchPassage} from './api-bible.js';

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
/**
 * Retrieves a Bible passage.
 * @param passageID - The ID of the passage.
 * @param bibleID - The ID of the Bible.
 * @param [passageOptions] - The options for the passage.
 * @param [config] - The configuration options for the request.
 * @param [timestamp] - The timestamp of when the passage was retrieved.
 * @returns - A Promise that resolves with the retrieved passage.
 */
const getPassage = async (
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions = {},
  config: AxiosRequestConfig = {},
  timestamp: Date = new Date()
): Promise<Passage> => {
  const passageAndFums = await fetchPassage(
    passageID,
    bibleID,
    passageOptions,
    config
  );

  const passageQuery: PassageQuery = {
    passageID,
    bibleID,
    ...passageOptions,
  };

  return {
    query: passageQuery,
    ...passageAndFums.data,
    fums: passageAndFums.meta.fums,
    cachedOn: timestamp,
  };
};

// - - - - - - - - - -
/**
 * Adds a new passage to the existing list of passages.
 * @param passages - The existing list of passages.
 * @param passageID - The ID of the passage to add.
 * @param bibleID - The ID of the Bible associated with the passage.
 * @param passageOptions - The options to be applied to the passage.
 * @param config - The configuration for the HTTP request.
 * @param timestamp - The timestamp to use for the passage.
 * @param cache - The cache object.
 * @param passageAndBible - The unique key to identify the passage in the cache.
 * @returns - A promise that resolves when the passage is added successfully.
 */
const addToPassage = async (
  passages: Passage[],
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions,
  config: AxiosRequestConfig,
  timestamp: Date,
  cache: Cache,
  passageAndBible: string
) => {
  const newPassage: Passage = await getPassage(
    passageID,
    bibleID,
    passageOptions,
    config,
    timestamp
  );
  passages.push(newPassage);
  cache.passages[passageAndBible] = passages;
};

/**
 * Updates the passage in the cache with the given passageID and bibleAbbreviation.
 * @param passageID - The unique identifier of the passage.
 * @param bibleAbbreviation - The abbreviation of the bible.
 * @param cache - The cache object that holds the passages and bibles.
 * @param [passageOptions] - The options to include in the passage query.
 * @param [config] - The config object for the Axios request.
 * @param [timestamp] - The timestamp of the update.
 * @throws {Error} if the bibleID cannot be found in the cache.
 * @returns - A Promise that resolves when the passage is updated in the cache.
 */
export const updatePassage = async (
  passageID: string,
  bibleAbbreviation: string,
  cache: Cache,
  passageOptions: PassageOptions = {},
  config: AxiosRequestConfig = {},
  timestamp: Date = new Date()
): Promise<void> => {
  const bibleID = cache.bibles[bibleAbbreviation]?.id;
  if (!bibleID) {
    throw new Error(
      `Bible with abbreviation "${bibleAbbreviation}" not found in cache. Please ensure the correct abbreviations are used.`
    );
  }

  const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);
  const passageQuery: PassageQuery = {
    passageID,
    bibleID,
    ...passageOptions,
  };

  const passages: Passage[] | undefined = cache.passages[passageAndBible];
  if (passages === undefined || passages.length === 0) {
    try {
      await addToPassage(
        [],
        passageID,
        bibleID,
        passageOptions,
        config,
        timestamp,
        cache,
        passageAndBible
      );
    } catch (error) {
      throw new Error(
        `Failed to add passage to cache: ${(error as Error).message}`
      );
    }
  } else {
    let addedToPassages = false;
    for (const passage of passages) {
      if (passageQueriesAreEqual(passage.query, passageQuery)) {
        addedToPassages = true;
        break;
      }
    }
    if (!addedToPassages) {
      try {
        await addToPassage(
          passages,
          passageID,
          bibleID,
          passageOptions,
          config,
          timestamp,
          cache,
          passageAndBible
        );
      } catch (error) {
        throw new Error(
          `Failed to add passage to existing passages in cache: ${
            (error as Error).message
          }`
        );
      }
    }
  }

  cache.updatedSinceLoad = true;
};
