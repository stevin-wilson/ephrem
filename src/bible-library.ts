// - - - - - - - - - -
import {
  BibleResponse,
  BookResponse,
  ChapterResponse,
  fetchBibles,
  fetchBooksAndChapters,
  fetchPassage,
  fetchVerses,
  Language,
  ScriptDirection,
  VerseResponse,
} from './fetch-bible.js';
import {AxiosRequestConfig} from 'axios';
import {expandHomeDir, sortObject, writeJsonFile} from './utils.js';
import fs from 'fs-extra';

const cacheDir: string = expandHomeDir(
  process.env.CACHE_PATH || '~/ephrem/cache'
);

// - - - - - - - - - -
interface CachedOn {
  cachedOn: Date;
}

const cleanUpOldRecords = <K, V extends CachedOn>(
  map: Map<K, V>,
  max_age_days = 14
): Map<K, V> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - max_age_days);

  const cleanedMap = new Map<K, V>();

  map.forEach((value, key) => {
    if (value.cachedOn > thresholdDate) {
      cleanedMap.set(key, value);
    }
  });

  return cleanedMap;
};

// - - - - - - - - - -
// Bibles and Chapter -> Verses
type BibleAndChapter = string;
const getBibleAndChapterString = (
  bibleAbbreviation: string,
  chapterID: string
) => `${bibleAbbreviation}@${chapterID}`;

type VerseID = string; // GEN.1.1

interface VersesInChapter {
  readonly verses: VerseID[];
  readonly cachedOn: Date;
}

type ChaptersToVerses = Map<BibleAndChapter, VersesInChapter>;

const chaptersToVersesCache = `${cacheDir}/chapters-to-verses.json`;

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
// Bibles and Books -> Chapter
type BibleAndBook = string;

const getBibleAndBookString = (bibleAbbreviation: string, bookID: string) =>
  `${bibleAbbreviation}@${bookID}`;

type ChapterID = string; // GEN.1

interface ChaptersInBook {
  readonly chapters: ChapterID[];
  readonly cachedOn: Date;
}

type BooksToChapters = Map<BibleAndBook, ChaptersInBook>;

const booksToChaptersCache = `${cacheDir}/books-to-chapters.json`;

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

const booksToChapters: BooksToChapters = await loadBooksToChapters();

// - - - - - - - - - -
// Bibles -> Books
type BibleAbbreviation = string; // NIV
type BookID = string; // NIV

interface BooksInBible {
  readonly books: BookID[];
  readonly cachedOn: Date;
}

type BiblesToBooks = Map<BibleAbbreviation, BooksInBible>;

const biblesToBooksCache = `${cacheDir}/bibles-to-books.json`;

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

const biblesToBooks: BiblesToBooks = await loadBiblesToBooks();

// - - - - - - - - - -
//  Abbreviation -> Bible
interface Bible {
  readonly id: string;
  readonly dblId: string;
  readonly name: string;
  readonly nameLocal: string;
  readonly language: Language;
  readonly cachedOn: Date;
}

type Bibles = Map<BibleAbbreviation, Bible>;

const biblesCache = `${cacheDir}/bibles.json`;

// serialize the BooksToChapters map to JSON
const serializeBibles = (bibles: Bibles): string => {
  const obj = Array.from(bibles.entries()).map(
    ([bibleAbbreviation, value]) => ({
      bibleAbbreviation: bibleAbbreviation,
      id: value.id,
      dblId: value.dblId,
      name: value.name,
      nameLocal: value.nameLocal,
      language: value.language,
      cachedOn: value.cachedOn.toISOString(),
    })
  );
  return JSON.stringify(obj, null, 2);
};

const saveBibles = async (bibles: Bibles, filePath: string = biblesCache) => {
  await writeJsonFile(filePath, serializeBibles(bibles));
};

