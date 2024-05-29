// - - - - - - - - - -
import {
  BibleResponse,
  BookResponse,
  ChapterResponse,
  fetchBibles,
  fetchBooksAndChapters,
  fetchVerses,
  Language,
  VerseResponse,
} from './fetch-bible.js';
import {AxiosRequestConfig} from 'axios';

// - - - - - - - - - -
interface BibleAndChapter {
  bibleAbbreviation: string;
  chapterID: string;
}

type VerseID = string; // GEN.1.1

interface VersesInChapter {
  verses: VerseID[];
  cachedOn: Date;
}

type ChaptersToVerses = Map<BibleAndChapter, VersesInChapter>;

const chaptersToVerses: ChaptersToVerses = new Map();

// - - - - - - - - - -
interface BibleAndBook {
  bibleAbbreviation: BibleAbbreviation;
  bookID: BookID;
}

type ChapterID = string; // GEN.1

interface ChaptersInBook {
  chapters: ChapterID[];
  cachedOn: Date;
}

type BooksToChapters = Map<BibleAndBook, ChaptersInBook>;

const booksToChapters: BooksToChapters = new Map();

// - - - - - - - - - -
type BibleAbbreviation = string; // NIV
type BookID = string; // NIV

interface BooksInBible {
  books: BookID[];
  cachedOn: Date;
}

type BiblesToBooks = Map<BibleAbbreviation, BooksInBible>;

const biblesToBooks: BiblesToBooks = new Map();

// - - - - - - - - - -

interface Bible {
  id: string;
  dblId: string;
  name: string;
  nameLocal: string;
  language: Language;
  cachedOn: Date;
}

type Bibles = Map<BibleAbbreviation, Bible>;

const bibles: Bibles = new Map();

// - - - - - - - - - -
const getVerseIDs = (verseResponses: VerseResponse[]): VersesInChapter => {
  const versesIDs: VerseID[] = [];

  for (const verseResponse of verseResponses) {
    versesIDs.push(verseResponse.id);
  }

  return {verses: versesIDs, cachedOn: new Date()};
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
const getBookIDs = (bookResponses: BookResponse[]): BooksInBible => {
  const books: BookID[] = [];

  for (const bookResponse of bookResponses) {
    books.push(bookResponse.id);
  }

  return {books, cachedOn: new Date()};
};

// - - - - - - - - - -
const removeOutdatedRecords = (
  cache: BiblesToBooks | BooksToChapters | Bibles | ChaptersToVerses,
  max_age_days: number
): void => {
  const now = new Date();
  const max_age = new Date(now.getTime() - max_age_days * 24 * 60 * 60 * 1000);
  for (const [key, value] of cache.entries()) {
    if (value.cachedOn < max_age) {
      // @ts-ignore
      cache.delete(key);
    }
  }
};

// - - - - - - - - - -
const removeOutdatedInformaion = (max_age_days: number) => {
  removeOutdatedRecords(biblesToBooks, max_age_days);
  removeOutdatedRecords(booksToChapters, max_age_days);
  removeOutdatedRecords(bibles, max_age_days);
  removeOutdatedRecords(chaptersToVerses, max_age_days);
};

// - - - - - - - - - -
const clearCache = (): void => {
  bibles.clear();
  biblesToBooks.clear();
  booksToChapters.clear();
  chaptersToVerses.clear();
};

// - - - - - - - - - -
async function updateBibles(
  languages: string[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const language of languages) {
    const bibleResponses: BibleResponse[] = await fetchBibles(language, config);

    for (const bibleResponse of bibleResponses) {
      const bibleObj: Bible = {
        id: bibleResponse.id,
        dblId: bibleResponse.dblId,
        name: bibleResponse.name,
        nameLocal: bibleResponse.nameLocal,
        language: bibleResponse.language,
        cachedOn: new Date(),
      };
      bibles.set(bibleResponse.abbreviation, bibleObj);
    }
  }
}

// - - - - - - - - - -
async function updateBooksAndChapters(
  bibleAbbreviations: string[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const abbreviation of bibleAbbreviations) {
    const bibleID = bibles.get(abbreviation)?.id;
    if (!bibleID) {
      throw Error;
    }

    const booksAndChaptersResponses: BookResponse[] =
      await fetchBooksAndChapters(bibleID, config);

    const booksInBible: BooksInBible = getBookIDs(booksAndChaptersResponses);

    biblesToBooks.set(abbreviation, booksInBible);

    for (const bookResponse of booksAndChaptersResponses) {
      const bookID = bookResponse.id;
      const chaptersInBook: ChaptersInBook = getChapterIDs(
        bookResponse.chapters
      );
      booksToChapters.set(
        {bibleAbbreviation: abbreviation, bookID},
        chaptersInBook
      );
    }
  }
}

// - - - - - - - - - -
interface ChapterToFetchVerses {
  bibleAbbreviation: string;
  bookID: string;
  chapterID: string;
}

async function updateVerses(
  chaptersToFetchVerses: ChapterToFetchVerses[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const chapterToFetchVerses of chaptersToFetchVerses) {
    const bibleID = bibles.get(chapterToFetchVerses.bibleAbbreviation)?.id;
    if (!bibleID) {
      throw Error;
    }

    if (!biblesToBooks.has(chapterToFetchVerses.bibleAbbreviation)) {
      throw Error;
    }

    const booksInBible: BooksInBible | undefined = biblesToBooks.get(
      chapterToFetchVerses.bibleAbbreviation
    );

    if (booksInBible === undefined) {
      throw Error;
    }

    if (!booksInBible.books.includes(chapterToFetchVerses.bookID)) {
      throw Error;
    }

    const bibleAndBook: BibleAndBook = {
      bibleAbbreviation: chapterToFetchVerses.bibleAbbreviation,
      bookID: chapterToFetchVerses.bookID,
    };

    const chaptersInBook: ChaptersInBook | undefined =
      booksToChapters.get(bibleAndBook);

    if (chaptersInBook === undefined) {
      throw Error;
    }

    if (!chaptersInBook.chapters.includes(chapterToFetchVerses.chapterID)) {
      throw Error;
    }

    const bibleAndChapter: BibleAndChapter = {
      bibleAbbreviation: chapterToFetchVerses.bibleAbbreviation,
      chapterID: chapterToFetchVerses.chapterID,
    };

    const versesInChapter: VersesInChapter = getVerseIDs(
      await fetchVerses(chapterToFetchVerses.chapterID, bibleID, config)
    );
    chaptersToVerses.set(bibleAndChapter, versesInChapter);
  }
}
