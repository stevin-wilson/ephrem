import {
  FetchOptions,
  PassageAndFumsResponse,
  PassageOptions,
} from '../api-bible/api-types.js';
import {BOOK_IDs} from '../reference/book-ids.js';

interface Cached {
  readonly cachedOn: Date;
}

// - - - - - - - - - -
export interface Bible extends Cached {
  readonly id: string;
  readonly language: string;
}

// - - - - - - - - - -
export type Bibles = {
  [BibleAbbreviation: string]: Bible;
};

export interface loadCacheOptions {
  cacheDir?: string;
  maxCacheAgeDays?: number;
  timestamp?: Date;
}

export interface UpdateBiblesOptions extends FetchOptions {
  biblesCache?: BiblesCache;
  languages?: string[];
  biblesToExclude?: string[];
  timestamp?: Date;
  cacheDir?: string;
  maxCacheAgeDays?: number;
}

export interface UpdateBookNamesOptions extends FetchOptions {
  biblesCache?: BiblesCache;
  languages?: string[];
  timestamp?: Date;
  cacheDir?: string;
  maxCacheAgeDays?: number;
}

export interface UpdateBiblesCacheOptions extends UpdateBiblesOptions {
  forceUpdateBiblesCache?: boolean;
}

export interface PreparePassageOptions extends UpdateBiblesCacheOptions {
  passageID: string;
  bibleAbbreviation: string;
  passagesCache?: PassagesCache;
  passageOptions?: PassageOptions;
  forcePassageApiCall?: boolean;
}

// - - - - - - - - - -
export interface Cache {
  updatedSinceLoad: boolean;
}

// - - - - - - - - - -
export type BookNames = {
  [BookName: string]: BookNameReference[];
};

export interface BiblesCache extends Cache {
  bibles: Bibles;
  bookNames: BookNames;
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

export type Passages = {
  [passageAndBible: string]: Passage[];
};

export interface PassagesCache extends Cache {
  passages: Passages;
}

// - - - - - - - - - -
export interface BookIdAndAbbreviation {
  readonly id: keyof typeof BOOK_IDs;
  readonly isAbbreviation: boolean;
}

export interface BookNameDetails extends BookIdAndAbbreviation {
  readonly name: string;
}

export interface BookIdWithLanguage extends BookIdAndAbbreviation {
  readonly language: string;
}

// - - - - - - - - - -
export interface BookNameReference extends BookIdWithLanguage {
  readonly bibles: string[];
  readonly cachedOn: Date;
}

export interface GetBibleIdOptions extends UpdateBiblesCacheOptions {
  bibleAbbreviation: string;
}

export class BibleNotAvailableError extends Error {
  constructor(public context: GetBibleIdOptions) {
    super(
      'Bible is not available on API.Bible or is inaccessible using the current API key.'
    );
    this.name = 'BibleNotAvailableError';
    this.context = context;
  }
}
