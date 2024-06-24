// - - - - - - - - - -
import axios, {AxiosRequestConfig} from 'axios';
import {
  DEFAULT_DELAY_BETWEEN_CALLS_MS,
  DEFAULT_INITIAL_BACKOFF_MS,
  DEFAULT_LANGUAGES,
  DEFAULT_MAX_RETRIES,
  DEFAULT_PASSAGE_OPTIONS,
} from './api-constants.js';
import createError from 'http-errors';
import {PassageOptions} from './api-types.js';

import {config, getValidLanguages} from '../utils.js';

// - - - - - - - - - -
export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// - - - - - - - - - -

export const setDefaultMaxRetries = (maxRetries: number) => {
  const processedMaxRetries = maxRetries < 0 ? DEFAULT_MAX_RETRIES : maxRetries;

  config.set('API_MAX_RETRIES', processedMaxRetries);
};

export const getDefaultMaxRetries = (): number => {
  const maxRetriesUser = config.get('API_MAX_RETRIES');
  return !isNaN(Number(maxRetriesUser))
    ? Number(maxRetriesUser)
    : DEFAULT_MAX_RETRIES;
};

// - - - - - - - - - -
export const setDefaultInitialBackoffMs = (initialBackoffMs: number) => {
  const processedInitialBackoffMs =
    initialBackoffMs < 0 ? DEFAULT_INITIAL_BACKOFF_MS : initialBackoffMs;

  config.set('API_INITIAL_BACKOFF_MS', processedInitialBackoffMs);
};

export const getDefaultInitialBackoffMs = (): number => {
  const initialBackoffMsUser = config.get('DEFAULT_INITIAL_BACKOFF_MS');
  return !isNaN(Number(initialBackoffMsUser))
    ? Number(initialBackoffMsUser)
    : DEFAULT_INITIAL_BACKOFF_MS;
};

// - - - - - - - - - -
export const setDefaultDelayBetweenCallsMs = (delayBetweenCallsMs: number) => {
  const processedDelayBetweenCallsMs =
    delayBetweenCallsMs < 0
      ? DEFAULT_DELAY_BETWEEN_CALLS_MS
      : delayBetweenCallsMs;

  config.set('API_DELAY_BETWEEN_CALLS_MS', processedDelayBetweenCallsMs);
};

export const getDefaultDelayBetweenCallsMs = (): number => {
  const delayBetweenCallsMsUser = config.get('API_DELAY_BETWEEN_CALLS_MS');
  return !isNaN(Number(delayBetweenCallsMsUser))
    ? Number(delayBetweenCallsMsUser)
    : DEFAULT_DELAY_BETWEEN_CALLS_MS;
};

// - - - - - - - - - -
export const setDefaultLanguages = (languages: string[]) => {
  const validLanguages = getValidLanguages(languages);
  if (validLanguages.length > 0) {
    config.set('LANGUAGES', validLanguages);
  }
};

export const getDefaultLanguages = (): string[] => {
  const languages = config.get('LANGUAGES');

  let validLanguages: string[] = [];
  if (Array.isArray(languages)) {
    validLanguages = getValidLanguages(languages);
  }

  if (validLanguages.length > 0) {
    return validLanguages;
  } else {
    return DEFAULT_LANGUAGES;
  }
};

// - - - - - - - - - -
export const setApiKey = (apiBibleKey: string) => {
  const processedApiKey = apiBibleKey.trim();

  if (!processedApiKey) {
    throw new Error('No API key provided');
  }

  config.set('API_BIBLE_KEY', processedApiKey);
};

export const getDefaultApiConfig = (): AxiosRequestConfig => {
  const apiKey = config.get('API_BIBLE_KEY');
  if (!apiKey) {
    throw new Error('No API key provided');
  }
  return {
    method: 'GET',
    headers: {'api-key': `${apiKey}`},
  };
};

export const setDefaultPassageOptions = (passageOptions: PassageOptions) => {
  if (passageOptions && Object.keys(passageOptions).length > 0) {
    config.set('PASSAGE_OPTIONS', passageOptions);
  }
};

export const getDefaultPassageOptions = (): PassageOptions => {
  return config.get('PASSAGE_OPTIONS') || DEFAULT_PASSAGE_OPTIONS;
};

// - - - - - - - - - -
export const retryOn503 = async <T>(
  fn: () => Promise<T>,
  retries = getDefaultMaxRetries(),
  initialBackoff = getDefaultInitialBackoffMs()
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
