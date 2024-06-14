import {
  dateReviver,
  defaultCacheDir,
  getThresholdDate,
  removePeriod,
  writeJsonFile,
} from '../utils.js';
import {
  Bible,
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
/**
 * Retrieves the path to the cache file for storing book names.
 * @param [cacheDir] - The directory where the cache file is stored. Defaults to the default cache directory.
 * @returns - The full path to the cache file for storing book names.
 */
const getBookNamesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/book-names.json`;
};

// - - - - - - - - - -
// serialize the BookNames map to JSON
/**
 * Saves the book names to a cache file.
 * @param bookNames - The book names to be saved.
 * @param [cacheDir] - The directory where the cache file will be saved. Defaults to the default cache directory.
 * @returns - Resolves with no value on successful saving of the book names.
 */
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
/**
 * Removes expired book name references from the cache.
 * @param bookNames - The cache of book names and their references.
 * @param [maxAgeDays] - The maximum age of references to keep in days.
 * @param [currentTimestamp] - The current timestamp to calculate the threshold date.
 * @returns - The cleaned cache of book names without expired references.
 */
const cleanBookNamesCache = (
  bookNames: BookNames,
  maxAgeDays = 14,
  currentTimestamp?: Date
): BookNames => {
  const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);

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

/**
 * Loads the book names from the cache directory.
 * @param [cacheDir] - The cache directory path.
 * @param [maxAgeDays] - The maximum age of the cache in days. If provided,
 *    the cache will be cleaned before returning the book names.
 * @param [currentTimestamp] - The current timestamp to compare against
 *    the cache age. If not provided, the current date and time will be used.
 * @returns - A promise that resolves to the loaded book names.
 * @throws {Error} - If there is an error reading or parsing the JSON file.
 */
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
    const bookNames = JSON.parse(jsonData, dateReviver) as BookNames;

    return typeof maxAgeDays === 'number' && maxAgeDays >= 0
      ? cleanBookNamesCache(bookNames, maxAgeDays, currentTimestamp)
      : bookNames;
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
/**
 * Retrieves an array of book names, based on the provided book responses.
 * @param bookResponses - An array of book responses.
 * @returns - An array of book name details.
 */
export const getBookNames = (
  bookResponses: BookResponse[]
): BookNameDetails[] => {
  const bookDetailsArray: BookNameDetails[] = [];
  const allowedBooks = Object.keys(books) as (keyof typeof books)[];
  for (const bookResponse of bookResponses) {
    const bookID = bookResponse.id as keyof typeof books;
    console.log(bookID);
    if (!allowedBooks.includes(bookID)) {
      continue;
    }
    const bookDetail: BookNameDetails = {
      name: removePeriod(bookResponse.name).toLowerCase(),
      isAbbreviation: false,
      id: bookID,
    };

    if (bookDetail.id !== bookDetail.name) {
      bookDetailsArray.push(bookDetail);
    }
  }
  console.log(bookDetailsArray);
  return bookDetailsArray;
};

/**
 * Checks if the book details in the given bookIdWithLanguage match the details in the bookNameReference.
 * @param bookIdWithLanguage - The book ID and language details.
 * @param bookNameReference - The book name reference details.
 * @returns - Returns true if the book details match, false otherwise.
 */
const bookNameDetailsMatchReference = (
  bookIdWithLanguage: BookIdWithLanguage,
  bookNameReference: BookNameReference
): boolean => {
  return (
    bookIdWithLanguage.id === bookNameReference.id &&
    bookIdWithLanguage.language === bookNameReference.language &&
    bookIdWithLanguage.scriptDirection === bookNameReference.scriptDirection &&
    bookIdWithLanguage.isAbbreviation === bookNameReference.isAbbreviation
  );
};

/**
 * Updates the book names in the cache based on the provided languages.
 * @param languages - The list of ISO 639-3 three digit language codes to update the book names for.
 * @param cache - The cache object.
 * @param [config] - The Axios request configuration.
 * @param [timestamp] - The timestamp for the cache update.
 * @returns - A Promise that resolves once the book names are updated in the cache.
 */
export const updateBookNames = async (
  languages: string[],
  cache: Cache,
  config: AxiosRequestConfig = {},
  timestamp = new Date()
): Promise<void> => {
  const handleBookReferences = async (
    bibleAbbreviation: string,
    bible: Bible,
    bookNamesFromBible: BookNameDetails[]
  ) => {
    for (const bookNameDetails of bookNamesFromBible) {
      let bookReferences = cache.bookNames[bookNameDetails.name];
      const thisBookIdWithLanguage: BookIdWithLanguage = {
        id: bookNameDetails.id,
        language: bible.language,
        scriptDirection: bible.scriptDirection,
        isAbbreviation: bookNameDetails.isAbbreviation,
      };
      if (bookReferences === undefined || bookReferences.length === 0) {
        bookReferences = [
          {
            ...thisBookIdWithLanguage,
            bibles: [bibleAbbreviation],
            cachedOn: timestamp,
          },
        ];
      } else {
        const matched = bookReferences.some(bookReference => {
          const referenceMatches = bookNameDetailsMatchReference(
            thisBookIdWithLanguage,
            bookReference
          );
          if (
            referenceMatches ||
            bookReference.bibles.includes(bibleAbbreviation)
          ) {
            if (referenceMatches) bookReference.bibles.push(bibleAbbreviation);
            return true;
          }
          // If no condition matches, return false
          return false;
        });
        if (!matched) {
          bookReferences.push({
            ...thisBookIdWithLanguage,
            bibles: [bibleAbbreviation],
            cachedOn: timestamp,
          });
        }
      }
      cache.bookNames[bookNameDetails.name] = bookReferences;
    }
  };

  // Create an array of promises to be resolved concurrently
  const updatePromises = Object.entries(cache.bibles)
    .filter(([, bible]) => languages.includes(bible.language))
    .map(async ([bibleAbbreviation, bible]) => {
      const bookResponses = await fetchBooks(bible.id, config);
      const bookNamesFromBible = getBookNames(bookResponses);
      await handleBookReferences(bibleAbbreviation, bible, bookNamesFromBible);
    });

  await Promise.all(updatePromises);
  cache.updatedSinceLoad = true;
};
