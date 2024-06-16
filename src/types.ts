// - - - - - - - - - -
import {books} from './books.js';
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
export type BibleAbbreviation = string; // NIV

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
export interface BookResponse {
  readonly id: string;
  readonly abbreviation: string;
  readonly name: string;
  readonly nameLong: string;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface BibleResponse {
  readonly id: string;
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

interface Cached {
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export interface Bible extends Cached {
  readonly id: string;
  readonly language: string;
  readonly scriptDirection: ScriptDirection;
}

// - - - - - - - - - -
export type Bibles = {
  [BibleAbbreviation: string]: Bible;
};

// - - - - - - - - - -
export interface BookIdAndAbbreviation {
  readonly id: keyof typeof books;
  readonly isAbbreviation: boolean;
}

// - - - - - - - - - -
export type VoteTally = {
  [bookID: string]: number;
};

// - - - - - - - - - -
export type BookName = string;

// - - - - - - - - - -
export interface BookNameDetails extends BookIdAndAbbreviation {
  readonly name: BookName;
}

// - - - - - - - - - -
export interface BookIdWithLanguage extends BookIdAndAbbreviation {
  readonly language: string;
  readonly scriptDirection: ScriptDirection;
}

// - - - - - - - - - -
export interface BookNameReference extends BookIdWithLanguage {
  readonly bibles: BibleAbbreviation[];
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type BookNames = {
  [BookName: string]: BookNameReference[];
};

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
  readonly bibleID: string;
}

// - - - - - - - - - -
export interface Passage {
  readonly query: PassageQuery;
  readonly response: PassageAndFumsResponse;
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export type Passages = {
  [passageAndBible: string]: Passage[];
};

// - - - - - - - - -
export interface ReferenceGroup {
  readonly bookName: string;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bibles: string[];
}

// - - - - - - - - - -
export interface Cache {
  updatedSinceLoad: boolean;
}

// - - - - - - - - - -
export interface BiblesCache extends Cache {
  bibles: Bibles;
  bookNames: BookNames;
}

// - - - - - - - - - -

export interface PassagesCache extends Cache {
  passages: Passages;
}

// - - - - - - - - - -
export type ReferenceMap = Map<string, Reference[]>;

// - - - - - - - - - -
export type PassageMap = Map<string, PassageAndFumsResponse[]>;
