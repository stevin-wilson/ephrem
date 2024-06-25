import {loadCacheOptions, Passages, PassagesCache} from './cache-types.js';
import {
  cleanPassagesCache,
  loadPassages,
  savePassages,
} from './cache-passages.js';
import {getDefaultCacheDir, getDefaultMaxCacheAgeDays} from './cache-utils.js';

export const getPassageAndBible = (
  passageID: string,
  bibleAbbreviation: string
) => `${passageID}@${bibleAbbreviation}`;

export const loadPassagesCache = async (
  options: loadCacheOptions = {}
): Promise<PassagesCache> => {
  const {
    cacheDir = getDefaultCacheDir(),
    maxCacheAgeDays = getDefaultMaxCacheAgeDays(),
    timestamp = new Date(),
  } = options;

  let passages: Passages = await loadPassages(cacheDir);
  let updatedSinceLoad = false;

  if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
    [passages, updatedSinceLoad] = cleanPassagesCache(
      passages,
      timestamp,
      maxCacheAgeDays
    );
  }

  return {
    passages,
    updatedSinceLoad,
  };
};

export const savePassagesCache = async (
  passagesCache: PassagesCache,
  cacheDir: string = getDefaultCacheDir()
): Promise<void> => {
  if (!passagesCache.updatedSinceLoad) {
    return;
  }

  try {
    await savePassages(passagesCache.passages, cacheDir);
    passagesCache.updatedSinceLoad = false;
  } catch (error) {
    console.error('Error saving passages to passagesCache', error);
  }
};
