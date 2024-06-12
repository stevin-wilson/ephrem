import {defaultCacheDir, removePeriod, writeJsonFile} from '../utils.js';
import {
  BibleAbbreviation,
  Bibles,
  BookIdWithLanguage,
  BookName,
  BookNameDetails,
  BookNameReference,
  BookNameReferenceCached,
  BookNames,
  BookResponse,
  Cache,
} from '../types.js';
import fs from 'fs-extra';
import {books} from '../books.js';
import {AxiosRequestConfig} from 'axios';
import {fetchBooksAndChapters} from './api-bible.js';
import {updateBibles} from './bibles.js';
import {updateBooks, updateChapters} from './cache.js';

// - - - - - - - - - -
//  BookNames -> Book
const getBookNamesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/book-names.json`;
};

// - - - - - - - - - -
// serialize the BookNames map to JSON
const serializeBookNames = (bookNames: BookNames): string => {
  const obj = Array.from(bookNames.entries()).map(([name, bookReferences]) => ({
    name: name,
    bookReferences: bookReferences,
  }));
  return JSON.stringify(obj, null, 2);
};

// - - - - - - - - - -
export const saveBookNames = async (
  bookNames: BookNames,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBookNamesCachePath(cacheDir),
    serializeBookNames(bookNames)
  );
};

// - - - - - - - - - -
// deserialize JSON back to a ChaptersToVerses map
const deserializeBookNames = (jsonData: string): BookNames => {
  const arr = JSON.parse(jsonData);
  const map: BookNames = new Map();

  arr.forEach((item: BookNameReferenceCached) => {
    const key: BookName = item.name;
    const value: BookNameReference[] = item.bookReferences;
    map.set(key, value);
  });

  return map;
};

const cleanUpBookNames = (
  bookNames: BookNames,
  maxAgeDays: number
): BookNames => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);

  const output: BookNames = new Map();
  for (const [bookName, bookNameReferences] of bookNames) {
    const filteredBookNameReferences = bookNameReferences.filter(
      bookNameReference => bookNameReference.cachedOn > thresholdDate
    );

    output.set(bookName, filteredBookNameReferences);
  }

  return output;
};

export const loadBookNames = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number
): Promise<BookNames> => {
  try {
    const jsonData = await fs.readFile(
      getBookNamesCachePath(cacheDir),
      'utf-8'
    );
    const bookNames = deserializeBookNames(jsonData);

    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanUpBookNames(bookNames, maxAgeDays);
    } else {
      return bookNames;
    }
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
): BookNameDetails[] => {
  const bookNames: BookNameDetails[] = [];
  const allowedBooks = Object.keys(books) as (keyof typeof books)[];

  for (const bookResponse of bookResponses) {
    const bookID = bookResponse.id as keyof typeof books;
    console.log(bookID);
    if (!allowedBooks.includes(bookID)) {
      continue;
    }

    const newNames: BookNameDetails[] = [
      {
        name: removePeriod(bookResponse.name).toLowerCase(),
        isAbbreviation: false,
        id: bookID,
      },
      {
        name: removePeriod(bookResponse.nameLong).toLowerCase(),
        isAbbreviation: false,
        id: bookID,
      },
      {
        name: bookResponse.abbreviation,
        isAbbreviation: true,
        id: bookID,
      },
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

const bookNameDetailsMatchReference = (
  bookNameDetails: BookIdWithLanguage,
  bookNameReference: BookNameReference
): boolean => {
  let output = true;

  if (bookNameDetails.id !== bookNameReference.id) {
    output = false;
  }

  if (bookNameDetails.language !== bookNameReference.language) {
    output = false;
  }

  if (bookNameDetails.scriptDirection !== bookNameReference.scriptDirection) {
    output = false;
  }

  if (bookNameDetails.isAbbreviation !== bookNameReference.isAbbreviation) {
    output = false;
  }

  return output;
};

const updateBookNames = (
  bookResponses: BookResponse[],
  bibleAbbreviation: BibleAbbreviation,
  bookNames: BookNames,
  bibles: Bibles,
  timestamp?: Date
): void => {
  if (timestamp === undefined) {
    timestamp = new Date();
  }

  const bible = bibles.get(bibleAbbreviation);
  if (bible === undefined) {
    throw Error;
  }

  const bibleID = bible.id;
  const language = bible.language.id;
  const scriptDirection = bible.language.scriptDirection;

  const bookNamesFromBible = getBookNames(bookResponses);
  for (const bookNameDetails of bookNamesFromBible) {
    const bookReferences = bookNames.get(bookNameDetails.name);
    if (bookReferences === undefined) {
      bookNames.set(bookNameDetails.name, [
        {
          id: bookNameDetails.id,
          isAbbreviation: bookNameDetails.isAbbreviation,
          language: language,
          scriptDirection: scriptDirection,
          bibles: [bibleID],
          cachedOn: timestamp,
        },
      ]);
      continue;
    }

    const thisBookReference: BookIdWithLanguage = {
      id: bookNameDetails.id,
      language: language,
      scriptDirection: scriptDirection,
      isAbbreviation: bookNameDetails.isAbbreviation,
    };

    let addedToBookNames = false;
    for (const bookReference of bookReferences) {
      if (bookReference.bibles.includes(bibleID)) {
        addedToBookNames = true;
        break;
      }

      if (bookNameDetailsMatchReference(thisBookReference, bookReference)) {
        bookReference.bibles.push(bibleID);
        addedToBookNames = true;
        break;
      }
    }

    if (!addedToBookNames) {
      bookReferences.push({
        ...thisBookReference,
        bibles: [bibleID],
        cachedOn: timestamp,
      });
    }

    bookNames.set(bookNameDetails.name, bookReferences);
  }
};

// - - - - - - - - - -
export const prepareCacheForReferenceParse = async (
  languages: string[],
  cache: Cache,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  const timestamp = new Date();

  // update Bibles
  await updateBibles(languages, cache.bibles, config, timestamp);

  for (const [bibleAbbreviation, bible] of cache.bibles.entries()) {
    if (!languages.includes(bible.language.id)) {
      continue;
    }

    // update Books in each Bible
    const booksAndChaptersResponses: BookResponse[] =
      await fetchBooksAndChapters(bible.id, config);

    updateBooks(
      booksAndChaptersResponses,
      bibleAbbreviation,
      cache.biblesToBooks,
      timestamp
    );

    // update Chapters in each Book
    updateChapters(
      booksAndChaptersResponses,
      bibleAbbreviation,
      cache.booksToChapters,
      timestamp
    );

    // update BookNames -> Book Code Map
    updateBookNames(
      booksAndChaptersResponses,
      bibleAbbreviation,
      cache.bookNames,
      cache.bibles,
      timestamp
    );
  }
};
