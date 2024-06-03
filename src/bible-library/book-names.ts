import {cleanUpOldRecords, defaultCacheDir, writeJsonFile} from '../utils.js';
import {
  Bibles,
  BookName,
  BookNameDetailsWithDirection,
  BookNameMoreDetails,
  BookNames,
  BookResponse,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {Books} from '../books.js';
import {fetchBooksAndChapters} from './api-bible.js';

// - - - - - - - - - -
//  BookNames -> Book
const getBookNamesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/book-names.json`;
};

// serialize the BookNames map to JSON
const serializeBookNames = (bookNames: BookNames): string => {
  const obj = Array.from(bookNames.entries()).map(([bookName, book]) => ({
    name: bookName,
    id: book.id,
    isAbbreviation: book.isAbbreviation,
    scriptDirection: book.scriptDirection,
    cachedOn: book.cachedOn.toISOString(),
  }));
  return JSON.stringify(obj, null, 2);
};

const saveBookNames = async (
  bookNames: BookNames,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBookNamesCachePath(cacheDir),
    serializeBookNames(bookNames)
  );
};

// deserialize JSON back to a ChaptersToVerses map
const deserializeBookNames = (jsonData: string): BookNames => {
  const arr = JSON.parse(jsonData);
  const map: BookNames = new Map();

  arr.forEach((item: any) => {
    const key: BookName = item.name;
    const value: BookNameDetailsWithDirection = {
      id: item.id,
      isAbbreviation: item.isAbbreviation,
      scriptDirection: item.scriptDirection,
      cachedOn: new Date(item.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

const loadBookNames = async (
  cacheDir: string = defaultCacheDir,
  max_age_days = 14
): Promise<BookNames> => {
  try {
    const jsonData = await fs.readFile(
      getBookNamesCachePath(cacheDir),
      'utf-8'
    );
    return cleanUpOldRecords(deserializeBookNames(jsonData), max_age_days);
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as BookNames;
  }
};

// - - - - - - - - - -
const getBookNames = (bookResponses: BookResponse[]): BookNameMoreDetails[] => {
  const bookNames: BookNameMoreDetails[] = [];
  const allowedBooks = Object.values(Books);
  const datetime = new Date();

  for (const bookResponse of bookResponses) {
    if (!allowedBooks.includes(bookResponse.id as Books)) {
      continue;
    }

    bookNames.concat([
      {
        name: bookResponse.name,
        isAbbreviation: false,
        id: bookResponse.id as Books,
        cachedOn: datetime,
      },
      {
        name: bookResponse.nameLong,
        isAbbreviation: false,
        id: bookResponse.id as Books,
        cachedOn: datetime,
      },
      {
        name: bookResponse.abbreviation,
        isAbbreviation: true,
        id: bookResponse.id as Books,
        cachedOn: datetime,
      },
    ]);
  }

  return bookNames;
};

// - - - - - - - - - -
const updateBookNames = async (
  languages: string[],
  bookNames: BookNames,
  bibles: Bibles,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  for (const bible of bibles.values()) {
    if (!languages.includes(bible.language.id)) {
      continue;
    }
    const bibleID = bible.id;
    const scriptDirection = bible.language.scriptDirection;
    const booksAndChaptersResponses: BookResponse[] =
      await fetchBooksAndChapters(bibleID, config);

    const bookNameDetailsArr = getBookNames(booksAndChaptersResponses);
    for (const bookNameDetails of bookNameDetailsArr) {
      const bookName = bookNameDetails.name;
      const bookNameDetailsWithDirection = {
        id: bookNameDetails.id,
        isAbbreviation: bookNameDetails.isAbbreviation,
        scriptDirection: scriptDirection,
        cachedOn: bookNameDetails.cachedOn,
      };
      bookNames.set(bookName, bookNameDetailsWithDirection);
    }
  }
};
