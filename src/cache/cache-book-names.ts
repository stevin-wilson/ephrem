import {BookNameDetails, BookNames} from './cache-types.js';
import {
  dateReviver,
  getThresholdDate,
  normalizeBookName,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';
import {BOOK_IDs} from '../reference/book-ids.js';
import {BookResponse} from '../api-bible/api-types.js';
import {getDefaultCacheDir, getDefaultMaxCacheAgeDays} from './cache-utils.js';

const getBookNamesCachePath = (cacheDir: string = getDefaultCacheDir()) => {
  return `${cacheDir}/book-names.json`;
};

export const saveBookNames = async (
  bookNames: BookNames,
  cacheDir: string = getDefaultCacheDir()
) => {
  await writeJsonFile(
    getBookNamesCachePath(cacheDir),
    JSON.stringify(bookNames, null, 2)
  );
};

export const cleanBookNamesCache = (
  bookNames: BookNames,
  timestamp?: Date,
  maxCacheAgeDays = getDefaultMaxCacheAgeDays()
): [BookNames, boolean] => {
  if (!maxCacheAgeDays || maxCacheAgeDays < 0) {
    return [bookNames, false];
  }

  const thresholdDate = getThresholdDate(maxCacheAgeDays, timestamp);

  const cleanedBookNames: BookNames = {};
  let removedRecords = false;

  for (const [bookName, bookNameReferences] of Object.entries(bookNames)) {
    const updatedBookNameReferences = bookNameReferences.filter(
      bookNameReference => bookNameReference.cachedOn > thresholdDate
    );
    if (updatedBookNameReferences.length === 0) {
      removedRecords = true;
      continue;
    }

    cleanedBookNames[bookName] = updatedBookNameReferences;
  }
  return [cleanedBookNames, removedRecords];
};

export const loadBookNames = async (
  cacheDir: string = getDefaultCacheDir()
): Promise<BookNames> => {
  try {
    const jsonData = await fs.readFile(
      getBookNamesCachePath(cacheDir),
      'utf-8'
    );
    return JSON.parse(jsonData, dateReviver) as BookNames;
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

export const prepareBookNames = (
  bookResponses: BookResponse[]
): BookNameDetails[] => {
  const bookDetailsArray: BookNameDetails[] = [];
  const allowedBooks = Object.keys(BOOK_IDs) as (keyof typeof BOOK_IDs)[];
  for (const bookResponse of bookResponses) {
    const bookID = bookResponse.id as keyof typeof BOOK_IDs;
    if (!allowedBooks.includes(bookID)) {
      continue;
    }
    const bookDetail: BookNameDetails = {
      name: normalizeBookName(bookResponse.name),
      isAbbreviation: false,
      id: bookID,
    };

    if (bookDetail.id !== bookDetail.name) {
      bookDetailsArray.push(bookDetail);
    }
  }
  return bookDetailsArray;
};
