import {expandHomeDir} from '../utils.js';
import {
  DEFAULT_BIBLES,
  DEFAULT_BIBLES_TO_EXCLUDE,
  DEFAULT_CACHE_DIR,
  DEFAULT_MAX_CACHE_AGE_DAYS,
} from './cache-constants.js';

export const CACHE_DIR: string = expandHomeDir(
  process.env.CACHE_PATH || DEFAULT_CACHE_DIR
);

export const BIBLES_TO_EXCLUDE = process.env.EPHREM_BIBLES_TO_EXCLUDE
  ? process.env.EPHREM_BIBLES_TO_EXCLUDE.split(',').map(s => s.trim())
  : DEFAULT_BIBLES_TO_EXCLUDE;

export const BIBLES = process.env.EPHREM_DEFAULT_BIBLES
  ? process.env.EPHREM_DEFAULT_BIBLES.split(',').map(s => s.trim())
  : DEFAULT_BIBLES;

export const MAX_CACHE_AGE_DAYS: number | undefined =
  process.env.EPHREM_MAX_CACHE_AGE_DAYS &&
  !isNaN(parseFloat(process.env.EPHREM_MAX_CACHE_AGE_DAYS))
    ? parseFloat(process.env.EPHREM_MAX_CACHE_AGE_DAYS)
    : DEFAULT_MAX_CACHE_AGE_DAYS;
