import 'dotenv/config';
import {HTTPError} from './utils.js';
import axios, {AxiosRequestConfig} from 'axios';

export interface Language {
  id: string;
  name: string;
  nameLocal: string;
  script: string;
  scriptDirection: 'RTL' | 'LTR';
}

interface LanguageResponse extends Language {
  [key: string]: unknown;
}

export interface VerseResponse {
  id: string;

  [key: string]: unknown;
}

interface ChapterResponse {
  id: string;
  number: string;
  [key: string]: unknown;
}

export interface BookResponse {
  id: string;
  chapters: ChapterResponse[];

  [key: string]: unknown;
}

export interface BibleResponse {
  id: string;
  dblId: string;
  name: string;
  nameLocal: string;
  abbreviation: string;
  language: LanguageResponse;

  [key: string]: unknown;
}

// - - - - - - - - - -
const getAvailableBiblesURL = (language: string): string =>
  `https://api.scripture.api.bible/v1/bibles?language=${language}`;

const getAvailableBooksAndChaptersURL = (bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=true`;

const getVersesURL = (chapterID: string, bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/chapters/${chapterID}/verses`;

const defaultConfig = {
  method: 'GET',
  headers: {'api-key': process.env.API_BIBLE_API_KEY!},
} as const;

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 */
async function fetchFromAPI(
  url: string,
  config?: AxiosRequestConfig
): Promise<unknown> {
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
}

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param language ISO code of language
 * @param options
 */
export async function fetchBibles(
  language: string,
  config?: AxiosRequestConfig
): Promise<BibleResponse[]> {
  const url = getAvailableBiblesURL(language);
  return (await fetchFromAPI(url, config)) as BibleResponse[];
}

// console.log(await getAvailableBibles('ENG'));

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 // eslint-disable-next-line jsdoc/require-param-description
 * @param bibleID
 // eslint-disable-next-line jsdoc/require-param-description
 // eslint-disable-next-line jsdoc/require-param-description
 * @param config
 */
export async function fetchBooksAndChapters(
  bibleID: string,
  config?: AxiosRequestConfig
): Promise<BookResponse[]> {
  const url = getAvailableBooksAndChaptersURL(bibleID);
  return (await fetchFromAPI(url, config)) as BookResponse[];
}

// console.log(
//   JSON.stringify(await getBookAndChapters('805e795e07fb9422-01'), null, 2)
// );

export async function fetchVerses(
  chapterID: string,
  bibleID: string,
  config?: AxiosRequestConfig
): Promise<VerseResponse[]> {
  const url = getVersesURL(chapterID, bibleID);
  return (await fetchFromAPI(url, config)) as VerseResponse[];
}

interface PassageResponse {
  id: string;
  reference: string;
  content: string;
  copyright: string;

  [key: string]: unknown;
}

interface FumsResponse {
  fums: string;

  [key: string]: unknown;
}

interface PassageAndFumsResponse {
  data: PassageResponse;
  meta: FumsResponse;

  [key: string]: unknown;
}

const getPassageURL = (
  passageID: string,
  bibleID: string,
  contentType: 'html' | 'json' | 'text' = 'html',
  includeNotes: boolean = false,
  includeTitles: boolean = false,
  includeChapterNumbers: boolean = false,
  includeVerseNumbers: boolean = false,
  includeVerseSpans: boolean = false
): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/passages/${passageID}?content-type=${contentType}&include-notes=${includeNotes}&include-titles=${includeTitles}&include-chapter-numbers=${includeChapterNumbers}&include-verse-numbers=${includeVerseNumbers}&include-verse-spans=${includeVerseSpans}&use-org-id=false`;

export async function fetchPassage(
  passageID: string,
  bibleID: string,
  contentType: 'html' | 'json' | 'text' = 'html',
  includeNotes: boolean = false,
  includeTitles: boolean = false,
  includeChapterNumbers: boolean = false,
  includeVerseNumbers: boolean = false,
  includeVerseSpans: boolean = false,
  config?: AxiosRequestConfig
): Promise<PassageAndFumsResponse> {
  const configToUse = config !== undefined ? config : defaultConfig;

  const url = getPassageURL(
    passageID,
    bibleID,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans
  );

  try {
    const response = await axios.get(url, configToUse);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HTTPError(error.response.status, error.response.statusText);
    }
    throw error;
  }
}

console.log(
  JSON.stringify(
    await fetchPassage('GEN.1.1-GEN.2', '805e795e07fb9422-01'),
    null,
    2
  )
);

// - - - - - - - - - -
// * Build Library
// Get languages as input.
// Get an array of Reference as input.
// Optionally, take a Library as input

// Fetch all supported Bibles in these languages
// Check if Bibles in the references are supported.
// If not, return unsupported bibles

// For each Bible, get Books and Chapters
// Check if Books and Chapters in the references are supported
// If not, return unsupported References

// Identify References that specify Verse number(s)
// For each Chapter, get Verses
// For each Reference that specifies a Verse number, check if the verse is available
// If not, return unsupported References

// Return [Library, unsupported References]

// - - - - - - - - - -
// * Get Scripture

// Get Library as input.
// Get an array of Reference as input.

// Get map of Bibles to Bible IDs
// Get Passage ID for each Reference

// Get Scriptures
// Return Map<Reference, Scripture>

// - - - - - - - - - -
// * Parse References

// From string input, get a map from strings to References,
// for example, Genesis 1:1 (NIV, KJV); John 3:16 (MAL10RO)
// would generate {
//      Genesis 1:1 (NIV): Reference 1,
//      Genesis 1:1 (KJV): Reference 2,
//      John 3:16 (MAL10RO): Reference 3,
// }
// Pass  References to Get Scripture
// Get Map<Reference, Scripture>

// Join and get
// {
//      Genesis 1:1 (NIV): Scripture 1,
//      Genesis 1:1 (KJV): Scripture 2,
//      John 3:16 (MAL10RO): {
//              id: string;
//              reference: "യോഹന്നാൻ 3:16";
//              content: string;
//              format: 'html';
//              language: "Malayalam";
//              copyright: string;
//      },
// }
