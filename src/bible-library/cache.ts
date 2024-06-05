// - - - - - - - - - -
import {
  Bibles,
  BiblesToBooks,
  BookName,
  BookNameDetailsWithDirection,
  BookNames,
  BookResponse,
  BooksInBible,
  BooksToChapters,
  Cache,
  ChaptersInBook,
  ChaptersToVerses,
  ChapterToFetchVerses,
  Passage,
  PassageOptions,
  PassageQuery,
  Passages,
  Reference,
  ScriptDirection,
} from '../types.js';
import {AxiosRequestConfig} from 'axios';
import {loadBibles, saveBibles, updateBibles} from './bibles.js';
import {getBookNames, loadBookNames, saveBookNames} from './book-names.js';
import {
  getBibleAndBookString,
  getBookIDs,
  getChapterIDs,
  loadBiblesToBooks,
  loadBooksToChapters,
  saveBiblesToBooks,
  saveBooksToChapters,
} from './books-chapters.js';
import {defaultCacheDir} from '../utils.js';
import {
  getBibleAndChapterString,
  loadChaptersToVerses,
  saveChaptersToVerses,
  updateVerses,
} from './verses.js';
import {
  getStringForPassageQuery,
  loadPassages,
  savePassages,
  updatePassage,
} from './passages.js';
import {fetchBooksAndChapters} from './api-bible.js';

// - - - - - - - - - -
export const loadCache = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays = 14
): Promise<Cache> => {
  const bibles: Bibles = await loadBibles(cacheDir, maxAgeDays);
  const bookNames: BookNames = await loadBookNames(cacheDir, maxAgeDays);
  const biblesToBooks: BiblesToBooks = await loadBiblesToBooks(
    cacheDir,
    maxAgeDays
  );
  const booksToChapters: BooksToChapters = await loadBooksToChapters(
    cacheDir,
    maxAgeDays
  );
  const chaptersToVerses: ChaptersToVerses = await loadChaptersToVerses(
    cacheDir,
    maxAgeDays
  );
  const passages: Passages = await loadPassages(cacheDir, maxAgeDays);

  return {
    bibles,
    bookNames,
    biblesToBooks,
    booksToChapters,
    chaptersToVerses,
    passages,
  };
};

// - - - - - - - - - -
export const saveCache = async (
  cache: Cache,
  cacheDir: string = defaultCacheDir
): Promise<void> => {
  if (cache.bibles.size > 0) {
    try {
      await saveBibles(cache.bibles, cacheDir);
    } catch (error) {
      console.error('Error saving bibles to cache', error);
    }
  }
  console.log([...cache.bookNames.entries()]);
  if (cache.bookNames.size > 0) {
    try {
      await saveBookNames(cache.bookNames, cacheDir);
    } catch (error) {
      console.error('Error saving bookNames to cache', error);
    }
  }

  if (cache.biblesToBooks.size > 0) {
    try {
      await saveBiblesToBooks(cache.biblesToBooks, cacheDir);
    } catch (error) {
      console.error('Error saving biblesToBooks to cache', error);
    }
  }

  if (cache.booksToChapters.size > 0) {
    try {
      await saveBooksToChapters(cache.booksToChapters, cacheDir);
    } catch (error) {
      console.error('Error saving booksToChapters to cache', error);
    }
  }

  if (cache.chaptersToVerses.size > 0) {
    try {
      await saveChaptersToVerses(cache.chaptersToVerses, cacheDir);
    } catch (error) {
      console.error('Error saving chaptersToVerses to cache', error);
    }
  }

  if (cache.passages.size > 0) {
    try {
      await savePassages(cache.passages, cacheDir);
    } catch (error) {
      console.error('Error saving passages to cache', error);
    }
  }
};

// - - - - - - - - - -
const clearCache = (cache: Cache): void => {
  cache.bibles.clear();
  cache.biblesToBooks.clear();
  cache.booksToChapters.clear();
  cache.chaptersToVerses.clear();
  cache.passages.clear();
};

// - - - - - - - - - -
const getLanguageofBible = (
  bibleAbbreviation: string,
  bibles: Bibles
): string => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.language.id.toLowerCase();
};

// - - - - - - - - - -
const getScriptDirectionOfBible = (
  bibleAbbreviation: string,
  bibles: Bibles
): ScriptDirection => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.language.scriptDirection;
};

