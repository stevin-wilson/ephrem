import {cleanUpOldRecords, defaultCacheDir, writeJsonFile} from '../utils.js';
import {
  BibleAbbreviation,
  BibleAndBook,
  BiblesToBooks,
  BookID,
  BookResponse,
  BooksInBible,
  BooksInBibleWithoutTimestamp,
  BooksToChapters,
  ChapterID,
  ChapterResponse,
  ChaptersInBook,
  ChaptersInBookWithoutTimestamp,
} from '../types.js';
import fs from 'fs-extra';

// - - - - - - - - - -
//  Bible Abbreviation -> Book Names
const getBiblesToBooksCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/bibles-to-books.json`;
};

// serialize the BooksToChapters map to JSON
const serializeBiblesToBooks = (biblesToBooks: BiblesToBooks): string => {
  const obj = Array.from(biblesToBooks.entries()).map(
    ([bibleAbbreviation, value]) => ({
      bibleAbbreviation: bibleAbbreviation,
      books: value.books,
      cachedOn: value.cachedOn.toISOString(),
    })
  );
  return JSON.stringify(obj, null, 2);
};

export const saveBiblesToBooks = async (
  biblesToBooks: BiblesToBooks,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBiblesToBooksCachePath(cacheDir),
    serializeBiblesToBooks(biblesToBooks)
  );
};

// deserialize JSON back to a BooksToChapters map
const deserializeBiblesToBooks = (jsonData: string): BiblesToBooks => {
  const arr = JSON.parse(jsonData);
  const map: BiblesToBooks = new Map();

  arr.forEach((item: any) => {
    const key: BibleAbbreviation = item.bibleAbbreviation;
    const value: BooksInBible = {
      books: item.books,
      cachedOn: new Date(item.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

export const loadBiblesToBooks = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays = 14
): Promise<BiblesToBooks> => {
  try {
    const jsonData = await fs.readFile(
      getBiblesToBooksCachePath(cacheDir),
      'utf-8'
    );
    return cleanUpOldRecords(deserializeBiblesToBooks(jsonData), maxAgeDays);
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as BiblesToBooks;
  }
};

// - - - - - - - - - -
// Bibles and Books -> Chapter

export const getBibleAndBookString = (
  bibleAbbreviation: string,
  bookID: string
) => `${bibleAbbreviation}@${bookID}`;

const getBooksToChaptersCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/books-to-chapters.json`;
};

// serialize the BooksToChapters map to JSON
const serializeBooksToChapters = (booksToChapters: BooksToChapters): string => {
  const obj = Array.from(booksToChapters.entries()).map(
    ([bibleAndBook, value]) => ({
      bibleAndBook: bibleAndBook,
      chapters: value.chapters,
      cachedOn: value.cachedOn.toISOString(),
    })
  );
  return JSON.stringify(obj, null, 2);
};

export const saveBooksToChapters = async (
  booksToChapters: BooksToChapters,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getBooksToChaptersCachePath(cacheDir),
    serializeBooksToChapters(booksToChapters)
  );
};

// deserialize JSON back to a BooksToChapters map
const deserializeBooksToChapters = (jsonData: string): BooksToChapters => {
  const arr = JSON.parse(jsonData);
  const map: BooksToChapters = new Map();

  arr.forEach((item: any) => {
    const key: BibleAndBook = item.bibleAndBook;
    const value: ChaptersInBook = {
      chapters: item.chapters,
      cachedOn: new Date(item.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

export const loadBooksToChapters = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number
): Promise<BooksToChapters> => {
  try {
    const jsonData = await fs.readFile(
      getBooksToChaptersCachePath(cacheDir),
      'utf-8'
    );
    const booksToChapters = deserializeBooksToChapters(jsonData);
    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanUpOldRecords(booksToChapters, maxAgeDays);
    } else {
      return booksToChapters;
    }
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as BooksToChapters;
  }
};

// - - - - - - - - - -
export const getBookIDs = (
  bookResponses: BookResponse[]
): BooksInBibleWithoutTimestamp => {
  const books: BookID[] = [];

  for (const bookResponse of bookResponses) {
    books.push(bookResponse.id);
  }

  return {books};
};

// - - - - - - - - - -
export const getChapterIDs = (
  chapterResponses: ChapterResponse[]
): ChaptersInBookWithoutTimestamp => {
  const chapters: ChapterID[] = [];

  for (const chapterResponse of chapterResponses) {
    if (chapterResponse.number === 'intro') {
      continue;
    }

    chapters.push(chapterResponse.id);
  }

  return {chapters};
};
