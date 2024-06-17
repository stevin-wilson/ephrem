import {
  defaultBibles,
  defaultBiblesToExclude,
  defaultLanguages,
  defaultPassageOptions,
} from './utils.js';
import {
  BiblesCache,
  PassageAndFumsResponse,
  PassageMap,
  PassageOptions,
  PassagesCache,
  ReferenceMap,
} from './types.js';
import {AxiosRequestConfig} from 'axios';
import {
  getReferenceMap,
  parseReference,
  parseReferenceGroup,
} from './parser.js';
import {getPassageID} from './reference.js';
import {
  getPassage,
  loadPassagesCache,
  savePassagesCache,
} from './bible-library/passages.js';
import {defaultConfig} from './bible-library/api-bible.js';
import {loadBiblesCache, saveBiblesCache} from './bible-library/bibles.js';

export const getSinglePassage = async (
  input: string,
  fallbackBibles: string[] = defaultBibles,
  biblesCache?: BiblesCache,
  passagesCache?: PassagesCache,
  passageOptions: PassageOptions = defaultPassageOptions,
  languages: string[] = defaultLanguages,
  useMajorityFallback = true,
  forceUpdateCache = false,
  config: AxiosRequestConfig = defaultConfig,
  forceApiCall = false,
  biblesToExclude: string[] = defaultBiblesToExclude
): Promise<PassageAndFumsResponse[]> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  if (passagesCache === undefined) {
    passagesCache = await loadPassagesCache();
  }

  const referenceGroup = parseReferenceGroup(input, fallbackBibles);
  const references = await parseReference(
    referenceGroup,
    biblesCache,
    languages,
    useMajorityFallback,
    forceUpdateCache,
    biblesToExclude,
    config
  );

  const passages: PassageAndFumsResponse[] = await Promise.all(
    references.map(async reference =>
      getPassage(
        getPassageID(reference),
        reference.bible,
        passagesCache,
        biblesCache,
        config,
        passageOptions,
        languages,
        biblesToExclude,
        forceApiCall
      )
    )
  );

  await saveBiblesCache(biblesCache);
  await savePassagesCache(passagesCache);

  return passages;
};

// - - - - - - - - -
export const getMultiplePassages = async (
  input: string,
  biblesCache?: BiblesCache,
  passagesCache?: PassagesCache,
  delimiter = ';',
  fallbackBibles: string[] = defaultBibles,
  languages: string[] = defaultLanguages,
  passageOptions: PassageOptions = defaultPassageOptions,
  useMajorityFallback = true,
  forceUpdateBiblesCache = false,
  forcePassageApiCall = false,
  biblesToExclude: string[] = defaultBiblesToExclude,
  config: AxiosRequestConfig = defaultConfig
): Promise<PassageMap> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  if (passagesCache === undefined) {
    passagesCache = await loadPassagesCache();
  }

  const referenceMap: ReferenceMap = await getReferenceMap(
    input,
    biblesCache,
    delimiter,
    fallbackBibles,
    languages,
    useMajorityFallback,
    forceUpdateBiblesCache,
    biblesToExclude,
    config
  );

  const passageMap: PassageMap = new Map();
  for (const [referenceGroupString, references] of referenceMap) {
    const passages: PassageAndFumsResponse[] = await Promise.all(
      references.map(async reference =>
        getPassage(
          getPassageID(reference),
          reference.bible,
          passagesCache,
          biblesCache,
          config,
          passageOptions,
          languages,
          biblesToExclude,
          forcePassageApiCall
        )
      )
    );

    passageMap.set(referenceGroupString, passages);
  }

  await saveBiblesCache(biblesCache);
  await savePassagesCache(passagesCache);

  return passageMap;
};
