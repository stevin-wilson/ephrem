import {AxiosRequestConfig} from 'axios';

export interface FetchOptions {
  delayBetweenCalls?: number;
  config?: AxiosRequestConfig;
  retries?: number;
  initialBackoff?: number;
}

export interface FetchBiblesOptions extends FetchOptions {
  language?: string;
}

export class BiblesFetchError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string,
    public context: FetchBiblesOptions
  ) {
    super(message);
    this.name = 'BiblesFetchError';
  }
}

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
export interface BibleResponse {
  readonly id: string;
  readonly abbreviation: string;
  readonly language: LanguageResponse;

  readonly [key: string]: unknown;
}

export interface FetchBooksOptions extends FetchOptions {
  bibleID: string;
}

export class BooksFetchError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string,
    public context: FetchBooksOptions
  ) {
    super(message);
    this.name = 'BooksFetchError';
  }
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
export interface PassageResponse {
  readonly id: string;
  readonly reference: string;
  readonly content: string;
  readonly copyright: string;

  readonly [key: string]: unknown;
}

// - - - - - - - - - -
export interface FetchPassageOptions extends FetchOptions {
  passageID: string;
  bibleID: string;
  passageOptions: PassageOptions;
}

export class PassageFetchError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string,
    public context: FetchPassageOptions
  ) {
    super(message);
    this.name = 'PassageFetchError';
  }
}

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
