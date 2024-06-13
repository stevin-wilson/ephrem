import 'dotenv/config';
import {HTTPError} from '../utils.js';
import axios, {AxiosRequestConfig} from 'axios';
import {
  BibleResponse,
  BookResponse,
  PassageAndFumsResponse,
  PassageOptions,
} from '../types.js';

// - - - - - - - - - -
const getAvailableBiblesURL = (language: string): string =>
  `https://api.scripture.api.bible/v1/bibles?language=${language}`;
// - - - - - - - - - -
const getAvailableBooksURL = (bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=false`;

// - - - - - - - - - -
const defaultConfig = {
  method: 'GET',
  headers: {'api-key': process.env.API_BIBLE_API_KEY!},
} as const;
// - - - - - - - - - -
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// - - - - - - - - - -
const fetchFromAPI = async (
  url: string,
  config: AxiosRequestConfig = {},
  retries = 3,
  backoff = 300, // initial backoff time in milliseconds
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

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, finalConfig);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If it's a 503 error, we retry
        if (error.response.status === 503 && attempt < retries) {
          await sleep(backoff * Math.pow(2, attempt)); // exponential backoff
          continue;
        }
        throw new HTTPError(error.response.status, error.response.statusText);
      }
      throw error;
    }
  }
  throw new Error('Max retries reached');
};
// - - - - - - - - - -
export const fetchBibles = async (
  language: string,
  config: AxiosRequestConfig = {}
): Promise<BibleResponse[]> => {
  const url = getAvailableBiblesURL(language);
  return (await fetchFromAPI(url, config)) as BibleResponse[];
};
// - - - - - - - - - -
export const fetchBooks = async (
  bibleID: string,
  config: AxiosRequestConfig = {}
): Promise<BookResponse[]> => {
  const url = getAvailableBooksURL(bibleID);
  return (await fetchFromAPI(url, config)) as BookResponse[];
};

// - - - - - - - - - -
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
    if (axios.isAxiosError(error) && error.response) {
      throw new HTTPError(error.response.status, error.response.statusText);
    }
    throw error;
  }
};
// - - - - - - - - - -
