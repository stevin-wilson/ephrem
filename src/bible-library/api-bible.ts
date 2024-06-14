import 'dotenv/config';
import axios, {AxiosRequestConfig} from 'axios';
import {
  BibleResponse,
  BookResponse,
  PassageAndFumsResponse,
  PassageOptions,
} from '../types.js';
import createError from 'http-errors';

// - - - - - - - - - -
const defaultConfig = {
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
  retries = 3,
  initialBackoff = 300
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
  config: AxiosRequestConfig = {},
  delayBetweenCalls: number | undefined = 1000 // delay between consecutive API calls in milliseconds
): Promise<unknown> => {
  const finalConfig = {
    ...defaultConfig,
    ...config,
  };

  // Wait for delay before making the API call
  if (delayBetweenCalls !== undefined) {
    await sleep(delayBetweenCalls);
  }

  return await retryOn503(() =>
    axios.get(url, finalConfig).then(response => response.data.data)
  );
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
  config: AxiosRequestConfig = {}
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
  config: AxiosRequestConfig = {}
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
  passageOptions: PassageOptions
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
 * Fetches a Bible passage by ID and Bible ID.
 * @async
 * @param passageID - The ID of the passage to fetch.
 * @param bibleID - The ID of the Bible from which to fetch the passage.
 * @param [passageOptions] - Optional parameters for fetching the passage.
 * @param [config] - Optional configuration for the Axios HTTP client.
 * @returns - A promise that resolves to the fetched passage and Fums (Find, Usages, Metadata, and Statistics) response.
 * @throws {PassageError} - If an error occurs during the passage fetch, a PassageError is thrown with relevant error details.
 */
export const fetchPassage = async (
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions = {},
  config: AxiosRequestConfig = {}
): Promise<PassageAndFumsResponse> => {
  const finalConfig = {
    ...defaultConfig,
    ...config,
  };

  const url = getPassageURL(passageID, bibleID, passageOptions);

  try {
    const response = await axios.get(url, finalConfig);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.data as PassageAndFumsResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new PassageError(
              'Bad request. Please check your request content',
              error.response.status,
              error.response.statusText
            );
          case 404:
            throw new PassageError(
              'Invalid passage or bible id.',
              error.response.status,
              error.response.statusText
            );
          default:
            throw new PassageError(
              'An error occurred while fetching the passage.',
              error.response.status,
              error.response.statusText
            );
        }
      } else if (error.request) {
        throw new PassageError(
          'No response received from API. Please check your connection or API endpoint.',
          0,
          ''
        );
      } else {
        throw new PassageError(
          'An error occurred in the request setup.',
          0,
          ''
        );
      }
    } else {
      throw new PassageError('An unexpected error occurred.', 0, '');
    }
  }
};
// - - - - - - - - - -
