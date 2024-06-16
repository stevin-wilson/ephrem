import {
  dateReviver,
  defaultBiblesToExclude,
  defaultCacheDir,
  defaultLanguages,
  defaultPassageOptions,
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
import {defaultConfig, fetchPassage} from './api-bible.js';
import {
  loadBiblesCache,
  needsBiblesCacheUpdate,
  updateBiblesCache,
} from './bibles.js';

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
export const cleanPassagesCache = (
  passages: Passages,
  currentTimestamp?: Date,
  maxAgeDays = 14
): [Passages, boolean] => {
  const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);

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
  cacheDir: string = defaultCacheDir
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
export const getPassage = async (
  passageID: string,
  bibleAbbreviation: string,
  passagesCache?: PassagesCache,
  biblesCache?: BiblesCache,
  config: AxiosRequestConfig = defaultConfig,
  passageOptions: PassageOptions = defaultPassageOptions,
  languages: string[] = defaultLanguages,
  biblesToExclude: string[] = defaultBiblesToExclude,
  forceApiCall = false
): Promise<PassageAndFumsResponse> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  if (passagesCache === undefined) {
    passagesCache = await loadPassagesCache();
  }

  // if already present in cache, return PassageAndFumsResponse from cache
  // else, fetch from API and return response and update PassageCache
  const needToUpdateCache = needsBiblesCacheUpdate(
    biblesCache,
    bibleAbbreviation,
    languages
  );

  if (needToUpdateCache) {
    await updateBiblesCache(
      biblesCache,
      languages,
      biblesToExclude,
      config,
      false
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

// - - - - - - - - - -

export const loadPassagesCache = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays: number | undefined = 14,
  currentTimestamp = new Date()
): Promise<PassagesCache> => {
  let passages: Passages = await loadPassages(cacheDir);
  let updatedSinceLoad = false;

  if (maxAgeDays !== undefined && maxAgeDays >= 0) {
    [passages, updatedSinceLoad] = cleanPassagesCache(
      passages,
      currentTimestamp,
      maxAgeDays
    );
  }

  return {
    passages,
    updatedSinceLoad,
  };
};

// - - - - - - - - - -
/**
 * Saves the PassagesCache data to the specified passagesCache directory.
 * @param passagesCache - The PassagesCache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the passagesCache data will be saved.
 * @returns - A promise that resolves when the passagesCache data is successfully saved, or rejects with an error if saving fails.
 */
export const savePassagesCache = async (
  passagesCache: PassagesCache,
  cacheDir: string = defaultCacheDir
): Promise<void> => {
  if (!passagesCache.updatedSinceLoad) {
    return;
  }

  try {
    await savePassages(passagesCache.passages, cacheDir);
    passagesCache.updatedSinceLoad = false;
  } catch (error) {
    console.error('Error saving passages to passagesCache', error);
  }
};
