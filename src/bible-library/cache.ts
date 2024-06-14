// - - - - - - - - - -
import {Bibles, BookNames, Cache, Passages} from '../types.js';
import {loadBibles, saveBibles, updateBibles} from './bibles.js';
import {loadBookNames, saveBookNames, updateBookNames} from './book-names.js';
import {defaultCacheDir} from '../utils.js';
import {loadPassages, savePassages} from './passages.js';
import {AxiosRequestConfig} from 'axios';

// - - - - - - - - - -
/**
 * Loads the cache from the cache directory and returns a Promise that resolves to the Cache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data. If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded Cache object.
 */
export const loadCache = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number
): Promise<Cache> => {
  const bibles: Bibles = await loadBibles(cacheDir, maxAgeDays);
  const bookNames: BookNames = await loadBookNames(cacheDir);
  const passages: Passages = await loadPassages(cacheDir, maxAgeDays);

  return {
    bibles,
    bookNames,
    passages,
    updatedSinceLoad: false,
  };
};

// - - - - - - - - - -
/**
 * Saves the cache data to the specified cache directory.
 * @param cache - The cache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export const saveCache = async (
  cache: Cache,
  cacheDir: string = defaultCacheDir
): Promise<void> => {
  if (!cache.updatedSinceLoad) {
    return;
  }

  let savedAll = true;
  try {
    await saveBibles(cache.bibles, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving bibles to cache', error);
  }

  try {
    await saveBookNames(cache.bookNames, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving bookNames to cache', error);
  }

  try {
    await savePassages(cache.passages, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving passages to cache', error);
  }

  if (savedAll) {
    cache.updatedSinceLoad = false;
  }
};

// - - - - - - - - - -
/**
 * Clear cache by resetting all cache properties and setting `updatedSinceLoad` to `true`.
 * @param cache - The cache object to be cleared.
 */
export const clearCache = (cache: Cache): void => {
  cache.bibles = {};
  cache.bookNames = {};
  cache.passages = {};
  cache.updatedSinceLoad = true;
};

// - - - - - - - - - -
/**
 * Checks if any bible in the given list has the specified language.
 * @param language - The ISO 639-3 three digit language code to be checked.
 * @param bibles - The list of bibles to search in.
 * @returns - True if any bible in the list has the specified language, false otherwise.
 */
const biblesHasLanguage = (language: string, bibles: Bibles): boolean => {
  return Object.values(bibles).some(bible => bible.language === language);
};

// - - - - - - - - - -
/**
 * Checks if the given book names have the specified language.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param bookNames - The book names to search through.
 * @returns - True if the book names have the specified language, false otherwise.
 */
const bookNamesHasLanguage = (
  language: string,
  bookNames: BookNames
): boolean => {
  for (const bookReferences of Object.values(bookNames)) {
    for (const bookReference of bookReferences) {
      if (bookReference.language === language) {
        return true;
      }
    }
  }
  return false;
};

// - - - - - - - - - -
/**
 * Checks if the given language is available in the cache.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param cache - The cache object.
 * @returns - A boolean indicating if the language is available in the cache.
 */
const cacheHasLanguage = (language: string, cache: Cache): boolean => {
  if (!biblesHasLanguage(language, cache.bibles)) {
    return false;
  }

  return bookNamesHasLanguage(language, cache.bookNames);
};

// - - - - - - - - - -
/**
 * Updates the cache with new data for specified languages.
 * @async
 * @param languages - The list of ISO 639-3 three digit language codes to update in the cache.
 * @param cache - The cache object to update.
 * @param [forceUpdate] - Flag indicating whether to force the update for all languages.
 * @param [biblesToExclude] - The list of bibles to exclude from the update.
 * @param [config] - Additional configuration options for the update request.
 * @returns - A promise that resolves when the cache is updated.
 */
export const updateCache = async (
  languages: string[],
  cache: Cache,
  forceUpdate = false,
  biblesToExclude: string[] = [],
  config: AxiosRequestConfig = {}
) => {
  let languagesToUpdate = languages;
  if (!forceUpdate) {
    languagesToUpdate = languages.filter(
      language => !cacheHasLanguage(language, cache)
    );
  }

  if (languagesToUpdate.length !== 0) {
    const timestamp = new Date();
    await updateBibles(
      languagesToUpdate,
      cache,
      biblesToExclude,
      config,
      timestamp
    );

    await updateBookNames(languagesToUpdate, cache, config, timestamp);
  }
};

/**
 * Loads cache, updates and then saves it.
 * @async
 * @param languages - The list of ISO 639-3 three digit language codes to update in the cache.
 * @param [forceUpdate] - Flag indicating whether to force the update for all languages.
 * @param [biblesToExclude] - The list of bibles to exclude from the update.
 * @param [config] - Additional configuration options for the update request.
 * @param [cacheDir] - The cache directory to load from.
 * @returns - A promise that resolves when the cache is loaded, updated, and saved successfully.
 */
export const loadUpdateSaveCache = async (
  languages: string[],
  forceUpdate = false,
  biblesToExclude: string[] = [],
  config: AxiosRequestConfig = {},
  cacheDir: string = defaultCacheDir
): Promise<void> => {
  const cache = await loadCache(cacheDir);
  await updateCache(languages, cache, forceUpdate, biblesToExclude, config);
  await saveCache(cache, cacheDir);
};

// - - - - - - - - - -
// const cache = await loadCache();
// await updateCache(['arb'], cache);
// await saveCache(cache);
// console.log(JSON.stringify(cache, null, 2));
