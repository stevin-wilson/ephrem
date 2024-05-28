// - - - - - - - - - -
import {
  BibleResponse,
  BookResponse,
  fetchBibles,
  fetchBooksAndChapters,
  fetchVerses,
  Language,
  VerseResponse,
} from './fetch-bible.js';
import {AxiosRequestConfig} from 'axios';

type Verse = string; // GEN.1.1

// - - - - - - - - - -
interface Chapter {
  verses: Verse[];
  cachedOn: Date;
}

type Chapters = Map<string, Chapter | undefined>;

// - - - - - - - - - -
interface Book {
  chapters: Chapters;
  cachedOn: Date;
}

type Books = Map<string, Book>;

// - - - - - - - - - -
interface Bible {
  id: string;
  dblId: string;
  name: string;
  nameLocal: string;
  language: Language;
  books?: Books;
  cachedOn: Date;
}

type abbreviation = string;

type BibleLibrary = Map<abbreviation, Bible>;

// - - - - - - - - - -
const getVerseIDs = (verseResponses: VerseResponse[]): Verse[] => {
  const versesIDs: Verse[] = [];

  for (const verseResponse of verseResponses) {
    versesIDs.push(verseResponse.id);
  }

  return versesIDs;
};

const getBooksAndChapters = (
  booksAndChaptersResponses: BookResponse[]
): Books => {
  const books: Books = new Map();

  for (const bookResponse of booksAndChaptersResponses) {
    const bookID = bookResponse.id;
    const bookChapters: Chapters = new Map();
    for (const chapter of bookResponse.chapters) {
      if (chapter.number === 'intro') {
        continue;
      }
      const chapterID = chapter.id;
      bookChapters.set(chapterID, undefined);
    }
    const bookObj: Book = {
      chapters: bookChapters,
      cachedOn: new Date(),
    };

    books.set(bookID, bookObj);
  }

  return books;
};

const getBibles = (bibleResponses: BibleResponse[]): BibleLibrary => {
  const bibleLibrary: BibleLibrary = new Map();

  for (const bibleResponse of bibleResponses) {
    const bibleObj: Bible = {
      id: bibleResponse.id,
      dblId: bibleResponse.dblId,
      name: bibleResponse.name,
      nameLocal: bibleResponse.nameLocal,
      language: bibleResponse.language,
      cachedOn: new Date(),
    };

    bibleLibrary.set(bibleResponse.abbreviation, bibleObj);
  }

  return bibleLibrary;
};

async function buildBibleLibrary(
  languages: string[],
  config?: AxiosRequestConfig
): Promise<BibleLibrary> {
  let bibleLibrary: Map<abbreviation, Bible> = new Map();

  for (const language of languages) {
    const biblesInLanguage: BibleResponse[] = await fetchBibles(
      language,
      config
    );

    const bibleLibraryInLang = getBibles(biblesInLanguage);

    bibleLibrary = new Map([
      ...bibleLibrary.entries(),
      ...bibleLibraryInLang.entries(),
    ]);
  }

  return bibleLibrary;
}

async function addBooksAndChapters(
  bibleLibrary: BibleLibrary,
  bibleAbbreviations: string[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const abbreviation of bibleAbbreviations) {
    const bibleID = bibleLibrary.get(abbreviation)?.id;

    console.log(`bibleID: ${bibleID}`);
    if (bibleID === undefined) {
      throw Error;
    }

    const booksAndChapters: BookResponse[] = await fetchBooksAndChapters(
      bibleID,
      config
    );

    bibleLibrary.get(abbreviation)!.books =
      getBooksAndChapters(booksAndChapters);
  }
}

interface chapterToFetchVerses {
  bible: string;
  book: string;
  chapter: string;
}

async function addVerses(
  bibleLibrary: BibleLibrary,
  chapters: chapterToFetchVerses[],
  config?: AxiosRequestConfig
): Promise<void> {
  for (const chapter of chapters) {
    console.log(chapter.bible);
    const bible = bibleLibrary.get(chapter.bible);

    if (bible === undefined) {
      throw Error;
    }

    const book = bible.books?.get(chapter.book);
    if (book === undefined) {
      throw Error;
    }

    const verseResponses = await fetchVerses(chapter.chapter, bible.id, config);

    const verseIDs = getVerseIDs(verseResponses);

    console.log(
      bibleLibrary.get(chapter.bible)!.books!.get(chapter.book)!.chapters
    );

    console.log(
      bibleLibrary
        .get(chapter.bible)!
        .books!.get(chapter.book)!
        .chapters.get(chapter.chapter)
    );

    const chapterAndVerses: Chapter = {
      verses: verseIDs,
      cachedOn: new Date(),
    };

    bibleLibrary
      .get(chapter.bible)!
      .books!.get(chapter.book)!
      .chapters.set(chapter.chapter, chapterAndVerses);
  }
}

const bibleLibrary = await buildBibleLibrary(['eng', 'mal']);
await addBooksAndChapters(bibleLibrary, ['MAL10RO']);
await addVerses(bibleLibrary, [
  {
    bible: 'MAL10RO',
    book: 'GEN',
    chapter: 'GEN.1',
  },
]);

console.log(
  bibleLibrary.get('MAL10RO')?.books?.get('GEN')?.chapters.get('GEN.1')
);
