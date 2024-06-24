import {config, expandHomeDir} from '../utils.js';
import {
  DEFAULT_BIBLES,
  DEFAULT_BIBLES_TO_EXCLUDE,
  DEFAULT_CACHE_DIR,
  DEFAULT_MAX_CACHE_AGE_DAYS,
} from './cache-constants.js';

// - - - - - - - - - -
export const setDefaultCacheDir = (cacheDir: string) => {
  const processedCacheDir = cacheDir.toString().trim();

  if (processedCacheDir.length > 0) {
    config.set('CACHE_DIR', expandHomeDir(processedCacheDir));
  }
};

export const getDefaultCacheDir = (): string => {
  const cacheDir = config.get('CACHE_DIR');

  if (cacheDir && typeof cacheDir === 'string') {
    return expandHomeDir(cacheDir);
  } else {
    return expandHomeDir(DEFAULT_CACHE_DIR);
  }
};

// - - - - - - - - - -
export const setDefaultBiblesToExclude = (bibles: string[]) => {
  const processedBiblesToExclude = bibles
    .map(s => s.toString().trim())
    .filter(s => s !== '');

  if (processedBiblesToExclude.length > 0) {
    config.set('BIBLES_TO_EXCLUDE', processedBiblesToExclude);
  }
};

export const getDefaultBiblesToExclude = (): string[] => {
  const biblesToExclude = config.get('BIBLES_TO_EXCLUDE');

  let processedBiblesToExclude: string[] = [];
  if (Array.isArray(biblesToExclude)) {
    processedBiblesToExclude = biblesToExclude
      .map(s => s.toString().trim())
      .filter(s => s !== '');
  }

  if (processedBiblesToExclude.length > 0) {
    return processedBiblesToExclude;
  } else {
    return DEFAULT_BIBLES_TO_EXCLUDE;
  }
};

// - - - - - - - - - -
export const setDefaultBibles = (bibles: string[]) => {
  const processedBibles = bibles
    .map(s => s.toString().trim())
    .filter(s => s !== '');

  if (processedBibles.length > 0) {
    config.set('BIBLES', processedBibles);
  }
};

export const getDefaultBibles = (): string[] => {
  const bibles = config.get('BIBLES');

  let processedBibles: string[] = [];
  if (Array.isArray(bibles)) {
    processedBibles = bibles
      .map(s => s.toString().trim())
      .filter(s => s !== '');
  }

  if (processedBibles.length > 0) {
    return processedBibles;
  } else {
    return DEFAULT_BIBLES;
  }
};

// - - - - - - - - - -
export const setDefaultMaxCacheAgeDays = (maxCacheAgeDays: number) => {
  const processedMaxCacheAgeDays =
    maxCacheAgeDays < 0 ? DEFAULT_MAX_CACHE_AGE_DAYS : maxCacheAgeDays;

  config.set('MAX_CACHE_AGE_DAYS', processedMaxCacheAgeDays);
};

export const getDefaultMaxCacheAgeDays = (): number => {
  const maxCacheAgeDays = config.get('MAX_CACHE_AGE_DAYS');
  return !isNaN(Number(maxCacheAgeDays))
    ? Number(maxCacheAgeDays)
    : DEFAULT_MAX_CACHE_AGE_DAYS;
};
