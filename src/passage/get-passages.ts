import {
  GetPassagesError,
  GetPassagesOptions,
  PassagesOutput,
} from './passage-types.js';

import {
  getDefaultUseMajorityFallback,
  getPassageID,
} from '../reference/reference-utils.js';
import {loadBiblesCache, saveBiblesCache} from '../cache/cache-use-bibles.js';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultLanguages,
  getDefaultMaxRetries,
  getDefaultPassageOptions,
} from '../api-bible/api-utils.js';
import {
  loadPassagesCache,
  savePassagesCache,
} from '../cache/cache-use-passages.js';
import {parseReferences} from '../reference/simple-parser.js';
import {References} from '../reference/reference-types.js';
import {preparePassage} from '../cache/cache-update-passages.js';
import {
  getDefaultBibles,
  getDefaultBiblesToExclude,
} from '../cache/cache-utils.js';

export const getPassages = async (
  options: GetPassagesOptions
): Promise<PassagesOutput> => {
  const {
    input,
    passageOptions = getDefaultPassageOptions(),
    forcePassageApiCall = false,
    delimiter = ';',
    defaultBibles = getDefaultBibles(),
    useMajorityFallback = getDefaultUseMajorityFallback(),
    forceUpdateBiblesCache = false,
    biblesCache = await loadBiblesCache(),
    passagesCache = await loadPassagesCache(),
    languages = getDefaultLanguages(),
    biblesToExclude = getDefaultBiblesToExclude(),
    timestamp = new Date(),
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
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
