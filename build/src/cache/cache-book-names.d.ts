import { BookNameDetails, BookNames } from './cache-types.js';
import { BookResponse } from '../api-bible/api-types.js';
export declare const saveBookNames: (bookNames: BookNames, cacheDir?: string) => Promise<void>;
export declare const cleanBookNamesCache: (bookNames: BookNames, timestamp?: Date, maxCacheAgeDays?: number) => [BookNames, boolean];
export declare const loadBookNames: (cacheDir?: string) => Promise<BookNames>;
export declare const prepareBookNames: (bookResponses: BookResponse[]) => BookNameDetails[];