// deserialize JSON back to a BooksToChapters map
const deserializeBibles = (jsonData: string): Bibles => {
  const arr = JSON.parse(jsonData);
  const map: Bibles = new Map();

  arr.forEach((item: any) => {
    const key: BibleAbbreviation = item.bibleAbbreviation;
    const value: Bible = {
      id: item.id,
      dblId: item.dblId,
      name: item.name,
      nameLocal: item.nameLocal,
      language: item.language,
      cachedOn: new Date(item.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

const loadBibles = async (
  filePath: string = biblesCache,
  max_age_days = 14
): Promise<Bibles> => {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return cleanUpOldRecords(deserializeBibles(jsonData), max_age_days);
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as Bibles;
  }
};

const bibles: Bibles = await loadBibles();

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
const clearCache = (): void => {
  bibles.clear();
  biblesToBooks.clear();
  booksToChapters.clear();
  chaptersToVerses.clear();
  passages.clear();
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

// - - - - - - - - - -
const getLanguageofBible = (bibleAbbreviation: string): string => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.language.id.toLowerCase();
};

// - - - - - - - - - -
const getScriptDirectionOfBible = (
  bibleAbbreviation: string
): ScriptDirection => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.language.scriptDirection;
};

// - - - - - - - - - -
const getLocalNameOfBible = (bibleAbbreviation: string): string => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.nameLocal;
};

// - - - - - - - - - -
const isSupportedBible = (
  bibleAbbreviation: string,
  languages: string[]
): boolean => {
  if (!bibles.has(bibleAbbreviation)) {
    return false;
  }

  for (const [bibleAbbreviationSupported, bibleDetails] of bibles) {
    if (
      bibleAbbreviation === bibleAbbreviationSupported &&
      languages.includes(bibleDetails.language.id)
    ) {
      return true;
    }
  }
  return false;
};

// - - - - - - - - - -
const isSupportedBook = (
  bibleAbbreviation: string,
  bookID: string
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
  chapterID: string
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
  verseID: string
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
  endChapterID: string
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
  endVerseID: string
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
interface PassageQuery {
  readonly passageID: string;
  readonly bibleAbbreviation: string;
  readonly contentType: 'html' | 'json' | 'text';
  readonly includeNotes: boolean;
  readonly includeTitles: boolean;
  readonly includeChapterNumbers: boolean;
  readonly includeVerseNumbers: boolean;
  readonly includeVerseSpans: boolean;
}

type PassageQueryString = string;

const getStringForPassageQuery = (passageQuery: PassageQuery): string => {
  const sortedPassageQuery = sortObject(passageQuery);
  return JSON.stringify(sortedPassageQuery);
};

interface PassageText {
  readonly reference: string;
  readonly content: string;
  readonly copyright: string;
}

type Fums = string;

interface Passage {
  readonly text: PassageText;
  readonly fums: Fums;
  readonly cachedOn: Date;
}

type Passages = Map<PassageQueryString, Passage>;

const passagesCache = `${cacheDir}/passages.json`;

const serializePassages = (map: Passages): string => {
  const arr = Array.from(map.entries()).map(([key, value]) => ({
    passageQuery: key,
    passage: value,
  }));
  return JSON.stringify(arr, null, 2);
};

const savePassages = async (
  passages: Passages,
  filePath: string = passagesCache
) => {
  await writeJsonFile(filePath, serializePassages(passages));
};

// - - - - - - - - - -
const deserializePassages = (json: string): Passages => {
  const arr = JSON.parse(json);
  const map: Passages = new Map();

  arr.forEach((item: any) => {
    const key: PassageQueryString = item.passageQuery;
    const value: Passage = {
      text: item.passage.text,
      fums: item.passage.fums,
      cachedOn: new Date(item.passage.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

// - - - - - - - - - -
const loadPassages = async (
  filePath: string = passagesCache,
  max_age_days = 14
): Promise<Passages> => {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return cleanUpOldRecords(deserializePassages(jsonData), max_age_days);
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as Passages;
  }
};

// - - - - - - - - - -
const passages: Passages = await loadPassages();

// - - - - - - - - - -
const updatePassage = async (
  passageID: string,
  bibleAbbreviation: string,
  contentType: 'html' | 'json' | 'text' = 'html',
  includeNotes = false,
  includeTitles = false,
  includeChapterNumbers = false,
  includeVerseNumbers = false,
  includeVerseSpans = false,
  config?: AxiosRequestConfig
): Promise<void> => {
  const passageQuery: PassageQuery = {
    passageID,
    bibleAbbreviation,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans,
  };

  const passageQueryString = getStringForPassageQuery(passageQuery);

  if (passages.get(passageQueryString)?.text) {
    return;
  }

  const bibleID = bibles.get(passageQuery.bibleAbbreviation)?.id;
  if (!bibleID) {
    throw Error;
  }

  const passageAndFums = await fetchPassage(
    passageID,
    bibleID,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans,
    config
  );

  const passage: PassageText = {
    reference: passageAndFums.data.reference,
    content: passageAndFums.data.content,
    copyright: passageAndFums.data.copyright,
  };
  const fums: Fums = passageAndFums.meta.fums;
  const cachedOn: Date = new Date();
  const passageText: Passage = {text: passage, fums: fums, cachedOn: cachedOn};
  passages.set(passageQueryString, passageText);
};

// - - - - - - - - - -
const getPassage = async (
  passageID: string,
  bibleAbbreviation: string,
  contentType: 'html' | 'json' | 'text' = 'html',
  includeNotes = false,
  includeTitles = false,
  includeChapterNumbers = false,
  includeVerseNumbers = false,
  includeVerseSpans = false,
  config?: AxiosRequestConfig
): Promise<Passage> => {
  const passageQuery: PassageQuery = {
    passageID,
    bibleAbbreviation,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans,
  };

  const passageQueryString = getStringForPassageQuery(passageQuery);

  if (passages.get(passageQueryString) === undefined) {
    await updatePassage(
      passageID,
      bibleAbbreviation,
      contentType,
      includeNotes,
      includeTitles,
      includeChapterNumbers,
      includeVerseNumbers,
      includeVerseSpans,
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
const saveCache = async (): Promise<void> => {
  if (booksToChapters.size > 0) {
    try {
      await saveBooksToChapters(booksToChapters, booksToChaptersCache);
    } catch (error) {
      console.error('Error saving booksToChapters to cache', error);
    }
  }

  if (bibles.size > 0) {
    try {
      await saveBibles(bibles, biblesCache);
    } catch (error) {
      console.error('Error saving bibles to cache', error);
    }
  }

  if (passages.size > 0) {
    try {
      await savePassages(passages, passagesCache);
    } catch (error) {
      console.error('Error saving passages to cache', error);
    }
  }

  if (biblesToBooks.size > 0) {
    try {
      await saveBiblesToBooks(biblesToBooks, biblesToBooksCache);
    } catch (error) {
      console.error('Error saving biblesToBooks to cache', error);
    }
  }

  if (chaptersToVerses.size > 0) {
    try {
      await saveChaptersToVerses(chaptersToVerses, chaptersToVersesCache);
    } catch (error) {
      console.error('Error saving chaptersToVerses to cache', error);
    }
  }
};

// - - - - - - - - - -

await updateBibles(['ENG', 'mal']);
await updateBooksAndChapters(['BSB']);

console.log(booksToChapters.keys());
console.log(booksToChapters.get(getBibleAndBookString('BSB', 'GEN')));

await updateVerses([
  {bibleAbbreviation: 'BSB', bookID: 'GEN', chapterID: 'GEN.1'},
]);
await getPassage('DAN.1.2', 'BSB', 'text', false, false, false, false, false);
console.log([...passages]);
saveCache();
