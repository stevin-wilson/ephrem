import {
  Bible,
  BiblesCache,
  BookIdWithLanguage,
  BookNameDetails,
  BookNameReference,
  UpdateBiblesCacheOptions,
  UpdateBiblesOptions,
  UpdateBookNamesOptions,
} from './cache-types.js';
import {
  CONFIG,
  DELAY_BETWEEN_CALLS_MS,
  INITIAL_BACKOFF_MS,
  LANGUAGES,
  MAX_RETRIES,
} from '../api-bible/api-utils.js';
import {BIBLES_TO_EXCLUDE} from './cache-utils.js';
import {BibleResponse} from '../api-bible/api-types.js';
import {normalizeLanguage} from '../utils.js';
import {fetchBibles} from '../api-bible/api-bibles.js';
import {prepareBibleData} from './cache-bibles.js';
import {languageInBiblesCache, loadBiblesCache} from './cache-use-bibles.js';
import {fetchBooks} from '../api-bible/api-book-names.js';
import {prepareBookNames} from './cache-book-names.js';

export const needsBiblesCacheUpdate = (
  biblesCache: BiblesCache,
  bibleAbbreviation?: string,
  languages: string[] = LANGUAGES
): boolean => {
  let needToUpdateCache = false;
  if (bibleAbbreviation && !(bibleAbbreviation in biblesCache.bibles)) {
    needToUpdateCache = true;
  }

  const languagesToUpdate = languages.filter(
    language => !languageInBiblesCache(normalizeLanguage(language), biblesCache)
  );

  if (languagesToUpdate.length > 0) {
    needToUpdateCache = true;
  }

  return needToUpdateCache;
};

export const updateBibles = async (
  options: UpdateBiblesOptions
): Promise<void> => {
  const {
    biblesCache = await loadBiblesCache(),
    languages = LANGUAGES,
    biblesToExclude = BIBLES_TO_EXCLUDE,
    timestamp = new Date(),
    config = CONFIG,
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = DELAY_BETWEEN_CALLS_MS,
  } = options;

  let bibleResponses: BibleResponse[] = [];

  if (languages) {
    for (const language of languages) {
      const normalizedLanguage = normalizeLanguage(language);
      bibleResponses = [
        ...bibleResponses,
        ...(await fetchBibles({
          language: normalizedLanguage,
          config,
          retries,
          initialBackoff,
          delayBetweenCalls,
        })),
      ];
    }
  } else {
    bibleResponses = await fetchBibles({
      language: undefined,
      config,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });
  }

  bibleResponses
    .filter(
      bibleResponse => !biblesToExclude.includes(bibleResponse.abbreviation)
    )
    .forEach(bibleResponse => {
      Object.assign(
        biblesCache.bibles,
        prepareBibleData(bibleResponse, timestamp)
      );
    });
  biblesCache.updatedSinceLoad = true;
};

const bookNameDetailsMatchReference = (
  bookIdWithLanguage: BookIdWithLanguage,
  bookNameReference: BookNameReference
): boolean => {
  return (
    bookIdWithLanguage.id === bookNameReference.id &&
    bookIdWithLanguage.language === bookNameReference.language &&
    bookIdWithLanguage.isAbbreviation === bookNameReference.isAbbreviation
  );
};

const getUpdatedBookReferences = (
  bookReferences: BookNameReference[],
  thisBookIdWithLanguage: BookIdWithLanguage,
  bibleAbbreviation: string,
  timestamp: Date
): BookNameReference[] => {
  if (bookReferences === undefined || bookReferences.length === 0) {
    return [
      {
        ...thisBookIdWithLanguage,
        bibles: [bibleAbbreviation],
        cachedOn: timestamp,
      },
    ];
  } else {
    const matched = bookReferences.some(bookReference => {
      const referenceMatches = bookNameDetailsMatchReference(
        thisBookIdWithLanguage,
        bookReference
      );
      if (
        referenceMatches ||
        bookReference.bibles.includes(bibleAbbreviation)
      ) {
        if (referenceMatches) bookReference.bibles.push(bibleAbbreviation);
        return true;
      }
      return false;
    });

    if (!matched) {
      bookReferences.push({
        ...thisBookIdWithLanguage,
        bibles: [bibleAbbreviation],
        cachedOn: timestamp,
      });
    }
    return bookReferences;
  }
};

const handleBookReferences = async (
  bibleAbbreviation: string,
  bible: Bible,
  bookNamesFromBible: BookNameDetails[],
  biblesCache: BiblesCache,
  timestamp: Date
): Promise<void> => {
  for (const bookNameDetails of bookNamesFromBible) {
    const bookReferences = biblesCache.bookNames[bookNameDetails.name];
    const thisBookIdWithLanguage: BookIdWithLanguage = {
      id: bookNameDetails.id,
      language: bible.language,
      isAbbreviation: bookNameDetails.isAbbreviation,
    };
    biblesCache.bookNames[bookNameDetails.name] = getUpdatedBookReferences(
      bookReferences,
      thisBookIdWithLanguage,
      bibleAbbreviation,
      timestamp
    );
  }
};

export const updateBookNames = async (
  options: UpdateBookNamesOptions
): Promise<void> => {
  const {
    biblesCache = (await loadBiblesCache()) as BiblesCache,
    languages = LANGUAGES,
    timestamp = new Date(),
    config = CONFIG,
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = DELAY_BETWEEN_CALLS_MS,
  } = options;

  // Create an array of promises to be resolved concurrently
  const updatePromises = Object.entries(biblesCache.bibles)
    .filter(([, bible]) => languages.includes(bible.language))
    .map(async ([bibleAbbreviation, bible]) => {
      const bookResponses = await fetchBooks({
        bibleID: bible.id,
        config,
        retries,
        initialBackoff,
        delayBetweenCalls,
      });
      const bookNamesFromBible = prepareBookNames(bookResponses);
      await handleBookReferences(
        bibleAbbreviation,
        bible,
        bookNamesFromBible,
        biblesCache,
        timestamp
      );
    });
  await Promise.all(updatePromises);
  biblesCache.updatedSinceLoad = true;
};

export const updateBiblesCache = async (options: UpdateBiblesCacheOptions) => {
  const {
    forceUpdateBiblesCache = false,
    biblesCache = await loadBiblesCache(),
    languages = LANGUAGES,
    biblesToExclude = BIBLES_TO_EXCLUDE,
    timestamp = new Date(),
    config = CONFIG,
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = DELAY_BETWEEN_CALLS_MS,
  } = options;

  let languagesToUpdate = languages;
  if (!forceUpdateBiblesCache) {
    languagesToUpdate = languages.filter(
      language => !languageInBiblesCache(language, biblesCache)
    );
  }

  if (languagesToUpdate.length !== 0) {
    await updateBibles({
      biblesCache,
      languages: languagesToUpdate,
      biblesToExclude,
      timestamp,
      config,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });

    await updateBookNames({
      biblesCache,
      languages: languagesToUpdate,
      timestamp,
      config,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });

    biblesCache.updatedSinceLoad = true;
  }
};
