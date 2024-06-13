import {defaultCacheDir, removePeriod, writeJsonFile} from '../utils.js';
import {
  BookIdWithLanguage,
  BookNameDetails,
  BookNameReference,
  BookNames,
  BookResponse,
  Cache,
} from '../types.js';
import fs from 'fs-extra';
import {books} from '../books.js';
import {AxiosRequestConfig} from 'axios';
import {fetchBooks} from './api-bible.js';

// - - - - - - - - - -
//  BookNames -> Book
const getBookNamesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/book-names.json`;
};

// - - - - - - - - - -
// serialize the BookNames map to JSON
export const saveBookNames = async (
  bookNames: BookNames,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBookNamesCachePath(cacheDir),
    JSON.stringify(bookNames, null, 2)
  );
};

// - - - - - - - - - -
// deserialize JSON back to a BookNames
const cleanBookNamesCache = (
  bookNames: BookNames,
  maxAgeDays = 14,
  currentTimestamp?: Date
): BookNames => {
  let thresholdDate = currentTimestamp;
  if (thresholdDate === undefined) {
    thresholdDate = new Date();
  }
  thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);

  const cleanedBookNames: BookNames = {};

  for (const [bookName, bookNameReferences] of Object.entries(bookNames)) {
    const updatedBookNameReferences = bookNameReferences.filter(
      bookNameReference => bookNameReference.cachedOn > thresholdDate
    );
    if (updatedBookNameReferences.length === 0) {
      continue;
    }

    cleanedBookNames[bookName] = updatedBookNameReferences;
  }
  return cleanedBookNames;
};

export const loadBookNames = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number,
  currentTimestamp?: Date
): Promise<BookNames> => {
  try {
    const jsonData = await fs.readFile(
      getBookNamesCachePath(cacheDir),
      'utf-8'
    );
    const bookNames = JSON.parse(jsonData) as BookNames;

    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanBookNamesCache(bookNames, maxAgeDays, currentTimestamp);
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
    return {} as BookNames;
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
  bookIdWithLanguage: BookIdWithLanguage,
  bookNameReference: BookNameReference
): boolean => {
  let output = true;

  if (bookIdWithLanguage.id !== bookNameReference.id) {
    output = false;
  }

  if (bookIdWithLanguage.language !== bookNameReference.language) {
    output = false;
  }

  if (
    bookIdWithLanguage.scriptDirection !== bookNameReference.scriptDirection
  ) {
    output = false;
  }

  if (bookIdWithLanguage.isAbbreviation !== bookNameReference.isAbbreviation) {
    output = false;
  }

  return output;
};

export const updateBookNames = async (
  languages: string[],
  cache: Cache,
  config: AxiosRequestConfig = {},
  timestamp?: Date
): Promise<void> => {
  if (timestamp === undefined) {
    timestamp = new Date();
  }

  for (const [bibleAbbreviation, bible] of Object.entries(cache.bibles)) {
    if (!languages.includes(bible.language)) {
      continue;
    }

    const bookResponses = await fetchBooks(bible.id, config);

    const bookNamesFromBible = getBookNames(bookResponses);
    for (const bookNameDetails of bookNamesFromBible) {
      const bookReferences = cache.bookNames[bookNameDetails.name];
      if (bookReferences === undefined || bookReferences.length === 0) {
        cache.bookNames[bookNameDetails.name] = [
          {
            id: bookNameDetails.id,
            isAbbreviation: bookNameDetails.isAbbreviation,
            language: bible.language,
            scriptDirection: bible.scriptDirection,
            bibles: [bibleAbbreviation],
            cachedOn: timestamp,
          },
        ];
      } else {
        const thisBookIdWithLanguage: BookIdWithLanguage = {
          id: bookNameDetails.id,
          language: bible.language,
          scriptDirection: bible.scriptDirection,
          isAbbreviation: bookNameDetails.isAbbreviation,
        };

        let addedToBookNames = false;

        for (const bookReference of bookReferences) {
          if (bookReference.bibles.includes(bibleAbbreviation)) {
            addedToBookNames = true;
            break;
          }

          if (
            bookNameDetailsMatchReference(thisBookIdWithLanguage, bookReference)
          ) {
            bookReference.bibles.push(bibleAbbreviation);
            addedToBookNames = true;
            break;
          }
        }

        if (!addedToBookNames) {
          bookReferences.push({
            ...thisBookIdWithLanguage,
            bibles: [bibleAbbreviation],
            cachedOn: timestamp,
          });
        }

        cache.bookNames[bookNameDetails.name] = bookReferences;
      }
    }
  }
  cache.updatedSinceLoad = true;
};
