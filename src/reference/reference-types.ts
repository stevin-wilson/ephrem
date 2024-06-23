import {BOOK_IDs} from './book-ids.js';
import {AxiosRequestConfig} from 'axios';
import {UpdateBiblesCacheOptions} from '../cache/cache-types.js';
import {FetchBiblesOptions} from '../api-bible/api-types.js';

export interface ReferenceGroup {
  readonly bookName: string;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bibles: string[];
}

export interface Reference {
  readonly book: keyof typeof BOOK_IDs;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bible: string;
}

export type VoteTally = {
  [bookID: string]: number;
};

export type References = Record<string, Reference[]>;

export interface GetBookIdOptions extends UpdateBiblesCacheOptions {
  bookName: string;
  bibleAbbreviation?: string;
  useMajorityFallback?: boolean;
}

export class BookNotFoundError extends Error {
  public readonly context?: GetBookIdOptions;

  constructor(message = 'Book Not Found', context: GetBookIdOptions) {
    super(message);
    this.name = 'BookNotFoundError';
    this.context = context;
  }
}

export interface SplitReferenceGroupOptions extends UpdateBiblesCacheOptions {
  referenceGroup: ReferenceGroup;
  useMajorityFallback?: boolean;
}

export interface ParseReferencesOptions extends UpdateBiblesCacheOptions {
  input: string;
  delimiter?: string;
  defaultBibles?: string[];
  useMajorityFallback?: boolean;
}
