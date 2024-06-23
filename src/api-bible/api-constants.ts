import {PassageOptions} from './api-types.js';

export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_DELAY_BETWEEN_CALLS_MS = 1000;
export const DEFAULT_INITIAL_BACKOFF_MS = 300;

export const DEFAULT_PASSAGE_OPTIONS: PassageOptions = {
  contentType: 'text',
  includeNotes: false,
  includeTitles: false,
  includeChapterNumbers: false,
  includeVerseNumbers: false,
  includeVerseSpans: false,
} as const;

export const DEFAULT_LANGUAGES = ['eng'];
