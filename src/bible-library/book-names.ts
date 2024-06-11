import {defaultCacheDir, removePeriod, writeJsonFile} from '../utils.js';
import {
  Bibles,
  BiblesToBooks,
  BookName,
  BookNameMoreDetails,
  BookNameReference,
  BookNames,
  BookResponse,
  BooksInBible,
  BooksToChapters,
  ChaptersInBook,
} from '../types.js';
import fs from 'fs-extra';
import {books} from '../books.js';
import {updateBibles} from './bibles.js';
import {AxiosRequestConfig} from 'axios';
import {fetchBooksAndChapters} from './api-bible.js';
import {
  getBibleAndBookString,
  getBookIDs,
  getChapterIDs,
} from './books-chapters.js';

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

  arr.forEach((item: any) => {
    const key: BookName = item.name;
    const value: BookNameReference[] = item.bookReferences;
    map.set(key, value);
  });

  return map;
};

export const loadBookNames = async (
  cacheDir: string = defaultCacheDir
): Promise<BookNames> => {
  try {
    const jsonData = await fs.readFile(
      getBookNamesCachePath(cacheDir),
      'utf-8'
    );
    return deserializeBookNames(jsonData);
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

// - - - - - - - - - -
export const updateBookNames = async (
  languages: string[],
  bookNames: BookNames,
  biblesToBooks: BiblesToBooks,
  booksToChapters: BooksToChapters,
  bibles: Bibles,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  await updateBibles(languages, bibles, config);
  for (const [bibleAbbreviation, bible] of bibles.entries()) {
    if (!languages.includes(bible.language.id)) {
      continue;
    }

    const bibleID = bible.id;
    const language = bible.language.id;
    const scriptDirection = bible.language.scriptDirection;

    const booksAndChaptersResponses: BookResponse[] =
      await fetchBooksAndChapters(bibleID, config);

    const booksInBible: BooksInBible = getBookIDs(booksAndChaptersResponses);
    biblesToBooks.set(bibleAbbreviation, booksInBible);

    const bookNameDetailsArr = getBookNames(booksAndChaptersResponses);
    for (const bookNameDetails of bookNameDetailsArr) {
      const bookReferences = bookNames.get(bookNameDetails.name);

      if (bookReferences === undefined) {
        bookNames.set(bookNameDetails.name, [
          {
            id: bookNameDetails.id,
            isAbbreviation: bookNameDetails.isAbbreviation,
            language: language,
            scriptDirection: scriptDirection,
            bibles: [bibleID],
          },
        ]);
      } else {
        let addedToBookNames = false;
        for (const bookReference of bookReferences) {
          if (bookReference.bibles.includes(bibleID)) {
            addedToBookNames = true;
            break;
          }

          if (bookReference.id !== bookNameDetails.id) {
            continue;
          }

          if (bookReference.language !== language) {
            continue;
          }

          if (bookReference.scriptDirection !== scriptDirection) {
            continue;
          }

          if (bookReference.isAbbreviation !== bookNameDetails.isAbbreviation) {
            continue;
          }

          bookReference.bibles.push(bibleID);
          addedToBookNames = true;
          break;
        }

        if (!addedToBookNames) {
          bookReferences.push({
            id: bookNameDetails.id,
            isAbbreviation: bookNameDetails.isAbbreviation,
            language: language,
            scriptDirection: scriptDirection,
            bibles: [bibleID],
          });
        }

        bookNames.set(bookNameDetails.name, bookReferences);
      }
    }

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
};