// - - - - - - - - - -
const getLocalNameOfBible = (
  bibleAbbreviation: string,
  bibles: Bibles
): string => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.nameLocal;
};

// - - - - - - - - - -
const isSupportedBook = (
  bibleAbbreviation: string,
  bookID: string,
  biblesToBooks: BiblesToBooks
): boolean => {
  const booksInBible = biblesToBooks.get(bibleAbbreviation);
  if (!booksInBible) {
    throw Error;
  }
  return booksInBible.books.includes(bookID);
};

// - - - - - - - - - -
const isSupportedChapter = (
  bibleAbbreviation: string,
  bookID: string,
  chapterID: string,
  booksToChapters: BooksToChapters
): boolean => {
  const chaptersInBook = booksToChapters.get(
    getBibleAndBookString(bibleAbbreviation, bookID)
  );
  if (!chaptersInBook) {
    throw Error;
  }
  return chaptersInBook.chapters.includes(chapterID);
};

// - - - - - - - - - -
const isSupportedVerse = (
  bibleAbbreviation: string,
  chapterID: string,
  verseID: string,
  chaptersToVerses: ChaptersToVerses
): boolean => {
  const versesInChapter = chaptersToVerses.get(
    getBibleAndChapterString(bibleAbbreviation, chapterID)
  );
  if (!versesInChapter) {
    throw Error;
  }
  return versesInChapter.verses.includes(verseID);
};

// - - - - - - - - - -
const chaptersInCorrectOrder = (
  bibleAbbreviation: string,
  bookID: string,
  startChapterID: string,
  endChapterID: string,
  booksToChapters: BooksToChapters
): boolean => {
  const chaptersInBook = booksToChapters.get(
    getBibleAndBookString(bibleAbbreviation, bookID)
  );
  if (!chaptersInBook) {
    throw Error;
  }
  return chaptersInBook.chapters
    .slice(chaptersInBook.chapters.indexOf(startChapterID))
    .includes(endChapterID);
};

// - - - - - - - - - -
const versesInCorrectOrder = (
  bibleAbbreviation: string,
  chapterID: string,
  startVerseID: string,
  endVerseID: string,
  chaptersToVerses: ChaptersToVerses
): boolean => {
  const versesInChapter = chaptersToVerses.get(
    getBibleAndChapterString(bibleAbbreviation, chapterID)
  );
  if (!versesInChapter) {
    throw Error;
  }
  return versesInChapter.verses
    .slice(versesInChapter.verses.indexOf(startVerseID))
    .includes(endVerseID);
};

// - - - - - - - - - -
const getPassage = async (
  passageID: string,
  bibleAbbreviation: string,
  passages: Passages,
  bibles: Bibles,
  passageOptions: PassageOptions = {},
  config?: AxiosRequestConfig
): Promise<Passage> => {
  const passageQuery: PassageQuery = {
    passageID,
    bibleAbbreviation,
    ...passageOptions,
  };

  const passageQueryString = getStringForPassageQuery(passageQuery);

  if (passages.get(passageQueryString) === undefined) {
    await updatePassage(
      passageID,
      bibleAbbreviation,
      passages,
      bibles,
      passageOptions,
      config
    );
  }

  const passage = passages.get(passageQueryString);
  if (passage === undefined) {
    throw Error;
  }

  return passage;
};

