import {
  cleanUpOldRecords,
  defaultCacheDir,
  removePeriod,
  writeJsonFile,
} from '../utils.js';
import {
  Bibles,
  BiblesToBooks,
  BookName,
  BookNameDetailsWithDirection,
  BookNameMoreDetails,
  BookNames,
  BookResponse,
  BooksInBible,
  BooksToChapters,
  ChaptersInBook,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {fetchBooksAndChapters} from './api-bible.js';
import {updateBibles} from './bibles.js';
import {
  getBibleAndBookString,
  getBookIDs,
  getChapterIDs,
} from './books-chapters.js';
import {books} from '../books.js';

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
    language: book.language,
    scriptDirection: book.scriptDirection,
    cachedOn: book.cachedOn.toISOString(),
  }));
  return JSON.stringify(obj, null, 2);
};

export const saveBookNames = async (
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
      language: item.language,
      scriptDirection: item.scriptDirection,
      cachedOn: new Date(item.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

export const loadBookNames = async (
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
export const getBookNames = (
  bookResponses: BookResponse[]
): BookNameMoreDetails[] => {
  const bookNames: BookNameMoreDetails[] = [];
  const allowedBooks = Object.keys(books) as (keyof typeof books)[];
  const datetime = new Date();

  for (const bookResponse of bookResponses) {
    const bookID = bookResponse.id as keyof typeof books;
    console.log(bookID);
    if (!allowedBooks.includes(bookID)) {
      continue;
    }

    const newNames: BookNameMoreDetails[] = [
      {
        name: removePeriod(bookResponse.name).toLowerCase(),
        isAbbreviation: false,
        id: bookID,
        cachedOn: datetime,
      },
      {
        name: removePeriod(bookResponse.nameLong).toLowerCase(),
        isAbbreviation: false,
        id: bookID,
        cachedOn: datetime,
      },
      // {
      //   name: bookResponse.abbreviation,
      //   isAbbreviation: true,
      //   id: bookID,
      //   cachedOn: datetime,
      // },
    ];

    for (let i = 0; i < newNames.length; i++) {
      if (newNames[i].id === newNames[i].name) {
        continue;
      }

      bookNames.push(newNames[i]);
    }
  }
  console.log(bookNames);
  return bookNames;
};
