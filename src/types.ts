// - - - - - - - - - -
import {books} from './books.js';

export type ValueOf<T> = T[keyof T];

// - - - - - - - - -
export interface Reference {
  readonly book: keyof typeof books;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bible: string;
}

// - - - - - - - - - -
export interface Validation {
  passed: boolean;
  error?: string;
}

// - - - - - - - - - -
export interface CachedOn {
  cachedOn: Date;
}

// - - - - - - - - - -
export type JSONFile = {
  [key: string]: unknown;
};

// - - - - - - - - - -
export type BibleAbbreviation = string; // NIV
// - - - - - - - - - -
export type BookID = string; // GEN
// - - - - - - - - - -
export type BibleAndBook = string;
// - - - - - - - - - -
export type ScriptDirection = 'RTL' | 'LTR';

// - - - - - - - - - -
export interface Language {
  readonly id: string;
  readonly name: string;
  readonly nameLocal: string;
  readonly script: string;
  readonly scriptDirection: ScriptDirection;
}

// - - - - - - - - - -
export interface LanguageResponse extends Language {
  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface VerseResponse {
  readonly id: string;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface ChapterResponse {
  readonly id: string;
  readonly number: string;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface BookResponse {
  readonly id: string;
  readonly abbreviation: string;
  readonly name: string;
  readonly nameLong: string;
  readonly chapters: ChapterResponse[];

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface BibleResponse {
  readonly id: string;
  readonly dblId: string;
  readonly name: string;
  readonly nameLocal: string;
  readonly abbreviation: string;
  readonly language: LanguageResponse;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface PassageResponse {
  readonly id: string;
  readonly reference: string;
  readonly content: string;
  readonly copyright: string;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface FumsResponse {
  readonly fums: string;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface PassageAndFumsResponse {
  readonly data: PassageResponse;
  readonly meta: FumsResponse;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface Bible {
  readonly id: string;
  readonly dblId: string;
  readonly name: string;
  readonly nameLocal: string;
  readonly language: Language;
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type Bibles = Map<BibleAbbreviation, Bible>;

// - - - - - - - - - -
export interface BookNameDetails {
  id: keyof typeof books;
  isAbbreviation: boolean;
}

// - - - - - - - - - -
export type BookName = string;

// - - - - - - - - - -
export interface BookNameMoreDetails extends BookNameDetails {
  name: BookName;
}

// - - - - - - - - - -
export interface BookNameDetailsWithDirection extends BookNameDetails {
  language: string;
  scriptDirection: ScriptDirection;
}

// - - - - - - - - - -
export interface BookNameReference extends BookNameDetailsWithDirection {
  bibles: BibleAbbreviation[];
}

// - - - - - - - - - -
export type BookNames = Map<BookName, BookNameReference[]>;

// - - - - - - - - - -
export interface BooksInBible {
  readonly books: BookID[];
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type BiblesToBooks = Map<BibleAbbreviation, BooksInBible>;
// - - - - - - - - - -
export type ChapterID = string; // GEN.1
// - - - - - - - - - -
export interface ChaptersInBook {
  readonly chapters: ChapterID[];
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type BooksToChapters = Map<BibleAndBook, ChaptersInBook>;

// - - - - - - - - - -
export interface PassageOptions {
  readonly contentType?: 'html' | 'json' | 'text';
  readonly includeNotes?: boolean;
  readonly includeTitles?: boolean;
  readonly includeChapterNumbers?: boolean;
  readonly includeVerseNumbers?: boolean;
  readonly includeVerseSpans?: boolean;
}

// - - - - - - - - - -
export interface PassageQuery extends PassageOptions {
  readonly passageID: string;
  readonly bibleAbbreviation: string;
}

// - - - - - - - - - -
export type PassageQueryString = string;

// - - - - - - - - - -
export interface PassageText {
  readonly reference: string;
  readonly content: string;
  readonly copyright: string;
}

// - - - - - - - - - -
export type Fums = string;

// - - - - - - - - - -
export interface Passage {
  readonly text: PassageText;
  readonly fums: Fums;
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type Passages = Map<PassageQueryString, Passage>;

// - - - - - - - - - -
export type VerseID = string; // GEN.1.1
// - - - - - - - - - -
export interface VersesInChapter {
  readonly verses: VerseID[];
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type BibleAndChapter = string;
// - - - - - - - - - -
export type ChaptersToVerses = Map<BibleAndChapter, VersesInChapter>;

// - - - - - - - - - -
export interface ChapterToFetchVerses {
  bibleAbbreviation: string;
  bookID: string;
  chapterID: string;
}

// - - - - - - - - -
export interface ReferenceGroup {
  readonly bookName: string;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bibles?: string[];
}

// - - - - - - - - - -
export interface Cache {
  bibles: Bibles;
  bookNames: BookNames;
  biblesToBooks: BiblesToBooks;
  booksToChapters: BooksToChapters;
  chaptersToVerses: ChaptersToVerses;
  passages: Passages;
}
