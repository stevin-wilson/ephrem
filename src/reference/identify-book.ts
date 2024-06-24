import {loadBiblesCache} from '../cache/cache-use-bibles.js';
import {
  getDefaultUseMajorityFallback,
  getKeyOfMaxValue,
} from './reference-utils.js';
import {
  BookNotFoundError,
  GetBookIdOptions,
  VoteTally,
} from './reference-types.js';
import {BOOK_IDs} from './book-ids.js';
import {normalizeBookName} from '../utils.js';
import {
  needsBiblesCacheUpdate,
  updateBiblesCache,
} from '../cache/cache-update-bibles.js';
import {BiblesCache} from '../cache/cache-types.js';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultLanguages,
  getDefaultMaxRetries,
} from '../api-bible/api-utils.js';
import {getDefaultBiblesToExclude} from '../cache/cache-utils.js';

export const getBookID = async (
  options: GetBookIdOptions
): Promise<keyof typeof BOOK_IDs> => {
  const {
    bookName,
    bibleAbbreviation,
    useMajorityFallback = getDefaultUseMajorityFallback(),
    forceUpdateBiblesCache = false,
    biblesCache = await loadBiblesCache(),
    languages = getDefaultLanguages(),
    biblesToExclude = getDefaultBiblesToExclude(),
    timestamp = new Date(),
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
  } = options;

  const normalizedBookName = normalizeBookName(bookName);

  const haveToUseMajorityFallback = useMajorityFallback || !bibleAbbreviation;

  const needToUpdateCache = needsBiblesCacheUpdate(
    biblesCache,
    bibleAbbreviation,
    languages
  );

  if (needToUpdateCache || forceUpdateBiblesCache) {
    await updateBiblesCache({
      biblesCache,
      languages,
      biblesToExclude,
      config,
      forceUpdateBiblesCache,
      timestamp,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });
  }

  const bookReferences = biblesCache.bookNames[normalizedBookName];
  if (!bookReferences) {
    throw new BookNotFoundError(bookName, options);
  }

  let bookID: string | undefined = undefined;

  if (bibleAbbreviation) {
    bookID = await getBookIdInBible(
      normalizedBookName,
      bibleAbbreviation,
      biblesCache
    );
  }

  if (!bookID && haveToUseMajorityFallback) {
    bookID = await getBookIdByMajority(
      normalizedBookName,
      biblesCache,
      languages
    );
  }

  if (bookID === undefined || !(bookID in BOOK_IDs)) {
    throw new BookNotFoundError(bookName, options);
  }

  return bookID as keyof typeof BOOK_IDs;
};

const getBookIdInBible = async (
  bookName: string,
  bibleAbbreviation: string,
  biblesCache: BiblesCache
): Promise<string | undefined> => {
  try {
    const bookReferences = biblesCache.bookNames[bookName];
    if (!bookReferences) {
      return undefined;
    }

    // Iterate over bookReferences to find a match with bibleAbbreviation
    for (const bookReference of bookReferences) {
      if (bookReference.bibles.includes(bibleAbbreviation)) {
        return bookReference.id;
      }
    }

    return undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getBookIdByMajority = async (
  bookName: string,
  biblesCache: BiblesCache,
  languages: string[]
): Promise<string | undefined> => {
  try {
    const bookReferences = biblesCache.bookNames[bookName];
    if (!bookReferences) {
      return undefined;
    }

    const voteTally: VoteTally = {};
    for (const bookReference of bookReferences) {
      // Skip if languages is defined and does not include the bookReference language
      if (languages.length > 0 && !languages.includes(bookReference.language)) {
        continue;
      }
      const bookID = bookReference.id;
      if (!voteTally[bookID]) {
        voteTally[bookID] = 0;
      }
      voteTally[bookID] += bookReference.bibles.length;
    }
    return getKeyOfMaxValue(voteTally);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
