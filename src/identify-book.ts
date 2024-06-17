import {BiblesCache, VoteTally} from './types.js';
import {AxiosRequestConfig} from 'axios';
import {
  defaultBiblesToExclude,
  defaultLanguages,
  normalizeBookName,
  removePeriod,
} from './utils.js';
import {books} from './books.js';
import {defaultConfig} from './bible-library/api-bible.js';
import {
  loadBiblesCache,
  needsBiblesCacheUpdate,
  updateBiblesCache,
} from './bible-library/bibles.js';

/**
 * Finds the key with the maximum value in the given voteTally object.
 * @param voteTally - The vote tally object.
 * @returns - The key with the maximum value, or undefined if voteTally is empty.
 */
const getKeyOfMaxValue = (voteTally: VoteTally): string | undefined => {
  let maxKey: string | undefined;
  let maxValue = -Infinity;

  // Iterate over each key-value pair in the voteTally object
  Object.entries(voteTally).forEach(([key, value]) => {
    if (value > maxValue) {
      maxValue = value;
      maxKey = key;
    }
  });

  return maxKey;
};

export const getBookID = async (
  bookName: string,
  biblesCache?: BiblesCache,
  bibleAbbreviation?: string,
  languages: string[] = defaultLanguages,
  useMajorityFallback = true,
  forceUpdateCache = false,
  biblesToExclude: string[] = defaultBiblesToExclude,
  config: AxiosRequestConfig = defaultConfig
): Promise<keyof typeof books | undefined> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  const normalizedBookName = normalizeBookName(bookName);

  useMajorityFallback ||= !bibleAbbreviation;

  const needToUpdateCache = needsBiblesCacheUpdate(
    biblesCache,
    bibleAbbreviation,
    languages
  );

  if (needToUpdateCache || forceUpdateCache) {
    await updateBiblesCache(
      biblesCache,
      languages,
      biblesToExclude,
      config,
      forceUpdateCache
    );
  }

  const bookReferences = biblesCache.bookNames[normalizedBookName];
  if (!bookReferences) {
    return undefined;
  }

  let bookID: string | undefined = undefined;

  if (bibleAbbreviation) {
    bookID = await getBookIdInBible(
      normalizedBookName,
      bibleAbbreviation,
      biblesCache
    );
  }

  if (!bookID && useMajorityFallback) {
    bookID = await getBookIdByMajority(
      normalizedBookName,
      biblesCache,
      languages
    );
  }

  if (bookID !== undefined && !(bookID in books)) {
    bookID = undefined;
  }

  return bookID as keyof typeof books | undefined;
};

const getBookIdInBible = async (
  bookName: string,
  bibleAbbreviation: string,
  biblesCache?: BiblesCache
): Promise<string | undefined> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  const bookReferences = biblesCache.bookNames[bookName];
  if (!bookReferences) {
    return undefined;
  }

  if (bibleAbbreviation) {
    for (const bookReference of bookReferences) {
      if (bookReference.bibles.includes(bibleAbbreviation)) {
        return bookReference.id;
      }
    }
  }

  return undefined;
};

const getBookIdByMajority = async (
  bookName: string,
  biblesCache?: BiblesCache,
  languages?: string[]
): Promise<string | undefined> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  const bookReferences = biblesCache.bookNames[bookName];
  if (!bookReferences) {
    return undefined;
  }

  const voteTally: VoteTally = {};
  for (const bookReference of bookReferences) {
    if (
      languages &&
      languages.length > 0 &&
      !languages.includes(bookReference.language)
    ) {
      continue;
    }
    const bookID = bookReference.id;
    if (!voteTally[bookID]) {
      voteTally[bookID] = 0;
    }
    voteTally[bookID] += bookReference.bibles.length;
  }
  return getKeyOfMaxValue(voteTally);
};
