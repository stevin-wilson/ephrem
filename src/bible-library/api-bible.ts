import 'dotenv/config';
import {HTTPError} from '../utils.js';
import axios, {AxiosRequestConfig} from 'axios';
import {
  BibleResponse,
  BookResponse,
  PassageAndFumsResponse,
  PassageOptions,
  VerseResponse,
} from '../types.js';

// - - - - - - - - - -
const getAvailableBiblesURL = (language: string): string =>
  `https://api.scripture.api.bible/v1/bibles?language=${language}`;
// - - - - - - - - - -
const getAvailableBooksAndChaptersURL = (bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=true`;
// - - - - - - - - - -
const getVersesURL = (chapterID: string, bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/chapters/${chapterID}/verses`;
// - - - - - - - - - -
const defaultConfig = {
  method: 'GET',
  headers: {'api-key': process.env.API_BIBLE_API_KEY!},
} as const;
// - - - - - - - - - -
const fetchFromAPI = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<unknown> => {
  const configToUse = config !== undefined ? config : defaultConfig;

  try {
    const response = await axios.get(url, configToUse);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HTTPError(error.response.status, error.response.statusText);
    }
    throw error;
  }
};
// - - - - - - - - - -
export const fetchBibles = async (
  language: string,
  config?: AxiosRequestConfig
): Promise<BibleResponse[]> => {
  const url = getAvailableBiblesURL(language);
  return (await fetchFromAPI(url, config)) as BibleResponse[];
};
// - - - - - - - - - -
export const fetchBooksAndChapters = async (
  bibleID: string,
  config?: AxiosRequestConfig
): Promise<BookResponse[]> => {
  const url = getAvailableBooksAndChaptersURL(bibleID);
  return (await fetchFromAPI(url, config)) as BookResponse[];
};
// - - - - - - - - - -
export const fetchVerses = async (
  chapterID: string,
  bibleID: string,
  config?: AxiosRequestConfig
): Promise<VerseResponse[]> => {
  const url = getVersesURL(chapterID, bibleID);
  return (await fetchFromAPI(url, config)) as VerseResponse[];
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
