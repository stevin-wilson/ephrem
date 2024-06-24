import {
  GetPassagesError,
  GetPassagesOptions,
  PassagesOutput,
} from './passage-types.js';
import {BIBLES, BIBLES_TO_EXCLUDE} from '../cache/cache-utils.js';
import {
  getPassageID,
  USE_MAJORITY_FALLBACK,
} from '../reference/reference-utils.js';
import {loadBiblesCache, saveBiblesCache} from '../cache/cache-use-bibles.js';
import {
  CONFIG,
  DELAY_BETWEEN_CALLS_MS,
  getDefaultInitialBackoffMs,
  getDefaultMaxRetries,
  INITIAL_BACKOFF_MS,
  LANGUAGES,
  MAX_RETRIES,
  PASSAGE_OPTIONS,
} from '../api-bible/api-utils.js';
import {
  loadPassagesCache,
  savePassagesCache,
} from '../cache/cache-use-passages.js';
import {parseReferences} from '../reference/simple-parser.js';
import {References} from '../reference/reference-types.js';
import {preparePassage} from '../cache/cache-update-passages.js';

export const getPassages = async (
  options: GetPassagesOptions
): Promise<PassagesOutput> => {
  const {
    input,
    passageOptions = PASSAGE_OPTIONS,
    forcePassageApiCall = false,
    delimiter = ';',
    defaultBibles = BIBLES,
    useMajorityFallback = USE_MAJORITY_FALLBACK,
    forceUpdateBiblesCache = false,
    biblesCache = await loadBiblesCache(),
    passagesCache = await loadPassagesCache(),
    languages = LANGUAGES,
    biblesToExclude = BIBLES_TO_EXCLUDE,
    timestamp = new Date(),
    config = CONFIG,
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = DELAY_BETWEEN_CALLS_MS,
  } = options;

  const allReferences: References = await parseReferences({
    input,
    biblesCache,
    delimiter,
    defaultBibles,
    languages,
    useMajorityFallback,
    forceUpdateBiblesCache,
    biblesToExclude,
    config,
    timestamp,
    retries,
    initialBackoff,
    delayBetweenCalls,
  });

  const passageOutput: PassagesOutput = {};
  try {
    for (const [referenceGroupString, references] of Object.entries(
      allReferences
    )) {
      passageOutput[referenceGroupString] = await Promise.all(
        references.map(async reference =>
          preparePassage({
            passageID: getPassageID(reference),
            bibleAbbreviation: reference.bible,
            passagesCache,
            biblesCache,
            config,
            passageOptions,
            languages,
            biblesToExclude,
            forceUpdateBiblesCache,
            forcePassageApiCall,
          })
        )
      );
    }
  } catch (error: any) {
    const errorMessage = error.message ? error.message : undefined;
    throw new GetPassagesError(errorMessage, options);
  }

  await saveBiblesCache(biblesCache);
  await savePassagesCache(passagesCache);

  return passageOutput;
};
