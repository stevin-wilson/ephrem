import {BiblesCache, VoteTally} from './types.js';
import {
  needsBiblesCacheUpdate,
  updateBiblesCache,
} from './bible-library/cache.js';
import {AxiosRequestConfig} from 'axios';

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

const getBookID = async (
  bookName: string,
  bibleAbbreviation: string | undefined,
  languages: string[],
  cache: BiblesCache,
  useMajorityFallback = true,
  forceUpdateCache = false,
  biblesToExclude: string[] = [],
  config: AxiosRequestConfig = {}
): Promise<string | undefined> => {
  useMajorityFallback ||= !bibleAbbreviation;

  const needToUpdateCache = needsBiblesCacheUpdate(
    bibleAbbreviation,
    languages,
    cache
  );

  if (needToUpdateCache || forceUpdateCache) {
    await updateBiblesCache(
      languages,
      cache,
      forceUpdateCache,
      biblesToExclude,
      config
    );
  }

  const bookReferences = cache.bookNames[bookName];
  if (!bookReferences) {
    return undefined;
  }

  let bookID: string | undefined = undefined;

  if (bibleAbbreviation) {
    bookID = getBookIdInBible(bookName, bibleAbbreviation, cache);
  }

  if (!bookID && useMajorityFallback) {
    bookID = getBookIdByMajority(bookName, languages, cache);
  }

  return bookID;
};

const getBookIdInBible = (
  bookName: string,
  bibleAbbreviation: string,
  cache: BiblesCache
): string | undefined => {
  const bookReferences = cache.bookNames[bookName];
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

const getBookIdByMajority = (
  bookName: string,
  languages: string[] | undefined,
  cache: BiblesCache
): string | undefined => {
  const bookReferences = cache.bookNames[bookName];
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
