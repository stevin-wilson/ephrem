import 'dotenv/config';
import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {
  BibleResponse,
  BookResponse,
  PassageAndFumsResponse,
  PassageOptions,
} from '../types.js';
import createError from 'http-errors';
import {defaultPassageOptions} from '../utils.js';

const MAX_RETRIES = 3;
const DELAY_BETWEEN_CALLS_MS = 1000;
const INITIAL_BACKOFF_MS = 300;

// - - - - - - - - - -
export const defaultConfig = {
  method: 'GET',
  headers: {'api-key': process.env.API_BIBLE_API_KEY!},
} as const;
// - - - - - - - - - -
/**
 * Returns the URL for retrieving available Bibles based on the specified language.
 * @param language - ISO 639-3 three digit language code of the desired Bibles.
 * @returns The URL for retrieving available Bibles.
 */
const getAvailableBiblesURL = (language: string): string =>
  `https://api.scripture.api.bible/v1/bibles?language=${language}`;
// - - - - - - - - - -
/**
 * Returns the URL for getting available books based on the given Bible ID.
 * @param bibleID - The ID of the Bible for which the available books URL is requested.
 * @returns The URL for getting available books.
 */
const getAvailableBooksURL = (bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=false`;

// - - - - - - - - - -
/**
 * Delays the execution by the specified number of milliseconds.
 * @param ms - The number of milliseconds to delay the execution.
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// - - - - - - - - - -
/**
 * Retries a given function call if it fails due to a 503-error response.
 * @param fn - The function to be retried.
 * @param [retries] - The number of retries to attempt.
 * @param [initialBackoff] - The initial backoff duration in milliseconds.
 * @returns The result of the function call.
 * @throws {Error} If the maximum number of retries is reached, or if an error occurs while processing the request.
 */
const retryOn503 = async <T>(
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

/**
 * Fetches data from an API using Axios.
 * @param url - The URL of the API.
 * @param [config] - The configuration object for Axios.
 * @param [delayBetweenCalls] - The delay between consecutive API calls in milliseconds.
 * @returns A Promise that resolves to the fetched data.
 */
const fetchFromAPI = async (
  url: string,
  config: AxiosRequestConfig = defaultConfig,
  delayBetweenCalls: number | undefined = DELAY_BETWEEN_CALLS_MS // delay between consecutive API calls in milliseconds
): Promise<unknown> => {
  try {
    // Wait for delay before making the API call
    if (delayBetweenCalls !== undefined) {
      await sleep(delayBetweenCalls);
    }

    const response = await retryOn503(() => axios.get(url, config));
    return response.data.data;
  } catch (error) {
    // checking if error response exists
    if (axios.isAxiosError(error) && error.response) {
      // handling based on status code
      switch (error.response.status) {
        case 400:
          throw new Error(
            'Bad Request. Please check your input and try again.'
          );
        case 401:
          throw new Error('Unauthorized. Please check your credentials.');
        case 403:
          throw new Error(
            'Forbidden. You do not have permission to access this resource.'
          );
        case 404:
          throw new Error(
            'Not Found. The requested resource could not be found.'
          );
        case 500:
          throw new Error('Server Error. Please try again later.');
        default:
          throw new Error('An unexpected error occurred. Please try again.');
      }
    } else {
      // generic error message for non http related errors like network failure, etc.
      throw new Error(
        'An error occurred while fetching data. Please try again.'
      );
    }
  }
};
// - - - - - - - - - -
/**
 * Fetches the available Bibles based on the provided language.
 * @param language - ISO 639-3 three digit language code for the desired language.
 * @param [config] - Optional configuration for the API request.
 * @returns - A Promise that resolves to an array of BibleResponse objects.
 */
export const fetchBibles = async (
  language: string,
  config: AxiosRequestConfig = defaultConfig
): Promise<BibleResponse[]> => {
  const url = getAvailableBiblesURL(language);
  return (await fetchFromAPI(url, config)) as BibleResponse[];
};
// - - - - - - - - - -
/**
 * Fetches the available books for a given bible ID.
 * @param bibleID - The ID of the bible.
 * @param [config] - The Axios request configuration options (optional).
 * @returns - A Promise that resolves with an array of BookResponse objects.
 */
export const fetchBooks = async (
  bibleID: string,
  config: AxiosRequestConfig = defaultConfig
): Promise<BookResponse[]> => {
  const url = getAvailableBooksURL(bibleID);
  return (await fetchFromAPI(url, config)) as BookResponse[];
};

// - - - - - - - - - -
/**
 * Returns the URL for retrieving a passage from the scripture API.
 * @param passageID - The unique identifier for the passage.
 * @param bibleID - The unique identifier for the bible.
 * @param passageOptions - The options for retrieving the passage (optional).
 * @returns The URL for retrieving the passage.
 */
const getPassageURL = (
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions = defaultPassageOptions
): string => {
  const {
    contentType = 'html',
    includeNotes = false,
    includeTitles = false,
    includeChapterNumbers = false,
    includeVerseNumbers = false,
    includeVerseSpans = false,
  } = passageOptions;

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const params = new URLSearchParams({
    'content-type': contentType,
    'include-notes': includeNotes.toString(),
    'include-titles': includeTitles.toString(),
    'include-chapter-numbers': includeChapterNumbers.toString(),
    'include-verse-numbers': includeVerseNumbers.toString(),
    'include-verse-spans': includeVerseSpans.toString(),
    'use-org-id': 'false',
  });

  return `https://api.scripture.api.bible/v1/bibles/${bibleID}/passages/${passageID}?${params.toString()}`;
};

