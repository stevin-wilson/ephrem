import {
  Passage,
  PassageQuery,
  PassagesCache,
  PreparePassageOptions,
} from './cache-types.js';
import {PassageAndFumsResponse} from '../api-bible/api-types.js';
import {getPassageAndBible, loadPassagesCache} from './cache-use-passages.js';
import {loadBiblesCache} from './cache-use-bibles.js';
import {
  getBibleID,
  needsBiblesCacheUpdate,
  updateBiblesCache,
} from './cache-update-bibles.js';
import {fetchPassage} from '../api-bible/api-passages.js';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultLanguages,
  getDefaultMaxRetries,
  getDefaultPassageOptions,
} from '../api-bible/api-utils.js';
import {getDefaultBiblesToExclude} from './cache-utils.js';

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
export const preparePassage = async (
  options: PreparePassageOptions
): Promise<PassageAndFumsResponse> => {
  const {
    passageID,
    bibleAbbreviation,
    passagesCache = await loadPassagesCache(),
    biblesCache = await loadBiblesCache(),
    config = getDefaultApiConfig(),
    passageOptions = getDefaultPassageOptions(),
    languages = getDefaultLanguages(),
    biblesToExclude = getDefaultBiblesToExclude(),
    forceUpdateBiblesCache = false,
    forcePassageApiCall = false,
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
    timestamp = new Date(),
  } = options;

  const getPassageFromCache = (
    passagesCache: PassagesCache,
    forcePassageApiCall: boolean,
    passageAndBible: string,
    passageQuery: PassageQuery
  ) => {
    if (!forcePassageApiCall) {
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
    return null;
  };

  if (
    forceUpdateBiblesCache ||
    needsBiblesCacheUpdate(biblesCache, bibleAbbreviation, languages)
  ) {
    await updateBiblesCache({
      biblesCache,
      languages,
      biblesToExclude,
      config,
      forceUpdateBiblesCache,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });
  }

  const bibleID = await getBibleID({
    bibleAbbreviation,
    biblesCache,
    forceUpdateBiblesCache,
    languages,
    biblesToExclude,
    timestamp,
    delayBetweenCalls,
    config,
    retries,
    initialBackoff,
  });

  const passageQuery: PassageQuery = {
    passageID,
    bibleID,
    ...passageOptions,
  };

  const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);

  const passageFromCache = getPassageFromCache(
    passagesCache,
    forcePassageApiCall,
    passageAndBible,
    passageQuery
  );
  if (passageFromCache !== null) return passageFromCache;

  const passageAndFums = await fetchPassage({
    passageID,
    bibleID,
    passageOptions,
    config,
    retries,
    initialBackoff,
    delayBetweenCalls,
  });

  const passage: Passage = {
    query: passageQuery,
    response: passageAndFums,
    cachedOn: new Date(),
  };

  if (!(passageAndBible in passagesCache.passages)) {
    passagesCache.passages[passageAndBible] = [];
  }
  passagesCache.passages[passageAndBible].push(passage);
  passagesCache.updatedSinceLoad = true;

  return passageAndFums;
};
