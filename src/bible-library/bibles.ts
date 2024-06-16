// - - - - - - - - - -
import {AxiosRequestConfig} from 'axios';
import {defaultConfig, fetchBibles, fetchBooks} from './api-bible.js';
import {
  dateReviver,
  defaultBiblesToExclude,
  defaultCacheDir,
  defaultLanguages,
  getThresholdDate,
  removePeriod,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';
import {
  Bible,
  BibleResponse,
  Bibles,
  BiblesCache,
  BookIdWithLanguage,
  BookNameDetails,
  BookNameReference,
  BookNames,
  BookResponse,
} from '../types.js';
import {books} from '../books.js';

// - - - - - - - - - -
//  Abbreviation -> Bible

/**
 * Returns the cache path for bibles.
 * @param cacheDir - The directory where the cache is stored. Defaults to defaultCacheDir if not specified.
 * @returns - The cache path for bibles.
 */
const getBiblesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/bibles.json`;
};

// - - - - - - - - - -
/**
 * Saves the Bibles object to the specified cache directory in JSON format.
 * If no cache directory is provided, the default cache directory will be used.
 * @param bibles - The Bibles object to be saved.
 * @param [cacheDir] - The cache directory path.
 * @returns - A Promise that resolves when the Bibles object is successfully saved.
 */
export const saveBibles = async (
  bibles: Bibles,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBiblesCachePath(cacheDir),
    JSON.stringify(bibles, null, 2)
  );
};

// - - - - - - - - - -
export const cleanBibles = (
  bibles: Bibles,
  currentTimestamp?: Date,
  maxAgeDays = 14
): [Bibles, boolean] => {
  const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);

  const cleanedBibles: Bibles = {};
  let removedRecords = false;

  for (const abbreviation of Object.keys(bibles)) {
    const bible = bibles[abbreviation];
    if (bible.cachedOn > thresholdDate) {
      cleanedBibles[abbreviation] = bible;
    } else {
      removedRecords = true;
    }
  }

  return [cleanedBibles, removedRecords];
};

// - - - - - - - - - -
/**
 * Loads the Bibles from the cache directory.
 * @param cacheDir - The cache directory path. Default value is defaultCacheDir.
 * @returns - A promise that resolves to the loaded Bibles.
 */
export const loadBibles = async (
  cacheDir: string = defaultCacheDir
): Promise<Bibles> => {
  try {
    const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
    return JSON.parse(jsonData, dateReviver) as Bibles;
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return {} as Bibles;
  }
};

// - - - - - - - - - -
/**
 * Prepares bible data for caching.
 * @param bibleResponse - The response from the bible API.
 * @param timestamp - The current timestamp.
 * @returns The prepared bible data for caching.
 */
export const prepareBibleData = (
  bibleResponse: BibleResponse,
  timestamp: Date
) => {
  const {id, abbreviation, language} = bibleResponse;
  return {
    [abbreviation]: {
      id,
      language: language.id,
      scriptDirection: language.scriptDirection,
      cachedOn: timestamp,
    },
  };
};

// - - - - - - - - - -
export const updateBibles = async (
  biblesCache?: BiblesCache,
  languages: string[] = defaultLanguages,
  biblesToExclude: string[] = defaultBiblesToExclude,
  config: AxiosRequestConfig = defaultConfig,
  timestamp: Date = new Date()
): Promise<void> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  for (const language of languages) {
    const bibleResponses: BibleResponse[] = await fetchBibles(language, config);
    bibleResponses
      .filter(
        bibleResponse => !biblesToExclude.includes(bibleResponse.abbreviation)
      )
      .forEach(bibleResponse => {
        Object.assign(
          biblesCache.bibles,
          prepareBibleData(bibleResponse, timestamp)
        );
      });
  }
  biblesCache.updatedSinceLoad = true;
};

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
export const cleanBookNamesCache = (
  bookNames: BookNames,
  currentTimestamp?: Date,
  maxAgeDays = 14
): [BookNames, boolean] => {
  const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);

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
  cacheDir: string = defaultCacheDir
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
 * Updates the book names in the biblesCache based on the provided languages.
 * @param languages - The list of ISO 639-3 three digit language codes to update the book names for.
 * @param biblesCache - The biblesCache object.
 * @param [config] - The Axios request configuration.
 * @param [timestamp] - The timestamp for the biblesCache update.
 * @returns - A Promise that resolves once the book names are updated in the biblesCache.
 */
export const updateBookNames = async (
  biblesCache?: BiblesCache,
  languages: string[] = defaultLanguages,
  config: AxiosRequestConfig = defaultConfig,
  timestamp = new Date()
): Promise<void> => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  const handleBookReferences = async (
    bibleAbbreviation: string,
    bible: Bible,
    bookNamesFromBible: BookNameDetails[]
  ) => {
    for (const bookNameDetails of bookNamesFromBible) {
      let bookReferences = biblesCache.bookNames[bookNameDetails.name];
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
      biblesCache.bookNames[bookNameDetails.name] = bookReferences;
    }
  };

  // Create an array of promises to be resolved concurrently
  const updatePromises = Object.entries(biblesCache.bibles)
    .filter(([, bible]) => languages.includes(bible.language))
    .map(async ([bibleAbbreviation, bible]) => {
      const bookResponses = await fetchBooks(bible.id, config);
      const bookNamesFromBible = getBookNames(bookResponses);
      await handleBookReferences(bibleAbbreviation, bible, bookNamesFromBible);
    });

  await Promise.all(updatePromises);
  biblesCache.updatedSinceLoad = true;
};

// - - - - - - - - - -
export const loadBiblesCache = async (
  cacheDir: string = defaultCacheDir,
  currentTimestamp = new Date(),
  maxAgeDays: number | undefined = 14
): Promise<BiblesCache> => {
  let bibles: Bibles = await loadBibles(cacheDir);
  let bookNames: BookNames = await loadBookNames(cacheDir);
  let updatedBiblesSinceLoad = false;
  let updatedBookNamesSinceLoad = false;

  if (maxAgeDays !== undefined && maxAgeDays >= 0) {
    [bibles, updatedBiblesSinceLoad] = cleanBibles(
      bibles,
      currentTimestamp,
      maxAgeDays
    );

    [bookNames, updatedBookNamesSinceLoad] = cleanBookNamesCache(
      bookNames,
      currentTimestamp,
      maxAgeDays
    );
  }

  const updatedSinceLoad = updatedBiblesSinceLoad || updatedBookNamesSinceLoad;

  return {
    bibles,
    bookNames,
    updatedSinceLoad,
  };
};

// - - - - - - - - - -
/**
 * Saves the BiblesCache data to the specified biblesCache directory.
 * @param biblesCache - The BiblesCache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the biblesCache data will be saved.
 * @returns - A promise that resolves when the biblesCache data is successfully saved, or rejects with an error if saving fails.
 */
export const saveBiblesCache = async (
  biblesCache: BiblesCache,
  cacheDir: string = defaultCacheDir
): Promise<void> => {
  if (!biblesCache.updatedSinceLoad) {
    return;
  }

  let savedAll = true;
  try {
    await saveBibles(biblesCache.bibles, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving bibles to biblesCache', error);
  }

  try {
    await saveBookNames(biblesCache.bookNames, cacheDir);
  } catch (error) {
    savedAll = false;
    console.error('Error saving bookNames to biblesCache', error);
  }

  if (savedAll) {
    biblesCache.updatedSinceLoad = false;
  }
};

// - - - - - - - - - -
/**
 * Updates the biblesCache with new data for specified languages.
 * @async
 * @param biblesCache - The biblesCache object to update.
 * @param languages - The list of ISO 639-3 three digit language codes to update in the biblesCache.
 * @param biblesToExclude - The list of bibles to exclude from the update. Optional.
 * @param config - Additional configuration options for the update request. Optional.
 * @param forceUpdate - Flag indicating whether to force the update for all languages. Default is false.
 * @returns - A promise that resolves when the biblesCache is updated.
 */
export const updateBiblesCache = async (
  biblesCache?: BiblesCache,
  languages: string[] = defaultLanguages,
  biblesToExclude: string[] = defaultBiblesToExclude,
  config: AxiosRequestConfig = defaultConfig,
  forceUpdate = false
) => {
  if (biblesCache === undefined) {
    biblesCache = await loadBiblesCache();
  }

  let languagesToUpdate = languages;
  if (!forceUpdate) {
    languagesToUpdate = languages.filter(
      language => !languageInBiblesCache(language, biblesCache)
    );
  }

  if (languagesToUpdate.length !== 0) {
    const timestamp = new Date();
    await updateBibles(
      biblesCache,
      languagesToUpdate,
      biblesToExclude,
      config,
      timestamp
    );

    await updateBookNames(biblesCache, languagesToUpdate, config, timestamp);

    biblesCache.updatedSinceLoad = true;
  }
};

// - - - - - - - - - -
/**
 * Checks if any bible in the given list has the specified language.
 * @param language - The ISO 639-3 three digit language code to be checked.
 * @param bibles - The list of bibles to search in.
 * @returns - True if any bible in the list has the specified language, false otherwise.
 */
const languageInBibles = (language: string, bibles: Bibles): boolean => {
  return Object.values(bibles).some(bible => bible.language === language);
};

// - - - - - - - - - -
/**
 * Checks if the given book names have the specified language.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param bookNames - The book names to search through.
 * @returns - True if the book names have the specified language, false otherwise.
 */
const languageInBookNames = (
  language: string,
  bookNames: BookNames
): boolean => {
  for (const bookReferences of Object.values(bookNames)) {
    for (const bookReference of bookReferences) {
      if (bookReference.language === language) {
        return true;
      }
    }
  }
  return false;
};

// - - - - - - - - - -
/**
 * Checks if the given language is available in the biblesCache.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param biblesCache - The biblesCache object.
 * @returns - A boolean indicating if the language is available in the biblesCache.
 */
export const languageInBiblesCache = (
  language: string,
  biblesCache: BiblesCache
): boolean => {
  if (!languageInBibles(language, biblesCache.bibles)) {
    return false;
  }

  return languageInBookNames(language, biblesCache.bookNames);
};

export const needsBiblesCacheUpdate = (
  biblesCache: BiblesCache,
  bibleAbbreviation?: string,
  languages: string[] = defaultLanguages
): boolean => {
  let needToUpdateCache = false;
  if (bibleAbbreviation && !(bibleAbbreviation in biblesCache.bibles)) {
    needToUpdateCache = true;
  }

  const languagesToUpdate = languages.filter(
    language => !languageInBiblesCache(language, biblesCache)
  );

  if (languagesToUpdate.length > 0) {
    needToUpdateCache = true;
  }

  return needToUpdateCache;
};