// - - - - - - - - - -
/**
 * Represents an error that occurs during the passage retrieval from API.Bible.
 */
class PassageError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'PassageError';
  }
}

// - - - - - - - - - -
/**
 * Handles passage fetching errors
 * @param error - The thrown error object, which is of type Error.
 * @throws {PassageError} - If an error occurs during the passage fetch, a PassageError is thrown with relevant error details.
 */
function handleFetchPassageError(error: Error): never {
  if (axios.isAxiosError(error)) {
    // error is AxiosError
    const response = error.response;
    if (response) {
      switch (response.status) {
        case 400:
          throw new PassageError(
            'Bad request. Please check your request content',
            response.status,
            response.statusText
          );
        case 404:
          throw new PassageError(
            'Invalid passage or bible id.',
            response.status,
            response.statusText
          );
        default:
          throw new PassageError(
            'An error occurred while fetching the passage.',
            response.status,
            response.statusText
          );
      }
    } else {
      // Request made but no response received
      throw new PassageError(
        'No response received from API. Please check your connection or API endpoint.',
        0,
        ''
      );
    }
  } else {
    // error is generic Error
    throw new PassageError(error.message, 0, '');
  }
}

// fetchPassage function implementation
export const fetchPassage = async (
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions = defaultPassageOptions,
  config: AxiosRequestConfig = defaultConfig,
  delayBetweenCalls: number | undefined = DELAY_BETWEEN_CALLS_MS
): Promise<PassageAndFumsResponse> => {
  const passageRequest = async () => {
    const url = getPassageURL(passageID, bibleID, passageOptions);
    const response = await axios.get(url, config);
    return response.data as PassageAndFumsResponse;
  };

  // Wait for delay before making the API call
  if (delayBetweenCalls !== undefined) {
    await sleep(delayBetweenCalls);
  }

  try {
    return await retryOn503(passageRequest, MAX_RETRIES);
  } catch (error) {
    let err: Error;
    if (error instanceof Error) {
      err = error;
    } else {
      err = new Error((error as {message?: string}).message || 'Unknown error');
    }
    handleFetchPassageError(err);
  }
};
// - - - - - - - - - -
