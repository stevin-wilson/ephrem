import {
  Bibles,
  BiblesCache,
  BookNames,
  loadCacheOptions,
} from './cache-types.js';
import {cleanBibles, loadBibles, saveBibles} from './cache-bibles.js';
import {
  cleanBookNamesCache,
  loadBookNames,
  saveBookNames,
} from './cache-book-names.js';
import {getDefaultCacheDir, getDefaultMaxCacheAgeDays} from './cache-utils.js';

export const loadBiblesCache = async (
  options: loadCacheOptions = {}
): Promise<BiblesCache> => {
  const {
    cacheDir = getDefaultCacheDir(),
    maxCacheAgeDays = getDefaultMaxCacheAgeDays(),
    timestamp = new Date(),
  } = options;

  let bibles: Bibles = await loadBibles(cacheDir);
  let bookNames: BookNames = await loadBookNames(cacheDir);
  let updatedBiblesSinceLoad = false;
  let updatedBookNamesSinceLoad = false;

  if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
    [bibles, updatedBiblesSinceLoad] = cleanBibles(
      bibles,
      timestamp,
      maxCacheAgeDays
    );

    [bookNames, updatedBookNamesSinceLoad] = cleanBookNamesCache(
      bookNames,
      timestamp,
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
  cacheDir: string = getDefaultCacheDir()
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