// - - - - - - - - - -
export const prepareCacheForReferenceSearch = async (
  languages: string[],
  bookNames: BookNames,
  biblesToBooks: BiblesToBooks,
  booksToChapters: BooksToChapters,
  bibles: Bibles,
  updateBiblesFromAPI = false,
  skipIfLessThanNDays = 14,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  const languagesToUpdate: string[] = [];
  const latestUpdate: Map<(typeof languages)[number], Date> = new Map();
  languages.forEach(language =>
    latestUpdate.set(language, new Date(2000, 0, 0, 0, 0, 0, 0))
  );

  for (const bookNameDetails of bookNames.values()) {
    if (!languages.includes(bookNameDetails.language)) {
      continue;
    }

    if (
      bookNameDetails.cachedOn > latestUpdate.get(bookNameDetails.language)!
    ) {
      latestUpdate.set(bookNameDetails.language, bookNameDetails.cachedOn);
    }
  }

  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - skipIfLessThanNDays);

  for (const [language, languageLatestUpdate] of latestUpdate) {
    if (languageLatestUpdate < thresholdDate) {
      languagesToUpdate.push(language);
    }
  }

  if (updateBiblesFromAPI || languagesToUpdate.length !== 0) {
    await updateBibles(languagesToUpdate, bibles, config);
    for (const [bibleAbbreviation, bible] of bibles.entries()) {
      if (!languagesToUpdate.includes(bible.language.id)) {
        continue;
      }

      if (biblesToBooks.get(bibleAbbreviation) !== undefined) {
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
      console.log(bookNameDetailsArr);
      for (const bookNameDetails of bookNameDetailsArr) {
        const bookName: BookName = bookNameDetails.name;
        const bookNameDetailsWithDirection: BookNameDetailsWithDirection = {
          id: bookNameDetails.id,
          isAbbreviation: bookNameDetails.isAbbreviation,
          language: language,
          scriptDirection: scriptDirection,
          cachedOn: bookNameDetails.cachedOn,
        };
        bookNames.set(bookName, bookNameDetailsWithDirection);
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
  }
};

// - - - - - - - - - -
export const updateBooksAndChapters = async (
  bibleAbbreviations: string[],
  bookNames: BookNames,
  biblesToBooks: BiblesToBooks,
  booksToChapters: BooksToChapters,
  bibles: Bibles,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  for (const bibleAbbreviation of bibleAbbreviations) {
    const bible = bibles.get(bibleAbbreviation);
    if (bible === undefined) {
      throw Error;
    }

    const bibleID = bible.id;
    const language = bible.language.id;
    const scriptDirection = bible.language.scriptDirection;

    const booksAndChaptersResponses: BookResponse[] =
      await fetchBooksAndChapters(bibleID, config);

    const booksInBible: BooksInBible = getBookIDs(booksAndChaptersResponses);
    biblesToBooks.set(bibleAbbreviation, booksInBible);

    const bookNameDetailsArr = getBookNames(booksAndChaptersResponses);
    console.log(bookNameDetailsArr);
    for (const bookNameDetails of bookNameDetailsArr) {
      const bookName: BookName = bookNameDetails.name;
      const bookNameDetailsWithDirection: BookNameDetailsWithDirection = {
        id: bookNameDetails.id,
        isAbbreviation: bookNameDetails.isAbbreviation,
        language: language,
        scriptDirection: scriptDirection,
        cachedOn: bookNameDetails.cachedOn,
      };
      bookNames.set(bookName, bookNameDetailsWithDirection);
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

// - - - - - - - - - -
const prepareCacheForValidation = async (
  references: Reference[],
  cache: Cache,
  config: AxiosRequestConfig = {}
) => {
  const biblesToCheck = Array.from(new Set(references.map(ref => ref.bible)));
  const missingBibles: string[] = [];

  biblesToCheck.forEach(bibleAbbreviation => {
    if (cache.bibles.get(bibleAbbreviation) === undefined) {
      missingBibles.push(bibleAbbreviation);
    }
  });

  if (missingBibles.length !== 0) {
    await updateBooksAndChapters(
      missingBibles,
      cache.bookNames,
      cache.biblesToBooks,
      cache.booksToChapters,
      cache.bibles,
      config
    );
  }

  const chaptersToFetchVerses: ChapterToFetchVerses[] = [];
  for (const reference of references) {
    if (reference.verseStart !== undefined) {
      chaptersToFetchVerses.push({
        bibleAbbreviation: reference.bible,
        bookID: reference.book,
        chapterID: reference.chapterStart,
      });
    }

    if (
      reference.verseEnd !== undefined &&
      reference.chapterEnd !== undefined
    ) {
      chaptersToFetchVerses.push({
        bibleAbbreviation: reference.bible,
        bookID: reference.book,
        chapterID: reference.chapterEnd,
      });
    } else if (reference.verseEnd !== undefined) {
      chaptersToFetchVerses.push({
        bibleAbbreviation: reference.bible,
        bookID: reference.book,
        chapterID: reference.chapterStart,
      });
    }
  }

  updateVerses(
    chaptersToFetchVerses,
    cache.chaptersToVerses,
    cache.bibles,
    cache.biblesToBooks,
    cache.booksToChapters,
    config
  );
};
