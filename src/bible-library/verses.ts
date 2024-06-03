// - - - - - - - - - -
// Bibles and Chapter -> Verses
import {
  BibleAndBook,
  defaultCacheDir,
  cleanUpOldRecords,
  writeJsonFile,
} from '../utils.js';
import fs from 'fs-extra';
import {fetchVerses, VerseResponse} from './api-bible.js';
import {AxiosRequestConfig} from 'axios';
import {bibles} from './bibles.js';
import {
  biblesToBooks,
  BooksInBible,
  booksToChapters,
  ChaptersInBook,
  getBibleAndBookString,
} from './books-chapters.js';

const getBibleAndChapterString = (
  bibleAbbreviation: string,
  chapterID: string
) => `${bibleAbbreviation}@${chapterID}`;

const chaptersToVersesCache = `${defaultCacheDir}/chapters-to-verses.json`;

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

const saveChaptersToVerses = async (
  chaptersToVerses: ChaptersToVerses,
  filePath: string = chaptersToVersesCache
) => {
  await writeJsonFile(filePath, serializeChaptersToVerses(chaptersToVerses));
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

const loadChaptersToVerses = async (
  filePath: string = chaptersToVersesCache,
  max_age_days = 14
): Promise<ChaptersToVerses> => {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return cleanUpOldRecords(
      deserializeChaptersToVerses(jsonData),
      max_age_days
    );
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

const chaptersToVerses: ChaptersToVerses = await loadChaptersToVerses();

// - - - - - - - - - -
const getVerseIDs = (verseResponses: VerseResponse[]): VersesInChapter => {
  const versesIDs: VerseID[] = [];

  for (const verseResponse of verseResponses) {
    versesIDs.push(verseResponse.id);
  }

  return {verses: versesIDs, cachedOn: new Date()};
};

// - - - - - - - - - -

async function updateVerses(
  chaptersToFetchVerses: ChapterToFetchVerses[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const chapterToFetchVerses of chaptersToFetchVerses) {
    const bibleAbbreviation = chapterToFetchVerses.bibleAbbreviation;

    const bibleAndChapter: BibleAndChapter = getBibleAndChapterString(
      bibleAbbreviation,
      chapterToFetchVerses.chapterID
    );

    console.log([...chaptersToVerses]);
    if (chaptersToVerses.get(bibleAndChapter)?.verses) {
      continue;
    }

    const bibleID = bibles.get(bibleAbbreviation)?.id;
    if (!bibleID) {
      throw Error;
    }

    if (!biblesToBooks.has(bibleAbbreviation)) {
      console.log(biblesToBooks.keys());
      throw Error;
    }

    const booksInBible: BooksInBible | undefined =
      biblesToBooks.get(bibleAbbreviation);

    if (booksInBible === undefined) {
      console.log(biblesToBooks.keys());
      throw Error;
    }

    if (!booksInBible.books.includes(chapterToFetchVerses.bookID)) {
      console.log(biblesToBooks.keys());
      throw Error;
    }

    const bibleAndBook: BibleAndBook = getBibleAndBookString(
      bibleAbbreviation,
      chapterToFetchVerses.bookID
    );

    const chaptersInBook: ChaptersInBook | undefined =
      booksToChapters.get(bibleAndBook);

    if (chaptersInBook === undefined) {
      console.log(`bibleAndBook: ${JSON.stringify(bibleAndBook)}`);
      console.log(`chaptersInBook: ${chaptersInBook}`);
      console.log(typeof booksToChapters);
      console.log(booksToChapters.entries());
      throw Error;
    }

    if (!chaptersInBook.chapters.includes(chapterToFetchVerses.chapterID)) {
      console.log(chaptersInBook.chapters);
      throw Error;
    }

    const versesInChapter: VersesInChapter = getVerseIDs(
      await fetchVerses(chapterToFetchVerses.chapterID, bibleID, config)
    );

    console.log(`versesInChapter: ${versesInChapter}`);
    chaptersToVerses.set(bibleAndChapter, versesInChapter);
  }
  console.log([...chaptersToVerses]);
}
