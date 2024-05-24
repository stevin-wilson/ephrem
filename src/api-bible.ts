import {envVariableIsSet, HTTPError} from './utils.js';
import {Books} from './books.js';

// import { Books } from './books.js';
type ValueOf<T> = T[keyof T];

class ApiBibleKeyNotSetError extends Error {
  constructor() {
    super(
      'API Key for ABI.Bible was not set. Use API_BIBLE_API_KEY Environment variable to specify API Key'
    );
    this.name = 'ApiBibleKeyNotSetError';
    Object.setPrototypeOf(this, ApiBibleKeyNotSetError.prototype);
  }
}

const apiBibleKeyIsSet = () => envVariableIsSet('API_BIBLE_API_KEY');

interface Verse {
  id: string;
  reference: string;
}

interface Scripture {
  id: string;
  reference: string;
  content: string;
  format: 'html' | 'json' | 'text';
  language: string;
  copyright: string;
}

interface Chapter {
  id: string;
  verses: Verse[] | undefined;
}

interface Book {
  id: ValueOf<Books>;
  name: string;
  chapters: Chapter[];
}

interface Bible {
  id: string;
  name: string;
  nameLocal: string;
  // abbreviation: string;
  language: {
    name: string;
  };
  books: Book[];
}

type Library = Record<string, Bible>;

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

/**
 *
 * @param language
 */
async function getSupportedBibles(language = 'eng'): Promise<Bible[]> {
  if (!apiBibleKeyIsSet()) {
    throw new ApiBibleKeyNotSetError();
  }

  const url = `https://api.scripture.api.bible/v1/bibles?language=${language}&include-full-details=true`;
  const options: RequestInit = {
    method: 'GET',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    headers: {'api-key': process.env.API_BIBLE_API_KEY!},
  };

  /**
   *
   */
  async function fetchBibles(): Promise<Bible[]> {
    const response: Response = await fetch(url, options);
    if (!response.ok) {
      throw new HTTPError(response.status, response.statusText);
    }
    const data = await response.json();
    // @ts-expect-error from api.bible docs
    return data.data as Bible[];
  }

  return fetchBibles();
}

const bibles = await getSupportedBibles('mal');
console.log(bibles);

/**
 *
 * @param bibleId
 */
async function getBooksAndChaptersInBible(
  bibleId: string
): Promise<BooksOfBible[]> {
  if (!apiBibleKeyIsSet()) {
    throw new ApiBibleKeyNotSetError();
  }
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/books?include-chapters=true`;
  const options: RequestInit = {
    method: 'GET',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    headers: {'api-key': process.env.API_BIBLE_API_KEY!},
  };

  /**
   *
   */
  async function fetchBooksAndChapters(): Promise<Bible[]> {
    const response: Response = await fetch(url, options);
    if (!response.ok) {
      throw new HTTPError(response.status, response.statusText);
    }
    const data = await response.json();
    // @ts-expect-error from api.bible docs
    return data.data as Bible[];
  }

  return fetchBooksAndChapters();
}

/**
 *
 * @param bibleId
 */
async function getVersesInChapter(bibleId: string): Promise<BooksOfBible[]> {}
