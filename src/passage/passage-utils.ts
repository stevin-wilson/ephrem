import {loadBiblesCache} from '../cache/cache-use-bibles.js';
import {BibleNotAvailableError, GetBibleIdOptions} from './passage-types.js';
import {updateBiblesCache} from '../cache/cache-update-bibles.js';
import {
  CONFIG,
  DELAY_BETWEEN_CALLS_MS,
  INITIAL_BACKOFF_MS,
  LANGUAGES,
  MAX_RETRIES,
} from '../api-bible/api-utils.js';
import {BIBLES_TO_EXCLUDE} from '../cache/cache-utils.js';

const getBibleID = async (options: GetBibleIdOptions): Promise<string> => {
  const {
    bibleAbbreviation,
    biblesCache = await loadBiblesCache(),
    forceUpdateBiblesCache = false,
    languages = LANGUAGES,
    biblesToExclude = BIBLES_TO_EXCLUDE,
    timestamp = new Date(),
    config = CONFIG,
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = DELAY_BETWEEN_CALLS_MS,
  } = options;

  const bibleId = biblesCache.bibles[bibleAbbreviation]?.id;
  if (!bibleId) {
    await updateBiblesCache({
      forceUpdateBiblesCache,
      biblesCache,
      languages,
      biblesToExclude,
      timestamp,
      config,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });
  }

  if (!bibleId) {
    throw new BibleNotAvailableError(options);
  }
  return bibleId;
};
