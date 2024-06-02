// - - - - - - - - - -
// Bibles -> Books
import {
  BibleAbbreviation,
  BibleAndBook,
  BookID,
  defaultCacheDir,
  cleanUpOldRecords,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';
import {
  BookResponse,
  ChapterResponse,
  fetchBooksAndChapters,
} from './api-bible.js';
import {AxiosRequestConfig} from 'axios';
import {bibles} from './bibles.js';

// - - - - - - - - - -

const biblesToBooksCache = `${defaultCacheDir}/bibles-to-books.json`;

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

const saveBiblesToBooks = async (
  biblesToBooks: BiblesToBooks,
  filePath: string = biblesToBooksCache
) => {
  await writeJsonFile(filePath, serializeBiblesToBooks(biblesToBooks));
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

const loadBiblesToBooks = async (
  filePath: string = biblesToBooksCache,
  max_age_days = 14
): Promise<BiblesToBooks> => {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return cleanUpOldRecords(deserializeBiblesToBooks(jsonData), max_age_days);
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

export const biblesToBooks: BiblesToBooks = await loadBiblesToBooks();

// - - - - - - - - - -
// - - - - - - - - - -
// Bibles and Books -> Chapter

export const getBibleAndBookString = (
  bibleAbbreviation: string,
  bookID: string
) => `${bibleAbbreviation}@${bookID}`;

const booksToChaptersCache = `${defaultCacheDir}/books-to-chapters.json`;

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

const saveBooksToChapters = async (
  booksToChapters: BooksToChapters,
  filePath: string = booksToChaptersCache
) => {
  await writeJsonFile(filePath, serializeBooksToChapters(booksToChapters));
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

const loadBooksToChapters = async (
  filePath: string = booksToChaptersCache,
  max_age_days = 14
): Promise<BooksToChapters> => {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return cleanUpOldRecords(
      deserializeBooksToChapters(jsonData),
      max_age_days
    );
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

export const booksToChapters: BooksToChapters = await loadBooksToChapters();
// - - - - - - - - - -
const getBookIDs = (bookResponses: BookResponse[]): BooksInBible => {
  const books: BookID[] = [];

  for (const bookResponse of bookResponses) {
    books.push(bookResponse.id);
  }

  return {books, cachedOn: new Date()};
};

// - - - - - - - - - -
const getChapterIDs = (chapterResponses: ChapterResponse[]): ChaptersInBook => {
  const chapters: ChapterID[] = [];

  for (const chapterResponse of chapterResponses) {
    if (chapterResponse.number === 'intro') {
      continue;
    }

    chapters.push(chapterResponse.id);
  }

  return {chapters, cachedOn: new Date()};
};

// - - - - - - - - - -
async function updateBooksAndChapters(
  bibleAbbreviations: string[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const bibleAbbreviation of bibleAbbreviations) {
    const bibleID = bibles.get(bibleAbbreviation)?.id;
    if (!bibleID) {
      console.log(bibles.keys());
      throw Error;
    }

    const booksAndChaptersResponses: BookResponse[] =
      await fetchBooksAndChapters(bibleID, config);

    const booksInBible: BooksInBible = getBookIDs(booksAndChaptersResponses);

    biblesToBooks.set(bibleAbbreviation, booksInBible);

    for (const bookResponse of booksAndChaptersResponses) {
      const bookID = bookResponse.id;
      const chaptersInBook: ChaptersInBook = getChapterIDs(
        bookResponse.chapters
      );
      booksToChapters.set(
        getBibleAndBookString(bibleAbbreviation, bookID),
        chaptersInBook
      );
    }
  }
}
