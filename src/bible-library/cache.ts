// - - - - - - - - - -
import {Bibles, BookNames, Cache, Passages} from '../types.js';
import {loadBibles, saveBibles, updateBibles} from './bibles.js';
import {loadBookNames, saveBookNames, updateBookNames} from './book-names.js';
import {defaultCacheDir} from '../utils.js';
import {loadPassages, savePassages} from './passages.js';
import {AxiosRequestConfig} from 'axios';

// - - - - - - - - - -
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
export const clearCache = (cache: Cache): void => {
  cache.bibles = {};
  cache.bookNames = {};
  cache.passages = {};
  cache.updatedSinceLoad = true;
};

// - - - - - - - - - -
const biblesHasLanguage = (language: string, bibles: Bibles): boolean => {
  return Object.values(bibles).some(bible => bible.language === language);
};

// - - - - - - - - - -
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
const cacheHasLanguage = (language: string, cache: Cache): boolean => {
  if (!biblesHasLanguage(language, cache.bibles)) {
    return false;
  }

  return bookNamesHasLanguage(language, cache.bookNames);
};

// - - - - - - - - - -
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

// - - - - - - - - - -
const cache = await loadCache();
await updateCache(['arb'], cache);
await saveCache(cache);
console.log(JSON.stringify(cache, null, 2));
