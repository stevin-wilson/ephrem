import {CACHE_DIR, MAX_CACHE_AGE_DAYS} from './cache-utils.js';
import {Bibles, BiblesCache, BookNames} from './cache-types.js';
import {cleanBibles, loadBibles, saveBibles} from './cache-bibles.js';
import {
  cleanBookNamesCache,
  loadBookNames,
  saveBookNames,
} from './cache-book-names.js';

export const loadBiblesCache = async (
  cacheDir: string = CACHE_DIR,
  maxCacheAgeDays: number | undefined = MAX_CACHE_AGE_DAYS,
  currentTimestamp = new Date()
): Promise<BiblesCache> => {
  let bibles: Bibles = await loadBibles(cacheDir);
  let bookNames: BookNames = await loadBookNames(cacheDir);
  let updatedBiblesSinceLoad = false;
  let updatedBookNamesSinceLoad = false;

  if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
    [bibles, updatedBiblesSinceLoad] = cleanBibles(
      bibles,
      currentTimestamp,
      maxCacheAgeDays
    );

    [bookNames, updatedBookNamesSinceLoad] = cleanBookNamesCache(
      bookNames,
      currentTimestamp,
      maxCacheAgeDays
    );
  }

  const updatedSinceLoad = updatedBiblesSinceLoad || updatedBookNamesSinceLoad;

  return {
    bibles,
    bookNames,
    updatedSinceLoad,
  };
};

export const saveBiblesCache = async (
  biblesCache: BiblesCache,
  cacheDir: string = CACHE_DIR
): Promise<void> => {
  if (!biblesCache.updatedSinceLoad) {
    return;
  }

  let savedAll = true;
  try {
    await saveBibles(biblesCache.bibles, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving bibles to biblesCache', error);
  }

  try {
    await saveBookNames(biblesCache.bookNames, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving bookNames to biblesCache', error);
  }

  if (savedAll) {
    biblesCache.updatedSinceLoad = false;
  }
};

const languageInBibles = (language: string, bibles: Bibles): boolean => {
  return Object.values(bibles).some(bible => bible.language === language);
};

const languageInBookNames = (
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

export const languageInBiblesCache = (
  language: string,
  biblesCache: BiblesCache
): boolean => {
  if (!languageInBibles(language, biblesCache.bibles)) {
    return false;
  }

  return languageInBookNames(language, biblesCache.bookNames);
};
