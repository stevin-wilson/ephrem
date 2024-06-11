// - - - - - - - - - -
// Bibles and Chapter -> Verses

import {cleanUpOldRecords, defaultCacheDir, writeJsonFile} from '../utils.js';
import {
  BibleAndBook,
  BibleAndChapter,
  Bibles,
  BiblesToBooks,
  BooksInBible,
  BooksToChapters,
  ChaptersInBook,
  ChaptersToVerses,
  ChapterToFetchVerses,
  VerseID,
  VerseResponse,
  VersesInChapter,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {getBibleAndBookString} from './books-chapters.js';
import {fetchVerses} from './api-bible.js';

export const getBibleAndChapterString = (
  bibleAbbreviation: string,
  chapterID: string
) => `${bibleAbbreviation}@${chapterID}`;

const getChaptersToVersesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/chapters-to-verses.json`;
};

// serialize the ChaptersToVerses map to JSON
const serializeChaptersToVerses = (
  chaptersToVerses: ChaptersToVerses
): string => {
  const obj = Array.from(chaptersToVerses.entries()).map(
    ([bibleAndChapter, value]) => ({
      bibleAndChapter: bibleAndChapter,
      verses: value.verses,
      cachedOn: value.cachedOn.toISOString(),
    })
  );
  return JSON.stringify(obj, null, 2);
};

export const saveChaptersToVerses = async (
  chaptersToVerses: ChaptersToVerses,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getChaptersToVersesCachePath(cacheDir),
    serializeChaptersToVerses(chaptersToVerses)
  );
};

// deserialize JSON back to a ChaptersToVerses map
const deserializeChaptersToVerses = (jsonData: string): ChaptersToVerses => {
  const arr = JSON.parse(jsonData);
  const map: ChaptersToVerses = new Map();

  arr.forEach((item: any) => {
    const key: BibleAndChapter = item.bibleAndChapter;
    const value: VersesInChapter = {
      verses: item.verses,
      cachedOn: new Date(item.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

export const loadChaptersToVerses = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number
): Promise<ChaptersToVerses> => {
  try {
    const jsonData = await fs.readFile(
      getChaptersToVersesCachePath(cacheDir),
      'utf-8'
    );
    const chaptersToVerses = deserializeChaptersToVerses(jsonData);
    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanUpOldRecords(chaptersToVerses, maxAgeDays);
    } else {
      return chaptersToVerses;
    }
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as ChaptersToVerses;
  }
};

// - - - - - - - - - -
const getVerseIDs = (verseResponses: VerseResponse[]): VersesInChapter => {
  const versesIDs: VerseID[] = [];
  const currentDateTime = new Date();

  for (const verseResponse of verseResponses) {
    versesIDs.push(verseResponse.id);
  }

  return {verses: versesIDs, cachedOn: currentDateTime};
};

// - - - - - - - - - -

export const updateVerses = async (
  chaptersToFetchVerses: ChapterToFetchVerses[],
  chaptersToVerses: ChaptersToVerses,
  bibles: Bibles,
  biblesToBooks: BiblesToBooks,
  booksToChapters: BooksToChapters,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  for (const chapterToFetchVerses of chaptersToFetchVerses) {
    const bibleAbbreviation = chapterToFetchVerses.bibleAbbreviation;

    const bibleAndChapter: BibleAndChapter = getBibleAndChapterString(
      bibleAbbreviation,
      chapterToFetchVerses.chapterID
    );

    if (chaptersToVerses.get(bibleAndChapter)?.verses) {
      continue;
    }

    const bibleID = bibles.get(bibleAbbreviation)?.id;
    if (!bibleID) {
      throw Error;
    }

    if (!biblesToBooks.has(bibleAbbreviation)) {
      throw Error;
    }

    const booksInBible: BooksInBible | undefined =
      biblesToBooks.get(bibleAbbreviation);

    if (booksInBible === undefined) {
      throw Error;
    }

    if (!booksInBible.books.includes(chapterToFetchVerses.bookID)) {
      throw Error;
    }

    const bibleAndBook: BibleAndBook = getBibleAndBookString(
      bibleAbbreviation,
      chapterToFetchVerses.bookID
    );

    const chaptersInBook: ChaptersInBook | undefined =
      booksToChapters.get(bibleAndBook);

    if (chaptersInBook === undefined) {
      throw Error;
    }

    if (!chaptersInBook.chapters.includes(chapterToFetchVerses.chapterID)) {
      throw Error;
    }

    const versesInChapter: VersesInChapter = getVerseIDs(
      await fetchVerses(chapterToFetchVerses.chapterID, bibleID, config)
    );

    chaptersToVerses.set(bibleAndChapter, versesInChapter);
  }
};
