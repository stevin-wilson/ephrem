// - - - - - - - - - -
import axios from 'axios';
import {
  DEFAULT_DELAY_BETWEEN_CALLS_MS,
  DEFAULT_INITIAL_BACKOFF_MS,
  DEFAULT_LANGUAGES,
  DEFAULT_MAX_RETRIES,
  DEFAULT_PASSAGE_OPTIONS,
} from './api-constants.js';
import createError from 'http-errors';
import {removePunctuation} from '../utils.js';
import {PassageOptions} from './api-types.js';

// - - - - - - - - - -
export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// - - - - - - - - - -
export const MAX_RETRIES = !isNaN(Number(process.env.EPHREM_API_MAX_RETRIES))
  ? Number(process.env.EPHREM_API_MAX_RETRIES)
  : DEFAULT_MAX_RETRIES;

export const INITIAL_BACKOFF_MS = !isNaN(
  Number(process.env.EPHREM_API_INITIAL_BACKOFF_MS)
)
  ? Number(process.env.EPHREM_API_INITIAL_BACKOFF_MS)
  : DEFAULT_INITIAL_BACKOFF_MS;

export const DELAY_BETWEEN_CALLS_MS = !isNaN(
  Number(process.env.EPHREM_API_DELAY_BETWEEN_CALLS_MS)
)
  ? Number(process.env.EPHREM_API_DELAY_BETWEEN_CALLS_MS)
  : DEFAULT_DELAY_BETWEEN_CALLS_MS;

export const LANGUAGES = process.env.EPHREM_LANGUAGES
  ? process.env.EPHREM_LANGUAGES.split(',').map(s => s.trim())
  : DEFAULT_LANGUAGES;

export const CONFIG = {
  method: 'GET',
  headers: {'api-key': process.env.API_BIBLE_API_KEY!},
} as const;

export const PASSAGE_OPTIONS: PassageOptions = {
  contentType:
    (process.env.EPHREM_CONTENT_TYPE as 'html' | 'json' | 'text') ||
    DEFAULT_PASSAGE_OPTIONS.contentType,
  includeNotes:
    process.env.EPHREM_INCLUDE_NOTES?.toLowerCase() === 'true' ||
    DEFAULT_PASSAGE_OPTIONS.includeNotes,
  includeTitles:
    process.env.EPHREM_INCLUDE_TITLES?.toLowerCase() === 'true' ||
    DEFAULT_PASSAGE_OPTIONS.includeTitles,
  includeChapterNumbers:
    process.env.EPHREM_INCLUDE_CHAPTER_NUMBERS?.toLowerCase() === 'true' ||
    DEFAULT_PASSAGE_OPTIONS.includeChapterNumbers,
  includeVerseNumbers:
    process.env.EPHREM_INCLUDE_VERSE_NUMBERS?.toLowerCase() === 'true' ||
    DEFAULT_PASSAGE_OPTIONS.includeVerseNumbers,
  includeVerseSpans:
    process.env.EPHREM_INCLUDE_VERSE_SPANS?.toLowerCase() === 'true' ||
    DEFAULT_PASSAGE_OPTIONS.includeVerseSpans,
};

// - - - - - - - - - -
export const retryOn503 = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  initialBackoff = INITIAL_BACKOFF_MS
): Promise<T> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 503 &&
        attempt < retries
      ) {
        await sleep(initialBackoff * Math.pow(2, attempt)); // exponential backoff
        continue;
      }

      // createError helper to create an error with a specific status code
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 503 &&
        attempt === retries
      ) {
        throw createError(
          503,
          'Service is temporarily unavailable. Please try again later.'
        );
      }

      let errorMessage = 'An error occurred while processing your request.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  throw createError(
    503,
    'Service is temporarily unavailable. Maximum number of retries have been exhausted.'
  );
};
